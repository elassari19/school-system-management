import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../common/entities/user.entity';
import { CreateUserDto, UpdateUserDto, GetUserDto } from './dto/user.dto';
import { CacheService } from '../common/cache/cache.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private cacheService: CacheService,
  ) {}

  async findOne(id: string): Promise<User> {
    const cacheKey = this.cacheService.generateEntityCacheKey('user', id);
    return this.cacheService.getOrSet(cacheKey, async () => {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    }, { ttl: this.cacheService['cacheConfig'].getTtl('user'), tags: ['user'] });
  }

  async findAll(query: any = {}): Promise<User[]> {
    const cacheKey = this.cacheService.generateListCacheKey('user', query);
    return this.cacheService.getOrSet(cacheKey, async () => {
      return this.userRepository.find(query);
    }, { ttl: this.cacheService['cacheConfig'].getTtl('user'), tags: ['user'] });
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = this.cacheService.generateCacheKey('user', 'count', JSON.stringify(query));
    return this.cacheService.getOrSet(cacheKey, async () => {
      return this.userRepository.count(query);
    }, { ttl: this.cacheService['cacheConfig'].getTtl('user'), tags: ['user'] });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    await this.cacheService.invalidateByTag('user');
    return savedUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    await this.cacheService.invalidateByTag('user');
    await this.cacheService.invalidateByTag('student');
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.userRepository.delete(id);
    await this.cacheService.invalidateByTag('user');
    await this.cacheService.invalidateByTag('student');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.userRepository.delete(ids);
    await this.cacheService.invalidateByTag('user');
  }

  async deleteAll(): Promise<void> {
    await this.userRepository.clear();
    await this.cacheService.invalidateByTag('user');
  }
}