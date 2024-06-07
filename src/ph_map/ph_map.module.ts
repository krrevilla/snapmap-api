import { Module } from '@nestjs/common';
import { PhMapService } from './ph_map.service';
import { PhMapController } from './ph_map.controller';

@Module({
  controllers: [PhMapController],
  providers: [PhMapService],
})
export class PhMapModule {}
