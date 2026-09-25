import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from '../common/entities/chapter.entity';
import { CreateChapterDto, UpdateChapterDto, GetChapterDto } from './dto/chapter.dto';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
    private redisService: RedisService,
  ) {}

  async findOne(id: string): Promise<Chapter> {
    const cacheKey = `chapter:${id}`;
    const cached = await this.redisService.getCache<Chapter>(cacheKey);
    if (cached) return cached;

    const chapter = await this.chapterRepository.findOne({
      where: { id },
      relations: ['course', 'content'],
    });
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }
    await this.redisService.setCache(cacheKey, chapter, 60);
    return chapter;
  }

  async findAll(query: any = {}): Promise<Chapter[]> {
    const cacheKey = `chapter:all:${JSON.stringify(query)}`;
    const cached = await this.redisService.getCache<Chapter[]>(cacheKey);
    if (cached) return cached;

    const chapters = await this.chapterRepository.find({
      ...query,
      relations: ['course', 'content'],
    });
    await this.redisService.setCache(cacheKey, chapters, 60);
    return chapters;
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = `chapter:count:${JSON.stringify(query)}`;
    const cached = await this.redisService.getCache<number>(cacheKey);
    if (cached !== null) return cached;

    const count = await this.chapterRepository.count(query);
    await this.redisService.setCache(cacheKey, count, 60);
    return count;
  }

  async create(createChapterDto: CreateChapterDto): Promise<Chapter> {
    const chapter = this.chapterRepository.create(createChapterDto);
    const savedChapter = await this.chapterRepository.save(chapter);
    await this.redisService.clearCachePattern('chapter:*');
    return savedChapter;
  }

  async update(id: string, updateChapterDto: UpdateChapterDto): Promise<Chapter> {
    const chapter = await this.findOne(id);
    Object.assign(chapter, updateChapterDto);
    const updatedChapter = await this.chapterRepository.save(chapter);
    await this.redisService.clearCachePattern('chapter:*');
    return updatedChapter;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.chapterRepository.delete(id);
    await this.redisService.clearCachePattern('chapter:*');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.chapterRepository.delete(ids);
    await this.redisService.clearCachePattern('chapter:*');
  }

  async deleteAll(): Promise<void> {
    await this.chapterRepository.clear();
    await this.redisService.clearCachePattern('chapter:*');
  }
}