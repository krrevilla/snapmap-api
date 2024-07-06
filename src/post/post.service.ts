import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import {
  database,
  DatabasePostsTableIndexKeys,
  DatabaseTable,
  uuid,
} from '../services';

type PostServiceUpdate = {
  id: string;
  userId: string;
  data: UpdatePostDto;
};

@Injectable()
export class PostService {
  private tableName = DatabaseTable.posts;

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    const post: Post = {
      id: uuid.generateUUID(),
      user_id: userId,
      ...createPostDto,
    };
    await database.put({ tableName: this.tableName, data: post });

    return post;
  }

  async findAll(userId: string): Promise<Post[]> {
    const posts = await database.query<Post[]>({
      tableName: this.tableName,
      indexName: DatabasePostsTableIndexKeys.userId,
      key: { user_id: userId },
    });

    return posts;
  }

  async findOne(id: string, userId: string): Promise<Post | undefined> {
    const item = await database.query<Post>({
      tableName: this.tableName,
      key: { id },
    });

    // Prevent return if not owned by user
    if (item?.user_id !== userId) {
      return undefined;
    }

    return item;
  }

  async update({ id, userId, data }: PostServiceUpdate): Promise<Post> {
    const post = await database.update<Post>({
      tableName: this.tableName,
      key: { id },
      condition: { user_id: userId },
      data: data,
    });

    return post;
  }

  async remove(id: string, userId: string): Promise<void> {
    await database.remove({
      tableName: this.tableName,
      key: { id },
      condition: { user_id: userId },
    });
  }
}
