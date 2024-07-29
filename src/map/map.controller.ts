import { Controller, Get, NotFoundException, Param, Req } from '@nestjs/common';
import { MapService } from './map.service';
import { PublicRoute } from '../decorators/public_route.decorator';

@PublicRoute()
@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  findAll(@Req() req) {
    return this.mapService.findAll(req.user?.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const map = await this.mapService.findOne(id, req.user?.sub);

    if (!map) {
      throw new NotFoundException('Post not found');
    }

    return map;
  }
}
