import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { MapModule } from './map/map.module';

@Module({
  imports: [AuthModule, UserModule, PostModule, MapModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
