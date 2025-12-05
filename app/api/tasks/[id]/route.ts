import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
// @ts-ignore
import Task from '@/models/Task';
// @ts-ignore
import Project from '@/models/Project';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get('authToken')?.value;
    let userId = null;
    let userEmail = null;

    if (token) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
        userEmail = decoded.email;
      } catch (err) {
        /* eslint-disable no-console */
        console.error('Token verification failed:', err);
        /* eslint-enable no-console */
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { status, priority, description } = body;

    // Find the task
    // @ts-ignore
    const task: any = await (Task as any).findById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check project access: user must be creator or in collaborators
    // @ts-ignore
    const project: any = await (Project as any).findById(task.projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isCreator = String(project.creator) === String(userId) || String(project.creator) === String(userEmail);
    const isCollaborator = Array.isArray(project.collaborators) && project.collaborators.includes(userId) ||
      (Array.isArray(project.collaborators) && project.collaborators.includes(userEmail));

    if (!isCreator && !isCollaborator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update allowed fields
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (description !== undefined) task.description = description;
    task.updatedAt = new Date();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updated = await (task as any).save?.() || task;

    return NextResponse.json({ message: 'Task updated', task: updated }, { status: 200 });
  } catch (err: any) {
    /* eslint-disable no-console */
    console.error('Update task error:', err);
    /* eslint-enable no-console */
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectDB();

    // @ts-ignore
    const task: any = await (Task as any).findById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (err: any) {
    /* eslint-disable no-console */
    console.error('Get task error:', err);
    /* eslint-enable no-console */
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
