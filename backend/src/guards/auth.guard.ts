// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("AuthGuard activated");
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.access_token;

    if (!token) return false;

    try {
      const user = await this.authService.validateToken(token);
      request.user = user; // attach user info to request
      return true;
    } catch {
      return false;
    }
  }
}
