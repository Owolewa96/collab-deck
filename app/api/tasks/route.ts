import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Project, { IProject } from '@/models/Project';
import Task, { ITask } from '@/models/Task';
import { notifyMultiple } from '@/lib/notify';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('authToken')?.value;
    let userId: string | null = null;
    let userEmail: string | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
        userId = decoded.id;
        userEmail = decoded.email;
      } catch (err) {
        console.error('Token verification failed:', err);
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { projectId, title, description, dueDate, assignees } = body;

    if (!projectId || !title?.trim()) {
      return NextResponse.json({ error: 'projectId and title are required' }, { status: 400 });
    }

    // Check project
    const project = await Project.findById(projectId) as IProject | null;
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isCreator =
      String(project.creator) === userId ||
      String(project.creator) === userEmail;

    const isCollaborator =
      Array.isArray(project.collaborators) &&
      (project.collaborators.includes(userId) ||
       project.collaborators.includes(userEmail));

    if (!isCreator && !isCollaborator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const taskData: Partial<ITask> = {
      projectId,
      title: title.trim(),
      description: description ?? '',
      assignees: assignees ?? [],
      dueDate: dueDate ? new Date(dueDate) : null,
      status: 'todo',
    };

    const created = await Task.create(taskData);

    // create notifications for assignees or project collaborators
    try {
      const recipients = Array.isArray(created.assignees) && created.assignees.length > 0
        ? created.assignees
        : (Array.isArray(project.collaborators) ? project.collaborators : []);

      // filter out the actor
      const filtered = recipients.filter((r: any) => String(r) !== String(userId) && String(r) !== String(userEmail));

      if (filtered.length > 0) {
        await notifyMultiple(filtered, {
          type: 'assignment',
          title: `Assigned: ${created.title}`,
          description: `You were assigned to "${created.title}" in ${project.name || 'a project'}`,
          createdBy: userId,
          projectId: project._id,
          taskId: created._id,
          actionUrl: `/projects/${project._id}/tasks/${created._id}`,
        });
      }
    } catch (err) {
      console.error('task notification error:', err);
    }

    return NextResponse.json(
      { message: 'Task created', task: created },
      { status: 201 }
    );
  } catch (err) {
    console.error('Create task error:', err);
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

    const tasks = await Task.find({ projectId }).lean<ITask[]>();

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (err) {
    console.error('Get tasks error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
