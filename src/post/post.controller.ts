import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req) {
    console.log(createPostDto);

    return this.postService.create(createPostDto, req.user.sub);
  }

  @Get()
  findAll(@Req() req) {
    return this.postService.findAll(req.user.sub);
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
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req,
  ) {
    return this.postService.update({
      id,
      data: updatePostDto,
      userId: req.user.sub,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.postService.remove(id, req.user.sub);
  }
}
