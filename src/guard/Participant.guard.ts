import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuth } from './auth.guard'; 
import { ROLES_KEY } from '../role.decorator'; 


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const jwtAuthGuard = new JwtAuth(); 
    const isJwtValid = jwtAuthGuard.canActivate(context);
    if (!isJwtValid) {
      throw new UnauthorizedException('Invalid JWT token');
    }

    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; 
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
