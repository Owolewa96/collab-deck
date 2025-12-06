import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Task from '@/models/Task';
import Project from '@/models/Project';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('authToken')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectDB();

    // Fetch projects for user to include tasks in user's projects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projects: any[] = await (Project as any).find({
      $or: [{ creator: decoded.id }, { collaborators: { $in: [decoded.id, decoded.email] } }],
    }).lean();

    const projectIds = projects.map((p) => p._id?.toString()).filter(Boolean);

    // Fetch tasks assigned to user OR tasks in user's projects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tasks: any[] = await (Task as any).find({
      $or: [
        { assignees: { $in: [decoded.id, decoded.email] } },
        { projectId: { $in: projectIds } },
      ],
    }).lean();

    // Build collaborators list from projects
    const collaboratorsSet = new Set<string>();
    for (const p of projects) {
      if (Array.isArray(p.collaborators)) {
        for (const c of p.collaborators) {
          if (c) collaboratorsSet.add(String(c));
        }
      }
    }

    const collaborators = Array.from(collaboratorsSet);

    return NextResponse.json({ tasks, collaborators, currentUser: decoded.email || decoded.id }, { status: 200 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Get user tasks error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
