import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.schema';
import { JwtPayload } from './jwt-payload.interface';  

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<string> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      return "User not found";
    }

    const isPasswordValid = await (password == user.password);
    if (!isPasswordValid) {
      return "Invalid Creds";
    }

    const payload: JwtPayload = { username: user.username, sub: user._id, role: user.role };

    return this.jwtService.sign(payload);
  }
}
