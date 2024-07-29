import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import {
  database,
  DatabasePostsTableIndexKeys,
  DatabaseTable,
  DatabaseValidationError,
  imageStorage,
  uuid,
} from '../services';
import { PostRemoveServiceError, PostUpdateServiceError } from './post.error';
import { Config } from '../config';

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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
    const items = await database.query<Post[]>({
      tableName: this.tableName,
      key: { id },
    });
    const postItem = items[0] || undefined;

    // Prevent return if not owned by user
    if (postItem?.user_id !== userId) {
      return undefined;
    }

    return postItem;
  }

  async findByMap(mapId: string, userId: string): Promise<Post[]> {
    const items = await database.query<Post[]>({
      tableName: this.tableName,
      indexName: DatabasePostsTableIndexKeys.userId,
      key: { user_id: userId },
    });

    return items.filter((item) => item.map_id === mapId);
  }

  async update({ id, userId, data }: PostServiceUpdate): Promise<Post> {
    try {
      const post = await database.update<Post>({
        tableName: this.tableName,
        key: { id },
        condition: { user_id: userId },
        data: { ...data, updated_at: new Date().toISOString() },
      });

      return post;
    } catch (error) {
      if (error instanceof DatabaseValidationError) {
        throw new PostUpdateServiceError('Invalid Request');
      }
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    try {
      await database.remove({
        tableName: this.tableName,
        key: { id },
        condition: { user_id: userId },
      });
    } catch (error) {
      if (error instanceof DatabaseValidationError) {
        throw new PostRemoveServiceError('Invalid Request');
      }

      throw error;
    }
  }

  async generatePreSignedURL({
    type,
    mimeType,
  }: {
    type: string;
    mimeType: string;
  }): Promise<string> {
    const url = await imageStorage.createPresignedUrlWithClient({
      key: `phImages/${uuid.generateUUID()}.${type}`,
      bucket: Config.AWS_S3_BUCKET,
      contentType: mimeType,
    });

    return url;
  }
}
