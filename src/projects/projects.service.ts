import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './projects.schema';

@Injectable()
export class ProjectsService {

  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

  async create(project: {
    name: string;
    description: string;
    owner: string; 
    members: string[]; 
  }) {
    const createdProject = new this.projectModel(project);
    return await createdProject.save();
  }

  
  async findAll() {
    return this.projectModel.find().exec();
  }

  
  async findById(id: string) {
    return this.projectModel.findById(id).exec();
  }

  async update(id: string, updateData: any): Promise<Project> {
    return await this.projectModel.findByIdAndUpdate(id, updateData, { new: true });
  }
}
