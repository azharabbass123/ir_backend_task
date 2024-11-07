import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; 
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new ForbiddenException('Authorization header not found');
    }

    const token = authHeader.split(' ')[1]; 
    if (!token) {
      throw new ForbiddenException('Token not found');
    }

    let decodedToken;
    try {
      decodedToken = this.jwtService.verify(token);
    } catch (error) {
      throw new ForbiddenException('Invalid token');
    }

    const userRole = decodedToken.role;
    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true; 
  }
}
