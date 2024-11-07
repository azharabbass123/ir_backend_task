import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('analytics')
@UseGuards(RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('task-completion-summary')
  @Roles('Admin', 'Manager')
  async getTaskCompletionSummary(@Query('page') page: number, @Query('limit') limit: number) {
    return this.analyticsService.getTaskCompletionSummary(page, limit);
  }

  @Get('user-performance-report')
  @Roles('Admin', 'Manager')
  async getUserPerformanceReport(@Query('username') userId: string) {
    return this.analyticsService.getUserPerformanceReport(userId);
  }

  @Get('overdue-tasks-summary')
  @Roles('Admin', 'Manager')
  async getOverdueTasksSummary(@Query('page') page: number, @Query('limit') limit: number) {
    return this.analyticsService.getOverdueTasksSummary(page, limit);
  }

  @Get('project-task-summary')
  @Roles('Admin', 'Manager')
  async getProjectTaskSummary(@Query('projectName') projectId: string) {
    return this.analyticsService.getProjectTaskSummary(projectId);
  }
}
