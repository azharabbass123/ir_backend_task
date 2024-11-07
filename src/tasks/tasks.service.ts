import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './tasks.schema';

@Injectable()
export class TasksService {

  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  // Create a task
  async create(task: {
    title: string;
    status: string; // "To Do", "In Progress", "Completed"
    dueDate: Date;
    assignedTo: string; // UserId
    project: string; // ProjectId
  }) {
    const createdTask = new this.taskModel(task);
    return await createdTask.save();
  }

  // Get all tasks
  async findAll() {
    return this.taskModel.find().exec();
  }

  // Get task by ID
  async findById(id: string) {
    return this.taskModel.findById(id).exec();
  }
}
