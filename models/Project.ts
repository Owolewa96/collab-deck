import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface for a Project document (MongoDB)
 */
export interface IProject extends Document {
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  creator: any; // You can replace `any` with IUser["_id"] later
  collaborators: any[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: Date | null;
  endDate: Date | null;
  daysUntilDeadline?: number | null;
}

/**
 * Project Schema
 */
const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
    },
    creator: { type: Schema.Types.Mixed, required: true }, // user ID or object
    collaborators: [{ type: Schema.Types.Mixed }],
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

/**
 * Virtual: daysUntilDeadline
 */
ProjectSchema.virtual('daysUntilDeadline').get(function (this: IProject) {
  if (!this.endDate) return null;
  const now = new Date();
  const diff = this.endDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

/**
 * Model Initialization (safe for hot reload in Next.js / Vercel)
 */
const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
export { ProjectSchema };
