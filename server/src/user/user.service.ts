import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../common/entities/user.entity';
import { CreateUserDto, UpdateUserDto, GetUserDto } from './dto/user.dto';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private redisService: RedisService,
  ) {}

  async findOne(id: string): Promise<User> {
    const cacheKey = `user:${id}`;
    const cached = await this.redisService.getCache<User>(cacheKey);
    if (cached) return cached;

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.redisService.setCache(cacheKey, user, 60);
    return user;
  }

  async findAll(query: any = {}): Promise<User[]> {
    const cacheKey = `user:all:${JSON.stringify(query)}`;
    const cached = await this.redisService.getCache<User[]>(cacheKey);
    if (cached) return cached;

    const users = await this.userRepository.find(query);
    await this.redisService.setCache(cacheKey, users, 60);
    return users;
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = `user:count:${JSON.stringify(query)}`;
    const cached = await this.redisService.getCache<number>(cacheKey);
    if (cached !== null) return cached;

    const count = await this.userRepository.count(query);
    await this.redisService.setCache(cacheKey, count, 60);
    return count;
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
    await this.redisService.clearCachePattern('user:*');
    return savedUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    await this.redisService.clearCachePattern('user:*');
    await this.redisService.clearCachePattern('student:*');
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.delete(id);
    await this.redisService.clearCachePattern('user:*');
    await this.redisService.clearCachePattern('student:*');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.userRepository.delete(ids);
    await this.redisService.clearCachePattern('user:*');
  }

  async deleteAll(): Promise<void> {
    await this.userRepository.clear();
    await this.redisService.clearCachePattern('user:*');
  }
}