import { Test, TestingModule } from '@nestjs/testing';
import { RedisController } from './cache.controller';

describe('RedisController', () => {
  let controller: RedisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedisController],
    }).compile();

    controller = module.get<RedisController>(RedisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
