// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("AuthGuard activated");
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.access_token;

    if (!token) throw new UnauthorizedException('Unauthorized');

    try {
      const user = await this.authService.validateToken(token);
      request.user = user; // attach user info to request
      if (!user || !user.active) {
        throw new UnauthorizedException('User is not active or session is invalid');
      }
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }
}
