import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Redis, RedisOptions, Cluster, ClusterNode } from 'ioredis';
import { CacheConfigService } from '../cache/cache.config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | Cluster;
  private isConnected = false;
  private connectionAttempts = 0;
  private readonly maxConnectionAttempts = 5;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor(private readonly cacheConfig: CacheConfigService) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const options = this.cacheConfig.getRedisOptions() as RedisOptions;

    if (process.env.REDIS_CLUSTER_NODES) {
      const nodes = process.env.REDIS_CLUSTER_NODES.split(',').map((node) => {
        const [host, port] = node.split(':');
        return { host, port: parseInt(port, 10) };
      }) as ClusterNode[];
      this.client = new Cluster(nodes, options);
    } else {
      this.client = new Redis(redisUrl, options);
    }

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      this.logger.log('Redis client connected');
      this.isConnected = true;
      this.connectionAttempts = 0;
    });

    this.client.on('ready', () => {
      this.logger.log('Redis client ready');
      this.isConnected = true;
      this.startHealthCheck();
    });

    this.client.on('error', (error: Error) => {
      this.logger.error(`Redis client error: ${error.message}`);
      this.isConnected = false;
    });

    this.client.on('close', () => {
      this.logger.warn('Redis connection closed');
      this.isConnected = false;
      this.stopHealthCheck();
    });

    this.client.on('close', () => {
      this.logger.warn('Redis connection closed');
      this.isConnected = false;
      this.stopHealthCheck();
    });

    this.client.on('reconnecting', () => {
      this.connectionAttempts++;
      this.logger.log(`Redis reconnecting... (attempt ${this.connectionAttempts})`);
    });

    this.client.on('end', () => {
      this.logger.warn('Redis connection ended');
      this.isConnected = false;
      this.stopHealthCheck();
    });
  }

  private startHealthCheck(): void {
    if (this.healthCheckInterval) {
      return;
    }

    this.healthCheckInterval = setInterval(async () => {
      try {
        const result = await this.client.ping();
        if (result !== 'PONG') {
          this.logger.warn('Redis health check failed: unexpected ping response');
          this.isConnected = false;
        }
      } catch (error) {
        this.logger.error(`Redis health check failed: ${(error as Error).message}`);
        this.isConnected = false;
      }
    }, 30000);
  }

  private stopHealthCheck(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    this.stopHealthCheck();
    await this.quit();
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      await this.client.connect();
      this.isConnected = true;
    } catch (error) {
      this.logger.error(`Failed to connect to Redis: ${(error as Error).message}`);
      throw error;
    }
  }

  async quit(): Promise<void> {
    this.stopHealthCheck();
    await this.client.quit();
    this.isConnected = false;
  }

  isReady(): boolean {
    return this.isConnected && this.client.status === 'ready';
  }

  getStatus(): string {
    return this.client.status;
  }

  getClient(): Redis | Cluster {
    return this.client;
  }

  async getCache<T>(key: string): Promise<T | null> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const data = await this.client.get(prefixedKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.logger.error(`Cache get error for key ${key}: ${(error as Error).message}`);
      return null;
    }
  }

  async setCache<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const ttlSeconds = ttl || this.cacheConfig.getDefaultTtl();
      await this.client.setex(prefixedKey, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}: ${(error as Error).message}`);
      throw error;
    }
  }

  async setCacheNX<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const ttlSeconds = ttl || this.cacheConfig.getDefaultTtl();
      const result = await this.client.set(prefixedKey, JSON.stringify(value), 'EX', ttlSeconds, 'NX');
      return result === 'OK';
    } catch (error) {
      this.logger.error(`Cache setNX error for key ${key}: ${(error as Error).message}`);
      return false;
    }
  }

  async clearCache(key: string): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      await this.client.del(prefixedKey);
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}: ${(error as Error).message}`);
      throw error;
    }
  }

  async clearCachePattern(pattern: string): Promise<number> {
    try {
      const prefixedPattern = this.getPrefixedKey(pattern);
      const keys = await this.client.keys(prefixedPattern);
      if (keys.length > 0) {
        return await this.client.del(...keys);
      }
      return 0;
    } catch (error) {
      this.logger.error(`Cache pattern delete error for pattern ${pattern}: ${(error as Error).message}`);
      return 0;
    }
  }

  async getKeys(pattern: string): Promise<string[]> {
    try {
      const prefixedPattern = this.getPrefixedKey(pattern);
      return await this.client.keys(prefixedPattern);
    } catch (error) {
      this.logger.error(`Cache keys error for pattern ${pattern}: ${(error as Error).message}`);
      return [];
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const result = await this.client.exists(prefixedKey);
      return result === 1;
    } catch (error) {
      this.logger.error(`Cache exists error for key ${key}: ${(error as Error).message}`);
      return false;
    }
  }

  async getTtl(key: string): Promise<number> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      return await this.client.ttl(prefixedKey);
    } catch (error) {
      this.logger.error(`Cache TTL error for key ${key}: ${(error as Error).message}`);
      return -2;
    }
  }

  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const result = await this.client.expire(prefixedKey, ttl);
      return result === 1;
    } catch (error) {
      this.logger.error(`Cache expire error for key ${key}: ${(error as Error).message}`);
      return false;
    }
  }

  async increment(key: string, amount: number = 1): Promise<number> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      return await this.client.incrby(prefixedKey, amount);
    } catch (error) {
      this.logger.error(`Cache increment error for key ${key}: ${(error as Error).message}`);
      throw error;
    }
  }

  async decrement(key: string, amount: number = 1): Promise<number> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      return await this.client.decrby(prefixedKey, amount);
    } catch (error) {
      this.logger.error(`Cache decrement error for key ${key}: ${(error as Error).message}`);
      throw error;
    }
  }

  async getMultiple<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const prefixedKeys = keys.map((key) => this.getPrefixedKey(key));
      const values = await this.client.mget(...prefixedKeys);
      return values.map((value) => (value ? JSON.parse(value) : null));
    } catch (error) {
      this.logger.error(`Cache mget error: ${(error as Error).message}`);
      return keys.map(() => null);
    }
  }

  async setMultiple<T>(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<void> {
    try {
      const pipeline = this.client.pipeline();
      for (const entry of entries) {
        const prefixedKey = this.getPrefixedKey(entry.key);
        const ttlSeconds = entry.ttl || this.cacheConfig.getDefaultTtl();
        pipeline.setex(prefixedKey, ttlSeconds, JSON.stringify(entry.value));
      }
      await pipeline.exec();
    } catch (error) {
      this.logger.error(`Cache mset error: ${(error as Error).message}`);
      throw error;
    }
  }

  async deleteMultiple(keys: string[]): Promise<number> {
    try {
      const prefixedKeys = keys.map((key) => this.getPrefixedKey(key));
      if (prefixedKeys.length > 0) {
        return await this.client.del(...prefixedKeys);
      }
      return 0;
    } catch (error) {
      this.logger.error(`Cache mdel error: ${(error as Error).message}`);
      return 0;
    }
  }

  async healthCheck(): Promise<{ status: string; latency: number; connected: boolean }> {
    const start = Date.now();
    try {
      const result = await this.client.ping();
      const latency = Date.now() - start;
      return {
        status: result === 'PONG' ? 'healthy' : 'unhealthy',
        latency,
        connected: this.isConnected,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        latency: Date.now() - start,
        connected: false,
      };
    }
  }

  async getInfo(): Promise<Record<string, string>> {
    try {
      const info = await this.client.info();
      const result: Record<string, string> = {};
      info.split('\r\n').forEach((line) => {
        if (line && !line.startsWith('#')) {
          const [key, value] = line.split(':');
          if (key && value) {
            result[key] = value;
          }
        }
      });
      return result;
    } catch (error) {
      this.logger.error(`Redis info error: ${(error as Error).message}`);
      return {};
    }
  }

  async getMemoryUsage(): Promise<{ used: string; peak: string; total: string }> {
    try {
      const info = await this.getInfo();
      return {
        used: info.used_memory_human || 'unknown',
        peak: info.used_memory_peak_human || 'unknown',
        total: info.total_system_memory_human || 'unknown',
      };
    } catch (error) {
      this.logger.error(`Redis memory usage error: ${(error as Error).message}`);
      return { used: 'unknown', peak: 'unknown', total: 'unknown' };
    }
  }

  async getStats(): Promise<{
    connected: boolean;
    status: string;
    keysCount: number;
    memoryUsage: { used: string; peak: string; total: string };
    latency: number;
  }> {
    const health = await this.healthCheck();
    const memory = await this.getMemoryUsage();
    let keysCount = 0;

    try {
      const keys = await this.client.keys(this.getPrefixedKey('*'));
      keysCount = keys.length;
    } catch {
      keysCount = -1;
    }

    return {
      connected: health.connected,
      status: health.status,
      keysCount,
      memoryUsage: memory,
      latency: health.latency,
    };
  }

  private getPrefixedKey(key: string): string {
    return `${this.cacheConfig.getKeyPrefix()}${key}`;
  }

  async flushAll(): Promise<void> {
    try {
      await this.client.flushall();
      this.logger.warn('All Redis keys flushed');
    } catch (error) {
      this.logger.error(`Redis flushall error: ${(error as Error).message}`);
      throw error;
    }
  }

  async scanKeys(pattern: string, count: number = 100): Promise<string[]> {
    const keys: string[] = [];
    let cursor = '0';
    const prefixedPattern = this.getPrefixedKey(pattern);

    do {
      const [newCursor, foundKeys] = await this.client.scan(cursor, 'MATCH', prefixedPattern, 'COUNT', count);
      cursor = newCursor;
      keys.push(...foundKeys);
    } while (cursor !== '0');

    return keys;
  }
}