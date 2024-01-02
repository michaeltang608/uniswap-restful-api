import { Test, TestingModule } from '@nestjs/testing';
import { SwapController } from './swap.controller';

describe('SwapController', () => {
  let controller: SwapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwapController],
    }).compile();

    controller = module.get<SwapController>(SwapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
