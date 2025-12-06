import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  user: any; // recipient (id or email)
  type: 'deadline' | 'mention' | 'assignment' | 'update' | 'system' | 'invite';
  title: string;
  description?: string;
  read: boolean;
  createdBy?: any;
  projectId?: any;
  taskId?: any;
  actionUrl?: string;
  meta?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.Mixed, required: true },
    type: {
      type: String,
      enum: ['deadline', 'mention', 'assignment', 'update', 'system', 'invite'],
      default: 'system',
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    read: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.Mixed, default: null },
    projectId: { type: Schema.Types.Mixed, default: null },
    taskId: { type: Schema.Types.Mixed, default: null },
    actionUrl: { type: String, default: '' },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const Notification: Model<INotification> =
  (mongoose.models.Notification as Model<INotification>) || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
