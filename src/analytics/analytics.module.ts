import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Task, TaskSchema } from '../tasks/tasks.schema';
import { Project, ProjectSchema } from '../projects/projects.schema';
import { User, UserSchema } from '../users/users.schema';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore as any,
        host: 'localhost',
        port: 6379,
        ttl: 60 * 60, 
      }),
    }),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, RolesGuard], 
})
export class AnalyticsModule {}
