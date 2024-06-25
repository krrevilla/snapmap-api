import { Injectable } from '@nestjs/common';
import { Auth0User, User } from './entities/user.entity';
import { auth0Axios, auth0Endpoints } from '../services';

@Injectable()
export class UserService {
  private mapAuth0UserToUser(user: Auth0User): User {
    return {
      id: user.sub,
      email: user.email,
    };
  }

  async getAuthUser(jwt: string): Promise<User> {
    try {
      const response = await auth0Axios.get<Auth0User>(
        `/${auth0Endpoints.userinfo}`,
        {
          headers: { Authorization: jwt },
        },
      );

      return this.mapAuth0UserToUser(response.data);
    } catch (error) {
      // TODO: Handle Error
      throw new Error('Unable to fetch authed user');
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
