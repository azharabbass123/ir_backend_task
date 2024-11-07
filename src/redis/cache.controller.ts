import { Controller, Delete } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';

@Controller('cache')
export class CacheController {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  @Delete('clear')
  async clearCache() {
    await this.redisCacheService.clearAllCache();
    return 'All cache cleared successfully';
  }
}
