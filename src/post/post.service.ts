import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { database, Table } from '../services';
import { v4 } from 'uuid';

type PostServiceUpdate = {
  id: string;
  userId: string;
  data: UpdatePostDto;
};

@Injectable()
export class PostService {
  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    const id = v4();
    const post: Post = {
      id,
      user_id: userId,
      ...createPostDto,
    };
    await database.put({ table: Table.posts, data: post });

    return post;
  }

  async findAll(userId: string): Promise<Post[]> {
    const posts = await database.query<Post[]>({
      table: Table.posts,
      key: { user_id: userId },
    });

    return posts;
  }

  async findOne(id: string, userId: string): Promise<Post | undefined> {
    const item = await database.get<Post>({
      table: Table.posts,
      key: { id },
    });

    return item;
  }

  async update({ id, userId, data }: PostServiceUpdate): Promise<Post> {
    const post = await database.update<Post, UpdatePostDto>({
      table: Table.posts,
      key: { id },
      data: data,
    });

    return post;
  }

  async remove(id: string, userId: string): Promise<void> {
    await database.remove({ table: Table.posts, key: { id } });
  }
}
