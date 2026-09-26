import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { CacheService } from './cache.service';
import { CacheConfigService } from './cache.config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    RedisService,
    CacheConfigService,
    CacheService,
  ],
  exports: [
    RedisService,
    CacheConfigService,
    CacheService,
  ],
})
export class CacheModule {}