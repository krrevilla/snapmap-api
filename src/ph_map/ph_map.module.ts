import { Module } from '@nestjs/common';
import { PhMapService } from './ph_map.service';
import { PhMapController } from './ph_map.controller';
import { PostService } from '../post/post.service';

@Module({
  controllers: [PhMapController],
  providers: [PhMapService, PostService],
})
export class PhMapModule {}
