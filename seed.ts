import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';
import { ProjectsService } from './src/projects/projects.service';
import { TasksService } from './src/tasks/tasks.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // Get the necessary services
  const userService = app.get(UsersService);
  const projectService = app.get(ProjectsService);
  const taskService = app.get(TasksService);

  // Create users (1 Admin, 3 Managers, 6 Members)
  const users = [
    { username: 'adminUser', password: 'adminPass', role: 'Admin' },
    { username: 'manager1', password: 'managerPass', role: 'Manager' },
    { username: 'manager2', password: 'managerPass', role: 'Manager' },
    { username: 'manager3', password: 'managerPass', role: 'Manager' },
    { username: 'member1', password: 'memberPass', role: 'Member' },
    { username: 'member2', password: 'memberPass', role: 'Member' },
    { username: 'member3', password: 'memberPass', role: 'Member' },
    { username: 'member4', password: 'memberPass', role: 'Member' },
    { username: 'member5', password: 'memberPass', role: 'Member' },
    { username: 'member6', password: 'memberPass', role: 'Member' },
  ];

  const createdUsers = [];
  for (const user of users) {
    const createdUser = await userService.create(user);
    createdUsers.push(createdUser); // Save created users to link them with projects later
  }

  // Create projects (3 projects)
  const projects = [
    {
      name: 'Project Alpha',
      description: 'A sample project for alpha',
      owner: createdUsers[0]._id, // Admin is the owner
      members: [createdUsers[1]._id, createdUsers[2]._id, createdUsers[3]._id, createdUsers[4]._id],
    },
    {
      name: 'Project Beta',
      description: 'A sample project for beta',
      owner: createdUsers[1]._id, // Manager1 is the owner
      members: [createdUsers[2]._id, createdUsers[3]._id, createdUsers[5]._id, createdUsers[6]._id],
    },
    {
      name: 'Project Gamma',
      description: 'A sample project for gamma',
      owner: createdUsers[2]._id, // Manager2 is the owner
      members: [createdUsers[4]._id, createdUsers[5]._id, createdUsers[6]._id],
    },
  ];

  const createdProjects = [];
  for (const project of projects) {
    const createdProject = await projectService.create(project);
    createdProjects.push(createdProject); // Save created projects to link them with tasks later
  }

  // Create tasks (5 tasks for each project with different statuses)
  const taskStatuses = ['To Do', 'In Progress', 'Completed'];
  const tasks = [];

  for (const project of createdProjects) {
    for (let i = 1; i <= 5; i++) {
      tasks.push({
        title: `Task ${i} for ${project.name}`,
        status: taskStatuses[i % 3], // Cycles through To Do, In Progress, Completed
        dueDate: new Date(Date.now() + i * 1000 * 60 * 60 * 24), // Different due dates
        assignedTo: createdUsers[i % createdUsers.length]._id, // Assign to different users in the array
        project: project._id, // Link to the project
      });
    }
  }

  // Save tasks to the database
  for (const task of tasks) {
    await taskService.create(task);
  }

  console.log('Database seeded successfully');
  await app.close();
}

bootstrap();
