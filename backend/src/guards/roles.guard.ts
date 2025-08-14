
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log("RolesGuard activated");
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true; // no role restriction

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log("User role:", user.role);
    console.log("Required roles:", requiredRoles);
    console.log("User has required role:", requiredRoles.includes(user.role));
    return requiredRoles.includes(user.role);
  }
}
