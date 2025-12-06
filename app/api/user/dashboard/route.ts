import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Task from '@/models/Task';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // verify token
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectDB();

    // Fetch projects where user is creator or collaborator
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbProjects: any[] = await (Project as any).find({
      $or: [
        { creator: decoded.id },
        { collaborators: { $in: [decoded.id, decoded.email] } },
      ],
    }).lean();

    // Prepare recent projects (created within last 7 days)
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const recentProjects = dbProjects
      .filter((p) => {
        const created = p.createdAt ? new Date(p.createdAt).getTime() : null;
        return created && now - created <= sevenDaysMs;
      })
      .map((p) => ({
        _id: p._id?.toString(),
        name: p.name,
        description: p.description || '',
        creator: p.creator,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));

    // Fetch tasks related to the user: either assigned to them or belonging to their projects
    const projectIds = dbProjects.map((p) => p._id?.toString());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tasks: any[] = await (Task as any).find({
      $or: [
        { assignees: { $in: [decoded.id, decoded.email] } },
        { projectId: { $in: projectIds } },
      ],
    }).lean();

    const completedTasks = tasks.filter((t) => t.status === 'done');

    // Build collaborators list (unique)
    const collaboratorsSet = new Set<string>();
    for (const p of dbProjects) {
      if (Array.isArray(p.collaborators)) {
        for (const c of p.collaborators) {
          if (c) collaboratorsSet.add(String(c));
        }
      }
    }

    const collaborators = Array.from(collaboratorsSet);

    // Format and return payload
    const formattedProjects = dbProjects.map((p) => ({
      _id: p._id?.toString(),
      name: p.name,
      description: p.description || '',
      status: p.status || 'active',
      creator: p.creator,
      priority: p.priority || 'medium',
      startDate: p.startDate || null,
      endDate: p.endDate || null,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json(
      {
        projects: formattedProjects,
        recentProjects,
        tasks,
        completedTasks,
        collaborators,
      },
      { status: 200 }
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Dashboard overview error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
