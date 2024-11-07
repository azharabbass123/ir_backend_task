import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheController } from './cache.controller';
import { RedisCacheService } from './redis-cache.service';
import { redisStore } from "cache-manager-redis-store";

@Module({
  imports: [
    CacheModule.register({
      store: redisStore as any,           
      host: 'localhost',           
      port: 6379,                  
      ttl: 60 * 60,                
    }),
  ],
  controllers: [CacheController],
  providers: [RedisCacheService],
})
export class RedisModule {}
