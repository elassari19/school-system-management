import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../common/entities/student.entity';
import { CreateStudentDto, UpdateStudentDto, GetStudentDto } from './dto/student.dto';
import { CacheService } from '../common/cache/cache.service';

import { sanitizeFindQuery } from '../utils/query-sanitizer';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private cacheService: CacheService,
  ) {}

  async findOne(id: string): Promise<Student> {
    const cacheKey = this.cacheService.generateEntityCacheKey('student', id);
    return this.cacheService.getOrSet(cacheKey, async () => {
      const student = await this.studentRepository.findOne({
        where: { id },
        relations: ['user', 'parent', 'parent.user', 'class'],
      });
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      return student;
    }, { ttl: this.cacheService['cacheConfig'].getTtl('user'), tags: ['student'] });
  }

  async findAll(query: any = {}): Promise<Student[]> {
    const cacheKey = this.cacheService.generateListCacheKey('student', query);
    return this.cacheService.getOrSet(cacheKey, async () => {
      const options = sanitizeFindQuery<Student>(query);
      return this.studentRepository.find({
        ...options,
        relations: Array.isArray(options.relations) && options.relations.length ? (options.relations as string[]) : ['user', 'parent', 'parent.user', 'class'],
      });
    }, { ttl: this.cacheService['cacheConfig'].getTtl('user'), tags: ['student'] });
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = this.cacheService.generateCacheKey('student', 'count', JSON.stringify(query));
    return this.cacheService.getOrSet(cacheKey, async () => {
      return this.studentRepository.count(query);
    }, { ttl: this.cacheService['cacheConfig'].getTtl('user'), tags: ['student'] });
  }

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = this.studentRepository.create(createStudentDto);
    const savedStudent = await this.studentRepository.save(student);
    await this.cacheService.invalidateByTag('student');
    return savedStudent;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
    Object.assign(student, updateStudentDto);
    const updatedStudent = await this.studentRepository.save(student);
    await this.cacheService.invalidateByTag('student');
    await this.cacheService.invalidateByTag('user');
    return updatedStudent;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.studentRepository.delete(id);
    await this.cacheService.invalidateByTag('student');
    await this.cacheService.invalidateByTag('user');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.studentRepository.delete(ids);
    await this.cacheService.invalidateByTag('student');
  }

  async deleteAll(): Promise<void> {
    await this.studentRepository.clear();
    await this.cacheService.invalidateByTag('student');
  }
}