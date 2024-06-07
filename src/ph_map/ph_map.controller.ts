import { Controller, Get, UseGuards } from '@nestjs/common';
import { PhMapService } from './ph_map.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('ph-map')
export class PhMapController {
  constructor(private readonly phMapService: PhMapService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.phMapService.findAll();
  }
}
