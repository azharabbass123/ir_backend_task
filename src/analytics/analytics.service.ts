import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';
import { Task, TaskDocument } from '../tasks/tasks.schema';
import { Project, ProjectDocument } from '../projects/projects.schema';
import { User, UserDocument } from '../users/users.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getTaskCompletionSummary(page: number = 1, limit: number = 10) {
    const cacheKey = `taskCompletionSummary_${page}_${limit}`;
    let cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

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

    const data = await this.taskModel.aggregate(aggregation).exec();
    await this.cacheManager.set(cacheKey, data, 3600 ); 
    return data;
  }

  async getUserPerformanceReport(username: string) {
    const cacheKey = `userPerformanceReport_${username}`;
    let cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const user = await this.userModel.findOne({ username }).exec();

    if (!user) {
      return "User not found";
    }

    const userId = user._id; 

    const aggregation = [
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ];

    const data = await this.taskModel.aggregate(aggregation).exec();

    await this.cacheManager.set(cacheKey, data, 3600);  

    return data;
  }


  async getOverdueTasksSummary(page: number = 1, limit: number = 10) {
    const cacheKey = `overdueTasksSummary_${page}_${limit}`;
    let cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

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

    const data = await this.taskModel.aggregate(aggregation).exec();
    await this.cacheManager.set(cacheKey, data, 3600) 
    return data;
  }

  async getProjectTaskSummary(projectId: string) {
    const cacheKey = `projectTaskSummary_${projectId}`;
    let cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

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

    const data = await this.taskModel.aggregate(aggregation).exec();
    await this.cacheManager.set(cacheKey, data, 3600 ); 
    return data;
  }
}
