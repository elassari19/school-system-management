import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../common/entities/subject.entity';
import { CreateSubjectDto, UpdateSubjectDto, GetSubjectDto } from './dto/subject.dto';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    private redisService: RedisService,
  ) {}

  async findOne(id: string): Promise<Subject> {
    const cacheKey = `subject:${id}`;
    const cached = await this.redisService.getCache<Subject>(cacheKey);
    if (cached) return cached;

    const subject = await this.subjectRepository.findOne({
      where: { id },
      relations: ['courses', 'teacher', 'classes', 'createdBy'],
    });
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }
    await this.redisService.setCache(cacheKey, subject, 60);
    return subject;
  }

  async findAll(query: any = {}): Promise<Subject[]> {
    const cacheKey = `subject:all:${JSON.stringify(query)}`;
    const cached = await this.redisService.getCache<Subject[]>(cacheKey);
    if (cached) return cached;

    const subjects = await this.subjectRepository.find({
      ...query,
      relations: ['courses', 'teacher', 'classes', 'createdBy'],
    });
    await this.redisService.setCache(cacheKey, subjects, 60);
    return subjects;
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = `subject:count:${JSON.stringify(query)}`;
    const cached = await this.redisService.getCache<number>(cacheKey);
    if (cached !== null) return cached;

    const count = await this.subjectRepository.count(query);
    await this.redisService.setCache(cacheKey, count, 60);
    return count;
  }

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = this.subjectRepository.create(createSubjectDto);
    const savedSubject = await this.subjectRepository.save(subject);
    await this.redisService.clearCachePattern('subject:*');
    await this.redisService.clearCachePattern('course:*');
    return savedSubject;
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.findOne(id);
    Object.assign(subject, updateSubjectDto);
    const updatedSubject = await this.subjectRepository.save(subject);
    await this.redisService.clearCachePattern('subject:*');
    await this.redisService.clearCachePattern('course:*');
    return updatedSubject;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.subjectRepository.delete(id);
    await this.redisService.clearCachePattern('subject:*');
    await this.redisService.clearCachePattern('course:*');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.subjectRepository.delete(ids);
    await this.redisService.clearCachePattern('subject:*');
    await this.redisService.clearCachePattern('course:*');
  }

  async deleteAll(): Promise<void> {
    await this.subjectRepository.clear();
    await this.redisService.clearCachePattern('subject:*');
    await this.redisService.clearCachePattern('course:*');
  }
}