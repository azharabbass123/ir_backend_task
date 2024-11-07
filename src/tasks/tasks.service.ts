import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './tasks.schema';

@Injectable()
export class TasksService {

  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(task: {
    title: string;
    status: string; 
    dueDate: Date;
    assignedTo: string; 
    project: string; 
  }) {
    const createdTask = new this.taskModel(task);
    return await createdTask.save();
  }

  async findAll() {
    return this.taskModel.find().exec();
  }

  async findById(id: string) {
    return this.taskModel.findById(id).exec();
  }
}
