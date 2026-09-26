import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../common/entities/class.entity';
import { CreateClassDto, UpdateClassDto, GetClassDto } from './dto/class.dto';
import { CacheService } from '../common/cache/cache.service';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    private cacheService: CacheService,
  ) {}

  async findOne(id: string): Promise<Class> {
    const cacheKey = this.cacheService.generateEntityCacheKey('class', id);
    return this.cacheService.getOrSet(cacheKey, async () => {
      const cls = await this.classRepository.findOne({
        where: { id },
        relations: ['students', 'teachers', 'teachers.teacher', 'subject', 'user'],
      });
      if (!cls) {
        throw new NotFoundException('Class not found');
      }
      return cls;
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['class'] });
  }

  async findAll(query: any = {}): Promise<Class[]> {
    const cacheKey = this.cacheService.generateListCacheKey('class', query);
    return this.cacheService.getOrSet(cacheKey, async () => {
      return this.classRepository.find({
        ...query,
        relations: ['students', 'teachers', 'teachers.teacher', 'subject', 'user'],
        order: { createdAt: 'ASC' },
      });
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['class'] });
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = this.cacheService.generateCacheKey('class', 'count', JSON.stringify(query));
    return this.cacheService.getOrSet(cacheKey, async () => {
      return this.classRepository.count(query);
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['class'] });
  }

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const cls = this.classRepository.create(createClassDto);
    const savedClass = await this.classRepository.save(cls);
    await this.cacheService.invalidateByTag('class');
    return savedClass;
  }

  async update(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    const cls = await this.findOne(id);
    Object.assign(cls, updateClassDto);
    const updatedClass = await this.classRepository.save(cls);
    await this.cacheService.invalidateByTag('class');
    return updatedClass;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.classRepository.delete(id);
    await this.cacheService.invalidateByTag('class');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.classRepository.delete(ids);
    await this.cacheService.invalidateByTag('class');
  }

  async deleteAll(): Promise<void> {
    await this.classRepository.clear();
    await this.cacheService.invalidateByTag('class');
  }
}