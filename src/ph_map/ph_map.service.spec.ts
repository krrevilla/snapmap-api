import { Test, TestingModule } from '@nestjs/testing';
import { PhMapService } from './ph_map.service';

describe('PhMapService', () => {
  let service: PhMapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhMapService],
    }).compile();

    service = module.get<PhMapService>(PhMapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
