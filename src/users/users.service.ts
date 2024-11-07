import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Create a user
  async create(user: { username: string; password: string; role: string }) {
    const createdUser = new this.userModel(user);
    return await createdUser.save();
  }

  // Get all users
  async findAll() {
    return this.userModel.find().exec();
  }

  // Get user by ID
  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }
}
