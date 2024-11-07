import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from '../tasks/tasks.schema';
import { Project, ProjectDocument } from '../projects/projects.schema';
import { User, UserDocument } from '../users/users.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getTaskCompletionSummary(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const aggregation = [
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      { $skip: skip },
      { $limit: limit },
    ];
    return this.taskModel.aggregate(aggregation).exec();
  }

  async getUserPerformanceReport(userId: string) {
    const aggregation = [
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ];
    return this.taskModel.aggregate(aggregation).exec();
  }

  async getOverdueTasksSummary(page: number = 1, limit: number = 10) {
    const currentDate = new Date();
    const skip = (page - 1) * limit;
    const aggregation = [
      { $match: { dueDate: { $lt: currentDate }, status: { $ne: 'Completed' } } },
      {
        $group: {
          _id: '$projectId',
          overdueCount: { $sum: 1 },
        },
      },
      { $skip: skip },
      { $limit: limit },
    ];
    return this.taskModel.aggregate(aggregation).exec();
  }

  async getProjectTaskSummary(projectId: string) {
    const aggregation = [
      { $match: { projectId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'members',
        },
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          members: {
            $map: {
              input: '$members',
              as: 'member',
              in: { _id: '$$member._id', username: '$$member.username' },
            },
          },
        },
      },
    ];
    return this.taskModel.aggregate(aggregation).exec();
  }
}
