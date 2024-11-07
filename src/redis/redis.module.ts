import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';  

@Module({
  imports: [
    CacheModule.register({
      store: redisStore as any,         
      host: 'localhost',         
      port: 6379,                
      ttl: 60 * 60,              
    }),
  ],
  exports: [CacheModule],       
})
export class RedisModule {}
