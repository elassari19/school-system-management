import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../common/entities/course.entity';
import { CreateCourseDto, UpdateCourseDto, GetCourseDto } from './dto/course.dto';
import { CacheService } from '../common/cache/cache.service';

import { sanitizeFindQuery } from '../utils/query-sanitizer';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    private cacheService: CacheService,
  ) {}

  async findOne(id: string): Promise<Course> {
    const cacheKey = this.cacheService.generateEntityCacheKey('course', id);
    return this.cacheService.getOrSet(cacheKey, async () => {
      const course = await this.courseRepository.findOne({
        where: { id },
        relations: ['chapters', 'subject', 'user', 'grade', 'exams'],
      });
      if (!course) {
        throw new NotFoundException('Course not found');
      }
      return course;
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['course'] });
  }

  async findAll(query: any = {}): Promise<Course[]> {
    const cacheKey = this.cacheService.generateListCacheKey('course', query);
    return this.cacheService.getOrSet(cacheKey, async () => {
      const options = sanitizeFindQuery<Course>(query);
      return this.courseRepository.find({
        ...options,
        relations: Array.isArray(options.relations) && options.relations.length ? (options.relations as string[]) : ['chapters', 'subject', 'user', 'grade', 'exams'],
      });
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['course'] });
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = this.cacheService.generateCacheKey('course', 'count', JSON.stringify(query));
    return this.cacheService.getOrSet(cacheKey, async () => {
      return this.courseRepository.count(query);
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['course'] });
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
    const savedCourse = await this.courseRepository.save(course);
    await this.cacheService.invalidateByTag('course');
    return savedCourse;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    Object.assign(course, updateCourseDto);
    const updatedCourse = await this.courseRepository.save(course);
    await this.cacheService.invalidateByTag('course');
    return updatedCourse;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.courseRepository.delete(id);
    await this.cacheService.invalidateByTag('course');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.courseRepository.delete(ids);
    await this.cacheService.invalidateByTag('course');
  }

  async deleteAll(): Promise<void> {
    await this.courseRepository.clear();
    await this.cacheService.invalidateByTag('course');
  }
}