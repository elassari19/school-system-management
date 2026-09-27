import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../common/entities/group.entity';
import { CreateGroupDto, UpdateGroupDto, GetGroupDto } from './dto/group.dto';
import { CacheService } from '../common/cache/cache.service';

import { sanitizeFindQuery } from '../utils/query-sanitizer';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    private cacheService: CacheService,
  ) {}

  async findOne(id: string): Promise<Group> {
    const cacheKey = this.cacheService.generateEntityCacheKey('group', id);
    return this.cacheService.getOrSet(cacheKey, async () => {
      const group = await this.groupRepository.findOne({
        where: { id },
        relations: ['user', 'memberships', 'admins'],
      });
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      return group;
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['group'] });
  }

  async findAll(query: any = {}): Promise<Group[]> {
    const cacheKey = this.cacheService.generateListCacheKey('group', query);
    return this.cacheService.getOrSet(cacheKey, async () => {
      const options = sanitizeFindQuery<Group>(query);
      return this.groupRepository.find({
        ...options,
        relations: Array.isArray(options.relations) && options.relations.length ? (options.relations as string[]) : ['user', 'memberships', 'admins'],
      });
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['group'] });
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = this.cacheService.generateCacheKey('group', 'count', JSON.stringify(query));
    return this.cacheService.getOrSet(cacheKey, async () => {
      return this.groupRepository.count(query);
    }, { ttl: this.cacheService['cacheConfig'].getTtl('default'), tags: ['group'] });
  }

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = this.groupRepository.create(createGroupDto);
    const savedGroup = await this.groupRepository.save(group);
    await this.cacheService.invalidateByTag('group');
    return savedGroup;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const group = await this.findOne(id);
    Object.assign(group, updateGroupDto);
    const updatedGroup = await this.groupRepository.save(group);
    await this.cacheService.invalidateByTag('group');
    return updatedGroup;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.groupRepository.delete(id);
    await this.cacheService.invalidateByTag('group');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.groupRepository.delete(ids);
    await this.cacheService.invalidateByTag('group');
  }

  async deleteAll(): Promise<void> {
    await this.groupRepository.clear();
    await this.cacheService.invalidateByTag('group');
  }
}