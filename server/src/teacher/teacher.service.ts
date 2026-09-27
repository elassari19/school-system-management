import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from '../common/entities/teacher.entity';
import { CreateTeacherDto, UpdateTeacherDto, GetTeacherDto } from './dto/teacher.dto';
import { CacheService } from '../common/cache/cache.service';

import { sanitizeFindQuery } from '../utils/query-sanitizer';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    private cacheService: CacheService,
  ) {}

  async findOne(id: string): Promise<Teacher> {
    const cacheKey = this.cacheService.generateEntityCacheKey('teacher', id);
    return this.cacheService.getOrSet(cacheKey, async () => {
      const teacher = await this.teacherRepository.findOne({
        where: { id },
        relations: ['user', 'subject', 'classes', 'education', 'experience'],
      });
      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }
      return teacher;
    }, { ttl: this.cacheService['cacheConfig'].getTtl('user'), tags: ['teacher'] });
  }

  async findAll(query: any = {}): Promise<Teacher[]> {
    const cacheKey = this.cacheService.generateListCacheKey('teacher', query);
    return this.cacheService.getOrSet(cacheKey, async () => {
      const options = sanitizeFindQuery<Teacher>(query);
      return this.teacherRepository.find({
        ...options,
        relations: Array.isArray(options.relations) && options.relations.length ? (options.relations as string[]) : ['user', 'subject', 'classes', 'education', 'experience'],
      });
    }, { ttl: this.cacheService['cacheConfig'].getTtl('user'), tags: ['teacher'] });
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = this.cacheService.generateCacheKey('teacher', 'count', JSON.stringify(query));
    return this.cacheService.getOrSet(cacheKey, async () => {
      return this.teacherRepository.count(query);
    }, { ttl: this.cacheService['cacheConfig'].getTtl('user'), tags: ['teacher'] });
  }

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const { classIds, ...data } = createTeacherDto;
    const teacher = this.teacherRepository.create(data);
    const savedTeacher = await this.teacherRepository.save(teacher);

    if (classIds && classIds.length > 0) {
      // Handle class associations if needed
    }

    await this.cacheService.invalidateByTag('teacher');
    return savedTeacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.findOne(id);
    Object.assign(teacher, updateTeacherDto);
    const updatedTeacher = await this.teacherRepository.save(teacher);
    await this.cacheService.invalidateByTag('teacher');
    return updatedTeacher;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.teacherRepository.delete(id);
    await this.cacheService.invalidateByTag('teacher');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.teacherRepository.delete(ids);
    await this.cacheService.invalidateByTag('teacher');
  }

  async deleteAll(): Promise<void> {
    await this.teacherRepository.clear();
    await this.cacheService.invalidateByTag('teacher');
  }
}