import { Injectable } from '@nestjs/common';
import { MapCode, UserMap } from './map.entity';
import { PostService } from '../post/post.service';
import { codeMapping } from './data/mapping';

@Injectable()
export class MapService {
  constructor(private readonly postService: PostService) {}
  async findAll({
    userId,
    code,
  }: {
    userId?: string;
    code: MapCode;
  }): Promise<UserMap[] | null> {
    const data = codeMapping[code];

    if (!data) {
      return null;
    }

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

  async findOne({
    id,
    userId,
    code,
  }: {
    id: string;
    userId?: string;
    code: MapCode;
  }): Promise<UserMap | undefined> {
    const map = codeMapping[code] ?? [];
    const data = map.find((data) => data.id === id);

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
