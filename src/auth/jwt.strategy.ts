import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Extract JWT from the Authorization header
      secretOrKey: 'yourSecretKey',  // Use the same secret as in auth.module.ts
    });
  }

  async validate(payload: JwtPayload) {
    // Find user by ID (sub) and return user data
    const user = await this.userService.findById(payload.sub);
    return user;
  }
}
