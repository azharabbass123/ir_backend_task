import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';  
import {  Cache } from 'cache-manager';  

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async clearAllCache(): Promise<void> {
    await this.cacheManager.reset();
  }
}
