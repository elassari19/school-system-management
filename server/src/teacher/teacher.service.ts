import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from '../common/entities/teacher.entity';
import { CreateTeacherDto, UpdateTeacherDto, GetTeacherDto } from './dto/teacher.dto';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    private redisService: RedisService,
  ) {}

  async findOne(id: string): Promise<Teacher> {
    const cacheKey = `teacher:${id}`;
    const cached = await this.redisService.getCache<Teacher>(cacheKey);
    if (cached) return cached;

    const teacher = await this.teacherRepository.findOne({
      where: { id },
      relations: ['user', 'subject', 'classes', 'education', 'experience'],
    });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    await this.redisService.setCache(cacheKey, teacher, 60);
    return teacher;
  }

  async findAll(query: any = {}): Promise<Teacher[]> {
    const cacheKey = `teacher:all:${JSON.stringify(query)}`;
    const cached = await this.redisService.getCache<Teacher[]>(cacheKey);
    if (cached) return cached;

    const teachers = await this.teacherRepository.find({
      ...query,
      relations: ['user', 'subject', 'classes', 'education', 'experience'],
    });
    await this.redisService.setCache(cacheKey, teachers, 60);
    return teachers;
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = `teacher:count:${JSON.stringify(query)}`;
    const cached = await this.redisService.getCache<number>(cacheKey);
    if (cached !== null) return cached;

    const count = await this.teacherRepository.count(query);
    await this.redisService.setCache(cacheKey, count, 60);
    return count;
  }

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const { classIds, ...data } = createTeacherDto;
    const teacher = this.teacherRepository.create(data);
    const savedTeacher = await this.teacherRepository.save(teacher);

    if (classIds && classIds.length > 0) {
      // Handle class associations if needed
    }

    await this.redisService.clearCachePattern('teacher:*');
    return savedTeacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.findOne(id);
    Object.assign(teacher, updateTeacherDto);
    const updatedTeacher = await this.teacherRepository.save(teacher);
    await this.redisService.clearCachePattern('teacher:*');
    return updatedTeacher;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.teacherRepository.delete(id);
    await this.redisService.clearCachePattern('teacher:*');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.teacherRepository.delete(ids);
    await this.redisService.clearCachePattern('teacher:*');
  }

  async deleteAll(): Promise<void> {
    await this.teacherRepository.clear();
    await this.redisService.clearCachePattern('teacher:*');
  }
}