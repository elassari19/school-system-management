import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../common/entities/course.entity';
import { CreateCourseDto, UpdateCourseDto, GetCourseDto } from './dto/course.dto';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    private redisService: RedisService,
  ) {}

  async findOne(id: string): Promise<Course> {
    const cacheKey = `course:${id}`;
    const cached = await this.redisService.getCache<Course>(cacheKey);
    if (cached) return cached;

    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['chapters', 'subject', 'user', 'grade', 'exams'],
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    await this.redisService.setCache(cacheKey, course, 60);
    return course;
  }

  async findAll(query: any = {}): Promise<Course[]> {
    const cacheKey = `course:all:${JSON.stringify(query)}`;
    const cached = await this.redisService.getCache<Course[]>(cacheKey);
    if (cached) return cached;

    const courses = await this.courseRepository.find({
      ...query,
      relations: ['chapters', 'subject', 'user', 'grade', 'exams'],
    });
    await this.redisService.setCache(cacheKey, courses, 60);
    return courses;
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = `course:count:${JSON.stringify(query)}`;
    const cached = await this.redisService.getCache<number>(cacheKey);
    if (cached !== null) return cached;

    const count = await this.courseRepository.count(query);
    await this.redisService.setCache(cacheKey, count, 60);
    return count;
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
    const savedCourse = await this.courseRepository.save(course);
    await this.redisService.clearCachePattern('course:*');
    return savedCourse;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    Object.assign(course, updateCourseDto);
    const updatedCourse = await this.courseRepository.save(course);
    await this.redisService.clearCachePattern('course:*');
    return updatedCourse;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.courseRepository.delete(id);
    await this.redisService.clearCachePattern('course:*');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.courseRepository.delete(ids);
    await this.redisService.clearCachePattern('course:*');
  }

  async deleteAll(): Promise<void> {
    await this.courseRepository.clear();
    await this.redisService.clearCachePattern('course:*');
  }
}