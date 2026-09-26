import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../common/entities/subject.entity';
import { CreateSubjectDto, UpdateSubjectDto, GetSubjectDto } from './dto/subject.dto';
import { CacheService } from '../common/cache/cache.service';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    private cacheService: CacheService,
  ) {}

  async findOne(id: string): Promise<Subject> {
    const cacheKey = this.cacheService.generateEntityCacheKey('subject', id);
    return this.cacheService.getOrSet(cacheKey, async () => {
      const subject = await this.subjectRepository.findOne({
        where: { id },
        relations: ['courses', 'teacher', 'classes', 'createdBy'],
      });
      if (!subject) {
        throw new NotFoundException('Subject not found');
      }
      return subject;
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['subject'] });
  }

  async findAll(query: any = {}): Promise<Subject[]> {
    const cacheKey = this.cacheService.generateListCacheKey('subject', query);
    return this.cacheService.getOrSet(cacheKey, async () => {
      return this.subjectRepository.find({
        ...query,
        relations: ['courses', 'teacher', 'classes', 'createdBy'],
      });
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['subject'] });
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = this.cacheService.generateCacheKey('subject', 'count', JSON.stringify(query));
    return this.cacheService.getOrSet(cacheKey, async () => {
      return this.subjectRepository.count(query);
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['subject'] });
  }

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = this.subjectRepository.create(createSubjectDto);
    const savedSubject = await this.subjectRepository.save(subject);
    await this.cacheService.invalidateByTag('subject');
    await this.cacheService.invalidateByTag('course');
    return savedSubject;
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.findOne(id);
    Object.assign(subject, updateSubjectDto);
    const updatedSubject = await this.subjectRepository.save(subject);
    await this.cacheService.invalidateByTag('subject');
    await this.cacheService.invalidateByTag('course');
    return updatedSubject;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.subjectRepository.delete(id);
    await this.cacheService.invalidateByTag('subject');
    await this.cacheService.invalidateByTag('course');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.subjectRepository.delete(ids);
    await this.cacheService.invalidateByTag('subject');
    await this.cacheService.invalidateByTag('course');
  }

  async deleteAll(): Promise<void> {
    await this.subjectRepository.clear();
    await this.cacheService.invalidateByTag('subject');
    await this.cacheService.invalidateByTag('course');
  }
}