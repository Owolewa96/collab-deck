/**
 * Project Model (Mongoose)
 *
 * This file defines the Project schema for core project data.
 * User preferences (pinned, archived, favorite) are stored separately
 * in the ProjectUser model to allow different users to have different
 * preferences for the same project.
 *
 * Fields:
 * - name, description, status (active|completed|archived)
 * - creator, collaborators (user references)
 * - priority (low|medium|high|critical)
 * - startDate, endDate
 * - timestamps (createdAt, updatedAt)
 */

import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Project Schema
 */
const ProjectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
    },
    creator: { type: Schema.Types.Mixed, required: true }, // user id or object
    collaborators: [{ type: Schema.Types.Mixed }], // user ids or emails
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
  },
  { timestamps: true }
);

// Virtuals / helpers can be added as needed, for example daysUntilDeadline
ProjectSchema.virtual('daysUntilDeadline').get(function () {
  if (!this.endDate) return null;
  const now = new Date();
  const diff = this.endDate - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Export Mongoose model if mongoose connection is available
let ProjectModel;
try {
  ProjectModel = mongoose.models?.Project || mongoose.model('Project', ProjectSchema);
} catch (err) {
  // If mongoose isn't configured in the environment, export a thin placeholder
  /* eslint-disable no-console */
  console.warn('Mongoose model not initialized. Falling back to placeholder Project API.');
  /* eslint-enable no-console */
  ProjectModel = {
    findById: async (id) => {
      console.log(`Finding project with id: ${id}`);
      return null;
    },
    findByWorkspaceId: async (workspaceId) => {
      console.log(`Finding projects for workspace: ${workspaceId}`);
      return [];
    },
    create: async (data) => {
      console.log('Creating project:', data);
      return data;
    },
    updateOne: async (filter, update) => {
      console.log('Updating project:', filter, update);
      return { modifiedCount: 1 };
    },
  };
}

export default ProjectModel;

export { ProjectSchema };
