import { Injectable } from '@nestjs/common';
import { database, DatabaseTable } from '../services';
import { PhMap, UserPhMap } from './entities/ph_map.entity';
import { PostService } from '../post/post.service';

@Injectable()
export class PhMapService {
  constructor(private readonly postService: PostService) {}
  private tableName = DatabaseTable.phMap;

  async findAll(userId: string): Promise<UserPhMap[]> {
    const data = await database.scan<PhMap[]>({ tableName: this.tableName });
    const userPosts = await this.postService.findAll(userId);

    const userMap: UserPhMap[] = data.map((map): UserPhMap => {
      const userPost = userPosts.find((post) => post.map_id === map.id);

      return {
        ...map,
        hasPost: !!userPost,
      };
    });

    return userMap;
  }
}
