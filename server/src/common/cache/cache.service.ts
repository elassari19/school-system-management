import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { CacheConfigService } from './cache.config';

export interface CacheOptions {
  ttl?: number;
  tags?: string[];
  prefix?: string;
  compress?: boolean;
}

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
  tags: string[];
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalKeys: number;
  memoryUsage: { used: string; peak: string; total: string };
  latency: number;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private stats = { hits: 0, misses: 0 };

  constructor(
    private readonly redisService: RedisService,
    private readonly cacheConfig: CacheConfigService,
  ) {}

  private generateKey(key: string, prefix?: string): string {
    const basePrefix = prefix || this.cacheConfig.getKeyPrefix();
    return `${basePrefix}${key}`;
  }

  private generateTaggedKey(tag: string): string {
    return `tag:${tag}`;
  }

  async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    if (!this.cacheConfig.isEnabled()) {
      return null;
    }

    try {
      const fullKey = this.generateKey(key, options?.prefix);
      const data = await this.redisService.getCache<CacheEntry<T>>(fullKey);

      if (data) {
        this.stats.hits++;
        return data.value;
      }

      this.stats.misses++;
      return null;
    } catch (error) {
      this.logger.error(`Cache get error for key ${key}: ${(error as Error).message}`);
      this.stats.misses++;
      return null;
    }
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    if (!this.cacheConfig.isEnabled()) {
      return;
    }

    try {
      const fullKey = this.generateKey(key, options?.prefix);
      const ttl = options?.ttl || this.cacheConfig.getDefaultTtl();
      const tags = options?.tags || [];

      const entry: CacheEntry<T> = {
        value,
        timestamp: Date.now(),
        ttl,
        tags,
      };

      await this.redisService.setCache(fullKey, entry, ttl);

      if (tags.length > 0) {
        await this.associateTags(fullKey, tags, ttl);
      }
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}: ${(error as Error).message}`);
      throw error;
    }
  }

  async setNX<T>(key: string, value: T, options?: CacheOptions): Promise<boolean> {
    if (!this.cacheConfig.isEnabled()) {
      return false;
    }

    try {
      const fullKey = this.generateKey(key, options?.prefix);
      const ttl = options?.ttl || this.cacheConfig.getDefaultTtl();
      const tags = options?.tags || [];

      const entry: CacheEntry<T> = {
        value,
        timestamp: Date.now(),
        ttl,
        tags,
      };

      const result = await this.redisService.setCacheNX(fullKey, entry, ttl);

      if (result && tags.length > 0) {
        await this.associateTags(fullKey, tags, ttl);
      }

      return result;
    } catch (error) {
      this.logger.error(`Cache setNX error for key ${key}: ${(error as Error).message}`);
      return false;
    }
  }

  async delete(key: string, options?: CacheOptions): Promise<void> {
    if (!this.cacheConfig.isEnabled()) {
      return;
    }

    try {
      const fullKey = this.generateKey(key, options?.prefix);
      await this.redisService.clearCache(fullKey);

      const entry = await this.redisService.getCache<CacheEntry<any>>(fullKey);
      if (entry?.tags) {
        await this.removeTagAssociations(fullKey, entry.tags);
      }
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}: ${(error as Error).message}`);
      throw error;
    }
  }

  async invalidateByTag(tag: string): Promise<number> {
    if (!this.cacheConfig.isEnabled()) {
      return 0;
    }

    try {
      const taggedKey = this.generateTaggedKey(tag);
      const keys = await this.redisService.getCache<string[]>(taggedKey);

      if (keys && keys.length > 0) {
        const deleted = await this.redisService.deleteMultiple(keys);
        await this.redisService.clearCache(taggedKey);
        return deleted;
      }

      return 0;
    } catch (error) {
      this.logger.error(`Cache invalidate by tag error for tag ${tag}: ${(error as Error).message}`);
      return 0;
    }
  }

  async invalidateByPattern(pattern: string, options?: CacheOptions): Promise<number> {
    if (!this.cacheConfig.isEnabled()) {
      return 0;
    }

    try {
      const fullPattern = this.generateKey(pattern, options?.prefix);
      return await this.redisService.clearCachePattern(fullPattern);
    } catch (error) {
      this.logger.error(`Cache invalidate by pattern error for pattern ${pattern}: ${(error as Error).message}`);
      return 0;
    }
  }

  async getMultiple<T>(keys: string[], options?: CacheOptions): Promise<Map<string, T | null>> {
    if (!this.cacheConfig.isEnabled()) {
      return new Map(keys.map((k) => [k, null]));
    }

    try {
      const fullKeys = keys.map((key) => this.generateKey(key, options?.prefix));
      const values = await this.redisService.getMultiple<CacheEntry<T>>(fullKeys);

      const result = new Map<string, T | null>();
      keys.forEach((key, index) => {
        const entry = values[index];
        if (entry) {
          this.stats.hits++;
          result.set(key, entry.value);
        } else {
          this.stats.misses++;
          result.set(key, null);
        }
      });

      return result;
    } catch (error) {
      this.logger.error(`Cache getMultiple error: ${(error as Error).message}`);
      this.stats.misses += keys.length;
      return new Map(keys.map((k) => [k, null]));
    }
  }

  async setMultiple<T>(entries: Array<{ key: string; value: T } & CacheOptions>): Promise<void> {
    if (!this.cacheConfig.isEnabled()) {
      return;
    }

    try {
      const redisEntries = entries.map((entry) => {
        const fullKey = this.generateKey(entry.key, entry.prefix);
        const ttl = entry.ttl || this.cacheConfig.getDefaultTtl();
        const tags = entry.tags || [];

        const cacheEntry: CacheEntry<T> = {
          value: entry.value,
          timestamp: Date.now(),
          ttl,
          tags,
        };

        return { key: fullKey, value: cacheEntry, ttl };
      });

      await this.redisService.setMultiple(redisEntries);

      for (const entry of entries) {
        if (entry.tags && entry.tags.length > 0) {
          const fullKey = this.generateKey(entry.key, entry.prefix);
          await this.associateTags(fullKey, entry.tags, entry.ttl || this.cacheConfig.getDefaultTtl());
        }
      }
    } catch (error) {
      this.logger.error(`Cache setMultiple error: ${(error as Error).message}`);
      throw error;
    }
  }

  async deleteMultiple(keys: string[], options?: CacheOptions): Promise<number> {
    if (!this.cacheConfig.isEnabled()) {
      return 0;
    }

    try {
      const fullKeys = keys.map((key) => this.generateKey(key, options?.prefix));
      return await this.redisService.deleteMultiple(fullKeys);
    } catch (error) {
      this.logger.error(`Cache deleteMultiple error: ${(error as Error).message}`);
      return 0;
    }
  }

  async exists(key: string, options?: CacheOptions): Promise<boolean> {
    if (!this.cacheConfig.isEnabled()) {
      return false;
    }

    try {
      const fullKey = this.generateKey(key, options?.prefix);
      return await this.redisService.exists(fullKey);
    } catch (error) {
      this.logger.error(`Cache exists error for key ${key}: ${(error as Error).message}`);
      return false;
    }
  }

  async getTtl(key: string, options?: CacheOptions): Promise<number> {
    if (!this.cacheConfig.isEnabled()) {
      return -2;
    }

    try {
      const fullKey = this.generateKey(key, options?.prefix);
      return await this.redisService.getTtl(fullKey);
    } catch (error) {
      this.logger.error(`Cache getTtl error for key ${key}: ${(error as Error).message}`);
      return -2;
    }
  }

  async extendTtl(key: string, ttl: number, options?: CacheOptions): Promise<boolean> {
    if (!this.cacheConfig.isEnabled()) {
      return false;
    }

    try {
      const fullKey = this.generateKey(key, options?.prefix);
      return await this.redisService.expire(fullKey, ttl);
    } catch (error) {
      this.logger.error(`Cache extendTtl error for key ${key}: ${(error as Error).message}`);
      return false;
    }
  }

  async increment(key: string, amount: number = 1, options?: CacheOptions): Promise<number> {
    if (!this.cacheConfig.isEnabled()) {
      return 0;
    }

    try {
      const fullKey = this.generateKey(key, options?.prefix);
      return await this.redisService.increment(fullKey, amount);
    } catch (error) {
      this.logger.error(`Cache increment error for key ${key}: ${(error as Error).message}`);
      throw error;
    }
  }

  async decrement(key: string, amount: number = 1, options?: CacheOptions): Promise<number> {
    if (!this.cacheConfig.isEnabled()) {
      return 0;
    }

    try {
      const fullKey = this.generateKey(key, options?.prefix);
      return await this.redisService.decrement(fullKey, amount);
    } catch (error) {
      this.logger.error(`Cache decrement error for key ${key}: ${(error as Error).message}`);
      throw error;
    }
  }

  async getOrSet<T>(key: string, factory: () => Promise<T>, options?: CacheOptions): Promise<T> {
    const cached = await this.get<T>(key, options);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, options);
    return value;
  }

  async getOrSetMultiple<T>(
    keys: string[],
    factory: (missingKeys: string[]) => Promise<Map<string, T>>,
    options?: CacheOptions,
  ): Promise<Map<string, T>> {
    const cached = await this.getMultiple<T>(keys, options);
    const missingKeys = Array.from(cached.entries())
      .filter(([, value]) => value === null)
      .map(([key]) => key);

    if (missingKeys.length === 0) {
      return new Map(Array.from(cached.entries()).map(([k, v]) => [k, v as T]));
    }

    const freshValues = await factory(missingKeys);

    const setEntries = Array.from(freshValues.entries()).map(([key, value]) => ({
      key,
      value,
      ...options,
    }));

    await this.setMultiple(setEntries);

    freshValues.forEach((value, key) => {
      cached.set(key, value);
    });

    return new Map(Array.from(cached.entries()).map(([k, v]) => [k, v as T]));
  }

  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? this.stats.hits / total : 0,
      totalKeys: 0,
      memoryUsage: { used: 'unknown', peak: 'unknown', total: 'unknown' },
      latency: 0,
    };
  }

  async getDetailedStats(): Promise<CacheStats> {
    const redisStats = await this.redisService.getStats();
    const baseStats = this.getStats();

    return {
      ...baseStats,
      totalKeys: redisStats.keysCount,
      memoryUsage: redisStats.memoryUsage,
      latency: redisStats.latency,
    };
  }

  resetStats(): void {
    this.stats = { hits: 0, misses: 0 };
  }

  async healthCheck(): Promise<{ status: string; latency: number; connected: boolean }> {
    return await this.redisService.healthCheck();
  }

  private async associateTags(key: string, tags: string[], ttl: number): Promise<void> {
    const pipeline = this.redisService.getClient().pipeline();

    for (const tag of tags) {
      const taggedKey = this.generateTaggedKey(tag);
      pipeline.sadd(taggedKey, key);
      pipeline.expire(taggedKey, ttl);
    }

    await pipeline.exec();
  }

  private async removeTagAssociations(key: string, tags: string[]): Promise<void> {
    const pipeline = this.redisService.getClient().pipeline();

    for (const tag of tags) {
      const taggedKey = this.generateTaggedKey(tag);
      pipeline.srem(taggedKey, key);
    }

    await pipeline.exec();
  }

  generateCacheKey(...parts: (string | number)[]): string {
    return parts.join(':');
  }

  generateEntityCacheKey(entity: string, id: string | number, ...extra: (string | number)[]): string {
    return this.generateCacheKey(entity, String(id), ...extra);
  }

  generateListCacheKey(entity: string, params: Record<string, any> = {}): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join('&');
    return this.generateCacheKey(entity, 'list', sortedParams || 'all');
  }

  generateSearchCacheKey(entity: string, query: string, filters: Record<string, any> = {}): string {
    const filterStr = Object.keys(filters)
      .sort()
      .map((key) => `${key}=${filters[key]}`)
      .join('&');
    return this.generateCacheKey(entity, 'search', query, filterStr || 'none');
  }
}