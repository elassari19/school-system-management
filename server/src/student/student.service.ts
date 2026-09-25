import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../common/entities/student.entity';
import { CreateStudentDto, UpdateStudentDto, GetStudentDto } from './dto/student.dto';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private redisService: RedisService,
  ) {}

  async findOne(id: string): Promise<Student> {
    const cacheKey = `student:${id}`;
    const cached = await this.redisService.getCache<Student>(cacheKey);
    if (cached) return cached;

    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['user', 'parent', 'parent.user', 'class'],
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    await this.redisService.setCache(cacheKey, student, 60);
    return student;
  }

  async findAll(query: any = {}): Promise<Student[]> {
    const cacheKey = `student:all:${JSON.stringify(query)}`;
    const cached = await this.redisService.getCache<Student[]>(cacheKey);
    if (cached) return cached;

    const students = await this.studentRepository.find({
      ...query,
      relations: ['user', 'parent', 'parent.user', 'class'],
    });
    await this.redisService.setCache(cacheKey, students, 60);
    return students;
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = `student:count:${JSON.stringify(query)}`;
    const cached = await this.redisService.getCache<number>(cacheKey);
    if (cached !== null) return cached;

    const count = await this.studentRepository.count(query);
    await this.redisService.setCache(cacheKey, count, 60);
    return count;
  }

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = this.studentRepository.create(createStudentDto);
    const savedStudent = await this.studentRepository.save(student);
    await this.redisService.clearCachePattern('student:*');
    return savedStudent;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
    Object.assign(student, updateStudentDto);
    const updatedStudent = await this.studentRepository.save(student);
    await this.redisService.clearCachePattern('student:*');
    return updatedStudent;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.studentRepository.delete(id);
    await this.redisService.clearCachePattern('student:*');
    await this.redisService.clearCachePattern('user:*');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.studentRepository.delete(ids);
    await this.redisService.clearCachePattern('student:*');
  }

  async deleteAll(): Promise<void> {
    await this.studentRepository.clear();
    await this.redisService.clearCachePattern('student:*');
  }
}