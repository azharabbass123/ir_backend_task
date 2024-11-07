import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './projects.schema';

@Injectable()
export class ProjectsService {

  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

  // Create a project
  async create(project: {
    name: string;
    description: string;
    owner: string; // UserId
    members: string[]; // Array of UserIds
  }) {
    const createdProject = new this.projectModel(project);
    return await createdProject.save();
  }

  // Get all projects
  async findAll() {
    return this.projectModel.find().exec();
  }

  // Get project by ID
  async findById(id: string) {
    return this.projectModel.findById(id).exec();
  }
}
