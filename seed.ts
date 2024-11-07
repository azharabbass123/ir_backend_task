import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';
import { ProjectsService } from './src/projects/projects.service';
import { TasksService } from './src/tasks/tasks.service';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UsersService);
  const projectService = app.get(ProjectsService);
  const taskService = app.get(TasksService);

  const users = [
    { username: 'admin', password: 'adminPass', role: 'Admin' },
    { username: 'Ali', password: 'ali@manager', role: 'Manager' },
    { username: 'Qadeer', password: 'qadeer@manager', role: 'Manager' },
    { username: 'Hassan', password: 'hassan@manager', role: 'Manager' },
    { username: 'Hamza', password: 'hamza@member', role: 'Member' },
    { username: 'Adil', password: 'adil@member', role: 'Member' },
    { username: 'Farhan', password: 'farhan@member', role: 'Member' },
    { username: 'Noman', password: 'noman@memeber', role: 'Member' },
    { username: 'Saad', password: 'saad@member', role: 'Member' },
    { username: 'Kashif', password: 'kashif@member', role: 'Member' },
  ];

  const createdUsers = [];
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await userService.create({
      ...user,
      password: hashedPassword,
    });
    createdUsers.push(createdUser);
  }

  const managers = createdUsers.filter(user => user.role === 'Manager');
  const members = createdUsers.filter(user => user.role === 'Member');

  const projects = [
    {
      name: 'Web Project',
      description: 'We are going to build an outstanding website.',
      owner: managers[0]._id,
      members: [members[0]._id, members[1]._id, members[2]._id],
      tasks: [],
    },
    {
      name: 'E Commerce Project',
      description: 'A sample but effective e-commerce store is on the way.',
      owner: managers[1]._id,
      members: [members[3]._id, members[4]._id, members[5]._id],
      tasks: [],
    },
    {
      name: 'LMS for Learning Innovation',
      description: 'A unique LMS to revolutionize the way people can learn.',
      owner: managers[2]._id,
      members: [members[2]._id, members[4]._id, members[0]._id],
      tasks: [],
    },
  ];

  const createdProjects = [];
  for (const project of projects) {
    const createdProject = await projectService.create(project);
    createdProjects.push(createdProject);
  }

  const tasks = [];
  let taskIndex = 0;
  let overdueTaskCount = 0;

  for (const project of createdProjects) {
    for (let i = 1; i <= 10; i++) {
      const taskStatus = i % 3 === 0 ? 'Completed' : (i % 2 === 0 ? 'In Progress' : 'To Do');
      
      const isPastDue = overdueTaskCount < 4 && i > 7;
      if (isPastDue) overdueTaskCount++;

      const dueDate = isPastDue
        ? new Date(Date.now() - (i * 1000 * 60 * 60 * 24))
        : new Date(Date.now() + (i * 1000 * 60 * 60 * 24));

      const assignedUser = members[(taskIndex % members.length)];

      tasks.push({
        title: `Task ${taskIndex + 1} for ${project.name}`,
        status: taskStatus,
        dueDate,
        assignedTo: assignedUser._id,
        project: project._id,
      });

      taskIndex++;
    }
  }

  const createdTasks = [];
  for (const task of tasks) {
    const createdTask = await taskService.create(task);
    createdTasks.push(createdTask);
  }

  for (let i = 0; i < createdProjects.length; i++) {
    const project = createdProjects[i];
    const projectTasks = createdTasks.slice(i * 10, (i + 1) * 10);
    project.tasks = projectTasks.map(task => task._id);

    await projectService.update(project._id, { tasks: project.tasks });
  }

  console.log('Database seeded successfully');
  await app.close();
}

bootstrap();
