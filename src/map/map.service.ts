import { Injectable } from '@nestjs/common';
import { database, DatabaseTable } from '../services';
import { Map, UserMap } from './map.entity';
import { PostService } from '../post/post.service';

@Injectable()
export class MapService {
  constructor(private readonly postService: PostService) {}
  private phMapTableName = DatabaseTable.phMap;

  async findAll(userId?: string): Promise<UserMap[]> {
    const data = await database.scan<Map[]>({ tableName: this.phMapTableName });

    if (!userId) {
      return data.map((map) => ({ ...map, has_post: false }));
    }

    const userPosts = await this.postService.findAll(userId);

    const userMap: UserMap[] = data.map((map): UserMap => {
      const userPost = userPosts.find((post) => post.map_id === map.id);

      return {
        ...map,
        has_post: !!userPost,
      };
    });

    return userMap;
  }

  async findOne(id: string, userId?: string): Promise<UserMap | undefined> {
    const data = await database.get<Map>({
      tableName: this.phMapTableName,
      key: { id },
    });

    if (!data) {
      return undefined;
    }

    if (!userId) {
      return { ...data, has_post: false };
    }

    const userPosts = await this.postService.findAll(userId);
    const post = userPosts.find((post) => post.map_id === id);

    return { ...data, has_post: !!post };
  }
}
