import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PhMapService } from './ph_map.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('ph-map')
export class PhMapController {
  constructor(private readonly phMapService: PhMapService) {}

  @Get()
  findAll(@Req() req) {
    return this.phMapService.findAll(req.user.sub);
  }
}
