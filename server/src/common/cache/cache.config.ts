import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface CacheConfig {
  enabled: boolean;
  keyPrefix: string;
  defaultTtl: number;
  statsTtl: number;
  strategiesTtl: number;
  userTtl: number;
  paymentsTtl: number;
  sessionsTtl: number;
  maxRetries: number;
  retryDelay: number;
  connectionTimeout: number;
  maxConnections: number;
}

@Injectable()
export class CacheConfigService {
  private readonly config: CacheConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = {
      enabled: this.configService.get('CACHE_ENABLED') === 'true',
      keyPrefix: this.configService.get('REDIS_KEY_PREFIX') || 'school:',
      defaultTtl: parseInt(this.configService.get('REDIS_DEFAULT_TTL') || '3600', 10),
      statsTtl: parseInt(this.configService.get('CACHE_STATS_TTL') || '300', 10),
      strategiesTtl: parseInt(this.configService.get('CACHE_STRATEGIES_TTL') || '600', 10),
      userTtl: parseInt(this.configService.get('CACHE_USER_TTL') || '1800', 10),
      paymentsTtl: parseInt(this.configService.get('CACHE_PAYMENTS_TTL') || '900', 10),
      sessionsTtl: parseInt(this.configService.get('CACHE_SESSIONS_TTL') || '3600', 10),
      maxRetries: parseInt(this.configService.get('REDIS_MAX_RETRIES') || '3', 10),
      retryDelay: parseInt(this.configService.get('REDIS_RETRY_DELAY') || '100', 10),
      connectionTimeout: parseInt(this.configService.get('REDIS_CONNECTION_TIMEOUT') || '10000', 10),
      maxConnections: parseInt(this.configService.get('REDIS_MAX_CONNECTIONS') || '10', 10),
    };
  }

  getConfig(): CacheConfig {
    return { ...this.config };
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  getKeyPrefix(): string {
    return this.config.keyPrefix;
  }

  getDefaultTtl(): number {
    return this.config.defaultTtl;
  }

  getTtl(type: 'stats' | 'strategies' | 'user' | 'payments' | 'sessions' | 'default'): number {
    switch (type) {
      case 'stats':
        return this.config.statsTtl;
      case 'strategies':
        return this.config.strategiesTtl;
      case 'user':
        return this.config.userTtl;
      case 'payments':
        return this.config.paymentsTtl;
      case 'sessions':
        return this.config.sessionsTtl;
      default:
        return this.config.defaultTtl;
    }
  }

  getRedisOptions() {
    return {
      maxRetriesPerRequest: this.config.maxRetries,
      retryStrategy: (times: number) => {
        if (times > this.config.maxRetries) {
          return null;
        }
        return Math.min(times * this.config.retryDelay, 3000);
      },
      enableReadyCheck: true,
      lazyConnect: true,
      connectTimeout: this.config.connectionTimeout,
    };
  }
}