import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from '../common/entities/content.entity';
import { CreateContentDto, UpdateContentDto, GetContentDto } from './dto/content.dto';
import { CacheService } from '../common/cache/cache.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    private cacheService: CacheService,
  ) {}

  async findOne(id: string): Promise<Content> {
    const cacheKey = this.cacheService.generateEntityCacheKey('content', id);
    return this.cacheService.getOrSet(cacheKey, async () => {
      const content = await this.contentRepository.findOne({
        where: { id },
        relations: ['chapter'],
      });
      if (!content) {
        throw new NotFoundException('Content not found');
      }
      return content;
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['content'] });
  }

  async findAll(query: any = {}): Promise<Content[]> {
    const cacheKey = this.cacheService.generateListCacheKey('content', query);
    return this.cacheService.getOrSet(cacheKey, async () => {
      return this.contentRepository.find({
        ...query,
        relations: ['chapter'],
      });
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['content'] });
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = this.cacheService.generateCacheKey('content', 'count', JSON.stringify(query));
    return this.cacheService.getOrSet(cacheKey, async () => {
      return this.contentRepository.count(query);
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['content'] });
  }

  async create(createContentDto: CreateContentDto): Promise<Content> {
    const content = this.contentRepository.create(createContentDto);
    const savedContent = await this.contentRepository.save(content);
    await this.cacheService.invalidateByTag('content');
    return savedContent;
  }

  async update(id: string, updateContentDto: UpdateContentDto): Promise<Content> {
    const content = await this.findOne(id);
    Object.assign(content, updateContentDto);
    const updatedContent = await this.contentRepository.save(content);
    await this.cacheService.invalidateByTag('content');
    return updatedContent;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.contentRepository.delete(id);
    await this.cacheService.invalidateByTag('content');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.contentRepository.delete(ids);
    await this.cacheService.invalidateByTag('content');
  }

  async deleteAll(): Promise<void> {
    await this.contentRepository.clear();
    await this.cacheService.invalidateByTag('content');
  }
}