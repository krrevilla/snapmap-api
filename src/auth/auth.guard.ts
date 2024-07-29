import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGaurd } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends PassportAuthGaurd('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const handler = context.getHandler();
    const controller = context.getClass();

    const isPublicRoute = this.reflector.get<boolean>('publicRoute', handler);
    const isPublicController = this.reflector.get<boolean>(
      'publicRoute',
      controller,
    );

    try {
      await super.canActivate(context);
    } catch (error) {
      if (isPublicRoute || isPublicController) {
        return true;
      } else {
        throw error;
      }
    }

    return true;
  }
}
