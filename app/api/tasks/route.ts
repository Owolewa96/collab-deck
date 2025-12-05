import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
// @ts-ignore
import Project from '@/models/Project';
// @ts-ignore
// @ts-ignore
import Task from '@/models/Task';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

export async function POST(req: NextRequest) {
  try {
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
    const { projectId, title, description, dueDate, assignees } = body;

    if (!projectId || !title || title.trim().length === 0) {
      return NextResponse.json({ error: 'projectId and title are required' }, { status: 400 });
    }

    // Check project access: user must be creator or in collaborators
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const project: any = await (Project as any).findById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isCreator = String(project.creator) === String(userId) || String(project.creator) === String(userEmail);
    const isCollaborator = Array.isArray(project.collaborators) && project.collaborators.includes(userId) ||
      (Array.isArray(project.collaborators) && project.collaborators.includes(userEmail));

    if (!isCreator && !isCollaborator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const taskData = {
      projectId,
      title: title.trim(),
      description: description ?? '',
      assignees: assignees || [],
      dueDate: dueDate ? new Date(dueDate) : null,
      status: 'todo',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const created = await (Task as any).create(taskData);

    return NextResponse.json({ message: 'Task created', task: created }, { status: 201 });
  } catch (err: any) {
    /* eslint-disable no-console */
    console.error('Create task error:', err);
    /* eslint-enable no-console */
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    await connectDB();

    // Support both mongoose model and placeholder
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tasks;
    // If Task has a .find (mongoose model)
    if ((Task as any).find) {
      tasks = await (Task as any).find({ projectId }).lean?.() || await (Task as any).find({ projectId });
    } else if ((Task as any).findByProjectId) {
      tasks = await (Task as any).findByProjectId(projectId);
    } else {
      tasks = [];
    }

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (err: any) {
    /* eslint-disable no-console */
    console.error('Get tasks error:', err);
    /* eslint-enable no-console */
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
