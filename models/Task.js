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
