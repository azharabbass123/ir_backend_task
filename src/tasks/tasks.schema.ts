import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  status: 'To Do' | 'In Progress' | 'Completed';

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  assignedTo: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  project: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
