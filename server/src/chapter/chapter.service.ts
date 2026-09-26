import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from '../common/entities/chapter.entity';
import { CreateChapterDto, UpdateChapterDto, GetChapterDto } from './dto/chapter.dto';
import { CacheService } from '../common/cache/cache.service';

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
    private cacheService: CacheService,
  ) {}

  async findOne(id: string): Promise<Chapter> {
    const cacheKey = this.cacheService.generateEntityCacheKey('chapter', id);
    return this.cacheService.getOrSet(cacheKey, async () => {
      const chapter = await this.chapterRepository.findOne({
        where: { id },
        relations: ['course', 'content'],
      });
      if (!chapter) {
        throw new NotFoundException('Chapter not found');
      }
      return chapter;
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['chapter'] });
  }

  async findAll(query: any = {}): Promise<Chapter[]> {
    const cacheKey = this.cacheService.generateListCacheKey('chapter', query);
    return this.cacheService.getOrSet(cacheKey, async () => {
      return this.chapterRepository.find({
        ...query,
        relations: ['course', 'content'],
      });
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['chapter'] });
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = this.cacheService.generateCacheKey('chapter', 'count', JSON.stringify(query));
    return this.cacheService.getOrSet(cacheKey, async () => {
      return this.chapterRepository.count(query);
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['chapter'] });
  }

  async create(createChapterDto: CreateChapterDto): Promise<Chapter> {
    const chapter = this.chapterRepository.create(createChapterDto);
    const savedChapter = await this.chapterRepository.save(chapter);
    await this.cacheService.invalidateByTag('chapter');
    return savedChapter;
  }

  async update(id: string, updateChapterDto: UpdateChapterDto): Promise<Chapter> {
    const chapter = await this.findOne(id);
    Object.assign(chapter, updateChapterDto);
    const updatedChapter = await this.chapterRepository.save(chapter);
    await this.cacheService.invalidateByTag('chapter');
    return updatedChapter;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.chapterRepository.delete(id);
    await this.cacheService.invalidateByTag('chapter');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.chapterRepository.delete(ids);
    await this.cacheService.invalidateByTag('chapter');
  }

  async deleteAll(): Promise<void> {
    await this.chapterRepository.clear();
    await this.cacheService.invalidateByTag('chapter');
  }
}