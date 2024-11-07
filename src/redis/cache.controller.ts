import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';

@Controller('cache')
export class CacheController {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  
  @Post('set')
  async setCache(
    @Body() { key, value, ttl }: { key: string; value: string; ttl?: number },
  ) {
    await this.redisCacheService.setCache(key, value, ttl);
    return `Cache set successfully with key: ${key}`;
  }

  
  @Get('get/:key')
  async getCache(@Param('key') key: string) {
    const cachedValue = await this.redisCacheService.getCache(key);
    return cachedValue ? `Cache value: ${cachedValue}` : 'Cache not found';
  }

  
  @Delete('delete/:key')
  async deleteCache(@Param('key') key: string) {
    await this.redisCacheService.delCache(key);
    return `Cache with key: ${key} deleted successfully`;
  }
}
