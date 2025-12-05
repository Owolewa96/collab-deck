/**
 * Task Model (Mongoose)
 */
import mongoose from 'mongoose';

const { Schema } = mongoose;

const TaskSchema = new Schema(
  {
    projectId: { type: Schema.Types.Mixed, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    assignees: [{ type: Schema.Types.Mixed }],
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: { type: Date, default: null },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  },
  { timestamps: true }
);

let TaskModel;
try {
  TaskModel = mongoose.models?.Task || mongoose.model('Task', TaskSchema);
} catch (err) {
  /* eslint-disable no-console */
  console.warn('Mongoose Task model init failed, falling back to placeholder.');
  /* eslint-enable no-console */
  TaskModel = {
    findByProjectId: async (projectId) => {
      console.log('Finding tasks for project:', projectId);
      return [];
    },
    create: async (data) => {
      console.log('Creating task (placeholder):', data);
      return { ...data, _id: String(Math.random()) };
    },
  };
}

export default TaskModel;
/**
 * Task Model
 * Schema for individual tasks/issues
 */

export const taskSchema = {
  _id: String,
  projectId: String,
  title: String,
  description: String,
  assignee: String,
  priority: String,
  dueDate: Date,
  status: String,
  createdAt: Date,
  updatedAt: Date,
};

export const Task = {
  findById: async (id) => {
    console.log(`Finding task with id: ${id}`);
    return null;
  },
  findByProjectId: async (projectId) => {
    console.log(`Finding tasks for project: ${projectId}`);
    return [];
  },
  findByColumnId: async (columnId) => {
    console.log(`Finding tasks for column: ${columnId}`);
    return [];
  },
  create: async (data) => {
    console.log('Creating task:', data);
    return data;
  },
  updateOne: async (filter, update) => {
    console.log('Updating task:', filter, update);
    return { modifiedCount: 1 };
  },
  deleteOne: async (filter) => {
    console.log('Deleting task:', filter);
    return { deletedCount: 1 };
  },
};
