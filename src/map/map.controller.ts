import { Controller, Get, NotFoundException, Param, Req } from '@nestjs/common';
import { MapService } from './map.service';
import { PublicRoute } from '../decorators/public_route.decorator';
import { MapCode } from './map.entity';

@PublicRoute()
@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get(':code')
  async findAll(@Param('code') code: MapCode, @Req() req) {
    if (!code) {
      throw new NotFoundException('Map not found');
    }

    const data = await this.mapService.findAll({ userId: req.user?.sub, code });

    if (!data) {
      throw new NotFoundException('Map not found');
    }

    return data;
  }

  @Get(':code/:id')
  async findOne(
    @Param('code') code: MapCode,
    @Param('id') id: string,
    @Req() req,
  ) {
    const map = await this.mapService.findOne({
      id,
      userId: req.user?.sub,
      code: code,
    });

    if (!map) {
      throw new NotFoundException('Post not found');
    }

    return map;
  }
}
