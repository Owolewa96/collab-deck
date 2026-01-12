import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface for a ProjectUser document (MongoDB)
 * Stores user-specific preferences and settings for projects
 */
export interface IProjectUser extends Document {
  user: any; // User ID
  project: any; // Project ID
  isPinned: boolean;
  isArchived: boolean;
  isFavorite: boolean;
  isContributing: boolean;
  recentlyViewed: boolean;
  viewedAt: Date | null;
}

/**
 * ProjectUser Schema
 */
const ProjectUserSchema = new Schema<IProjectUser>(
  {
    user: { type: Schema.Types.Mixed, required: true },
    project: { type: Schema.Types.Mixed, required: true },
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
    isContributing: { type: Boolean, default: true },
    recentlyViewed: { type: Boolean, default: false },
    viewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

/**
 * Compound index to ensure unique user-project combinations
 */
ProjectUserSchema.index({ user: 1, project: 1 }, { unique: true });

/**
 * Model Initialization (safe for hot reload in Next.js / Vercel)
 */
const ProjectUser: Model<IProjectUser> =
  mongoose.models.ProjectUser || mongoose.model<IProjectUser>('ProjectUser', ProjectUserSchema);

export default ProjectUser;
export { ProjectUserSchema };