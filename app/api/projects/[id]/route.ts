import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
// @ts-ignore
import Project from '@/models/Project';
// @ts-ignore
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('authToken')?.value;
    let userId = null;

    if (token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        console.error('Token verify failed', err);
      }
    }

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const project = await (Project as any).findById(params.id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if user is authorized (creator or collaborator)
    const isCreator = project.creator.toString() === userId;
    const isCollaborator = project.collaborators.some((c: any) => {
      if (typeof c === 'string') return c === userId || c.toLowerCase() === userId; // if email or id
      return c.toString() === userId;
    });

    if (!isCreator && !isCollaborator) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Resolve collaborators
    const collaborators = [];
    for (const c of project.collaborators) {
      if (typeof c === 'string' && c.includes('@')) {
        // email
        const user = await (User as any).findOne({ email: c.toLowerCase() });
        if (user) {
          collaborators.push({ _id: user._id, name: user.name, email: user.email });
        }
      } else {
        // ObjectId
        const user = await (User as any).findById(c);
        if (user) {
          collaborators.push({ _id: user._id, name: user.name, email: user.email });
        }
      }
    }

    const projectData = { ...project.toObject(), collaborators };

    return NextResponse.json({ project: projectData }, { status: 200 });
  } catch (err) {
    console.error('Get project error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}