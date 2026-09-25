import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../common/entities/group.entity';
import { CreateGroupDto, UpdateGroupDto, GetGroupDto } from './dto/group.dto';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    private redisService: RedisService,
  ) {}

  async findOne(id: string): Promise<Group> {
    const cacheKey = `group:${id}`;
    const cached = await this.redisService.getCache<Group>(cacheKey);
    if (cached) return cached;

    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['user', 'memberships', 'admins'],
    });
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    await this.redisService.setCache(cacheKey, group, 60);
    return group;
  }

  async findAll(query: any = {}): Promise<Group[]> {
    const cacheKey = `group:all:${JSON.stringify(query)}`;
    const cached = await this.redisService.getCache<Group[]>(cacheKey);
    if (cached) return cached;

    const groups = await this.groupRepository.find({
      ...query,
      relations: ['user', 'memberships', 'admins'],
    });
    await this.redisService.setCache(cacheKey, groups, 60);
    return groups;
  }

  async count(query: any = {}): Promise<number> {
    const cacheKey = `group:count:${JSON.stringify(query)}`;
    const cached = await this.redisService.getCache<number>(cacheKey);
    if (cached !== null) return cached;

    const count = await this.groupRepository.count(query);
    await this.redisService.setCache(cacheKey, count, 60);
    return count;
  }

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = this.groupRepository.create(createGroupDto);
    const savedGroup = await this.groupRepository.save(group);
    await this.redisService.clearCachePattern('group:*');
    return savedGroup;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const group = await this.findOne(id);
    Object.assign(group, updateGroupDto);
    const updatedGroup = await this.groupRepository.save(group);
    await this.redisService.clearCachePattern('group:*');
    return updatedGroup;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.groupRepository.delete(id);
    await this.redisService.clearCachePattern('group:*');
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.groupRepository.delete(ids);
    await this.redisService.clearCachePattern('group:*');
  }

  async deleteAll(): Promise<void> {
    await this.groupRepository.clear();
    await this.redisService.clearCachePattern('group:*');
  }
}