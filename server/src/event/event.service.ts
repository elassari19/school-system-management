import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../common/entities/event.entity';
import { CreateEventDto, UpdateEventDto, GetEventDto } from './dto/event.dto';
import { CacheService } from '../common/cache/cache.service';

import { sanitizeFindQuery } from '../utils/query-sanitizer';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private cacheService: CacheService,
  ) {}

  async findOne(id: string): Promise<Event> {
    const cacheKey = this.cacheService.generateEntityCacheKey('event', id);
    return this.cacheService.getOrSet(cacheKey, async () => {
      const event = await this.eventRepository.findOne({
        where: { id },
        relations: ['createdBy'],
      });
      if (!event) {
        throw new NotFoundException('Event not found');
      }
      return event;
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['event'] });
  }

  async findAll(query: any = {}): Promise<Event[]> {
    const cacheKey = this.cacheService.generateListCacheKey('event', query);
    return this.cacheService.getOrSet(cacheKey, async () => {
      const options = sanitizeFindQuery<Event>(query);
      return this.eventRepository.find({
        ...options,
        relations: Array.isArray(options.relations) && options.relations.length ? options.relations : ['createdBy'],
        order: options.order ?? { date: 'DESC' },
      });
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['event'] });
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = this.cacheService.generateCacheKey('event', 'count', JSON.stringify(query));
    return this.cacheService.getOrSet(cacheKey, async () => {
      return this.eventRepository.count(query);
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['event'] });
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create({
      ...createEventDto,
      date: new Date(createEventDto.date),
    });
    const savedEvent = await this.eventRepository.save(event);
    await this.cacheService.invalidateByTag('event');
    return savedEvent;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    Object.assign(event, {
      ...updateEventDto,
      date: updateEventDto.date ? new Date(updateEventDto.date) : event.date,
    });
    const updatedEvent = await this.eventRepository.save(event);
    await this.cacheService.invalidateByTag('event');
    return updatedEvent;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.eventRepository.delete(id);
    await this.cacheService.invalidateByTag('event');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.eventRepository.delete(ids);
    await this.cacheService.invalidateByTag('event');
  }

  async deleteAll(): Promise<void> {
    await this.eventRepository.clear();
    await this.cacheService.invalidateByTag('event');
  }
}
