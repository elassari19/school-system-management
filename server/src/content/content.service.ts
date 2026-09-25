import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from '../common/entities/content.entity';
import { CreateContentDto, UpdateContentDto, GetContentDto } from './dto/content.dto';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    private redisService: RedisService,
  ) {}

  async findOne(id: string): Promise<Content> {
    const cacheKey = `content:${id}`;
    const cached = await this.redisService.getCache<Content>(cacheKey);
    if (cached) return cached;

    const content = await this.contentRepository.findOne({
      where: { id },
      relations: ['chapter'],
    });
    if (!content) {
      throw new NotFoundException('Content not found');
    }
    await this.redisService.setCache(cacheKey, content, 60);
    return content;
  }

  async findAll(query: any = {}): Promise<Content[]> {
    const cacheKey = `content:all:${JSON.stringify(query)}`;
    const cached = await this.redisService.getCache<Content[]>(cacheKey);
    if (cached) return cached;

    const contents = await this.contentRepository.find({
      ...query,
      relations: ['chapter'],
    });
    await this.redisService.setCache(cacheKey, contents, 60);
    return contents;
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = `content:count:${JSON.stringify(query)}`;
    const cached = await this.redisService.getCache<number>(cacheKey);
    if (cached !== null) return cached;

    const count = await this.contentRepository.count(query);
    await this.redisService.setCache(cacheKey, count, 60);
    return count;
  }

  async create(createContentDto: CreateContentDto): Promise<Content> {
    const content = this.contentRepository.create(createContentDto);
    const savedContent = await this.contentRepository.save(content);
    await this.redisService.clearCachePattern('content:*');
    return savedContent;
  }

  async update(id: string, updateContentDto: UpdateContentDto): Promise<Content> {
    const content = await this.findOne(id);
    Object.assign(content, updateContentDto);
    const updatedContent = await this.contentRepository.save(content);
    await this.redisService.clearCachePattern('content:*');
    return updatedContent;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.contentRepository.delete(id);
    await this.redisService.clearCachePattern('content:*');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.contentRepository.delete(ids);
    await this.redisService.clearCachePattern('content:*');
  }

  async deleteAll(): Promise<void> {
    await this.contentRepository.clear();
    await this.redisService.clearCachePattern('content:*');
  }
}