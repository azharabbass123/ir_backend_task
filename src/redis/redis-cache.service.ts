import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';  
import { Cache } from 'cache-manager';  

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setCache(key: string, value: any, ttl: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async getCache(key: string): Promise<any> {
    return this.cacheManager.get(key);
  }

  async delCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
