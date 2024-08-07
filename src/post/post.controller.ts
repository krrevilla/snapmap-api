import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostUpdateServiceError, PostRemoveServiceError } from './post.error';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req) {
    return this.postService.create(createPostDto, req.user.sub);
  }

  @Get()
  findAll(@Req() req) {
    return this.postService.findAll(req.user.sub);
  }

  @Get('map/:id')
  async findByMap(@Param('id') id: string, @Req() req) {
    return this.postService.findByMap(id, req.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const post = await this.postService.findOne(id, req.user.sub);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req,
  ) {
    try {
      const updatedPost = await this.postService.update({
        id,
        data: updatePostDto,
        userId: req.user.sub,
      });

      return updatedPost;
    } catch (error) {
      if (error instanceof PostUpdateServiceError) {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    try {
      await this.postService.remove(id, req.user.sub);
    } catch (error) {
      if (error instanceof PostRemoveServiceError) {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Get('s3/presigned')
  async generatePreSignedURL(@Req() req) {
    try {
      const url = this.postService.generatePreSignedURL({
        type: req.query.type,
        mimeType: req.query.mimeType,
      });

      return url;
    } catch (error) {
      throw new BadRequestException('Failed to generate presigned url');
    }
  }
}
