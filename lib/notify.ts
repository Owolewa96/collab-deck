import Notification, { INotification } from '@/models/Notification';

export interface CreateNotificationPayload {
  user: any;
  type?: 'deadline' | 'mention' | 'assignment' | 'update' | 'system' | 'invite';
  title: string;
  description?: string;
  createdBy?: any;
  projectId?: any;
  taskId?: any;
  actionUrl?: string;
  meta?: Record<string, any>;
}

export async function createNotification(payload: CreateNotificationPayload) {
  try {
    const doc = await Notification.create({
      user: payload.user,
      type: payload.type || 'system',
      title: payload.title,
      description: payload.description || '',
      createdBy: payload.createdBy || null,
      projectId: payload.projectId || null,
      taskId: payload.taskId || null,
      actionUrl: payload.actionUrl || '',
      meta: payload.meta || {},
    });
    return doc;
  } catch (err) {
    // don't block main flow on notification errors
    console.error('createNotification error:', err);
    return null;
  }
}

export async function notifyMultiple(recipients: any[], base: Omit<CreateNotificationPayload, 'user'>) {
  if (!Array.isArray(recipients) || recipients.length === 0) return []; 
  try {
    const docs = recipients.map((r) => ({
      user: r,
      type: base.type || 'system',
      title: base.title,
      description: base.description || '',
      createdBy: base.createdBy || null,
      projectId: base.projectId || null,
      taskId: base.taskId || null,
      actionUrl: base.actionUrl || '',
      meta: base.meta || {},
    }));
    const created = await Notification.insertMany(docs);
    return created;
  } catch (err) {
    console.error('notifyMultiple error:', err);
    return [];
  }
}
