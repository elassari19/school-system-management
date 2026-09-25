import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../common/entities/class.entity';
import { CreateClassDto, UpdateClassDto, GetClassDto } from './dto/class.dto';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    private redisService: RedisService,
  ) {}

  async findOne(id: string): Promise<Class> {
    const cacheKey = `class:${id}`;
    const cached = await this.redisService.getCache<Class>(cacheKey);
    if (cached) return cached;

    const cls = await this.classRepository.findOne({
      where: { id },
      relations: ['students', 'teachers', 'teachers.teacher', 'subject', 'user'],
    });
    if (!cls) {
      throw new NotFoundException('Class not found');
    }
    await this.redisService.setCache(cacheKey, cls, 60);
    return cls;
  }

  async findAll(query: any = {}): Promise<Class[]> {
    const cacheKey = `class:all:${JSON.stringify(query)}`;
    const cached = await this.redisService.getCache<Class[]>(cacheKey);
    if (cached) return cached;

    const classes = await this.classRepository.find({
      ...query,
      relations: ['students', 'teachers', 'teachers.teacher', 'subject', 'user'],
      order: { createdAt: 'ASC' },
    });
    await this.redisService.setCache(cacheKey, classes, 60);
    return classes;
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = `class:count:${JSON.stringify(query)}`;
    const cached = await this.redisService.getCache<number>(cacheKey);
    if (cached !== null) return cached;

    const count = await this.classRepository.count(query);
    await this.redisService.setCache(cacheKey, count, 60);
    return count;
  }

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const cls = this.classRepository.create(createClassDto);
    const savedClass = await this.classRepository.save(cls);
    await this.redisService.clearCachePattern('class:*');
    return savedClass;
  }

  async update(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    const cls = await this.findOne(id);
    Object.assign(cls, updateClassDto);
    const updatedClass = await this.classRepository.save(cls);
    await this.redisService.clearCachePattern('class:*');
    return updatedClass;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.classRepository.delete(id);
    await this.redisService.clearCachePattern('class:*');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.classRepository.delete(ids);
    await this.redisService.clearCachePattern('class:*');
  }

  async deleteAll(): Promise<void> {
    await this.classRepository.clear();
    await this.redisService.clearCachePattern('class:*');
  }
}