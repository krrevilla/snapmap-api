import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PhMapModule } from './ph_map/ph_map.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PhMapModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
