import { Test, TestingModule } from '@nestjs/testing';
import { PhMapController } from './ph_map.controller';
import { PhMapService } from './ph_map.service';

describe('PhMapController', () => {
  let controller: PhMapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhMapController],
      providers: [PhMapService],
    }).compile();

    controller = module.get<PhMapController>(PhMapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
