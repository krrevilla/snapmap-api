import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { PostService } from '../post/post.service';

@Module({
  controllers: [MapController],
  providers: [MapService, PostService],
})
export class MapModule {}
