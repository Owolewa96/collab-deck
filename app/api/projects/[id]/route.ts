import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import User from '@/models/User';

const JWT_SECRET =
  process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ params is async now
    const { id } = await context.params;

    const token = req.cookies.get('authToken')?.value;
    let userId: string | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        userId = decoded.id;
      } catch (err) {
        console.error('Token verify failed', err);
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isCreator = project.creator.toString() === userId;
    const isCollaborator = project.collaborators.some((c: any) =>
      typeof c === 'string' ? c.toLowerCase() === userId : c.toString() === userId
    );

    if (!isCreator && !isCollaborator) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const collaborators = [];

    for (const c of project.collaborators) {
      const user =
        typeof c === 'string' && c.includes('@')
          ? await User?.findOne({ email: c.toLowerCase() })
          : await User?.findById(c);

      if (user) {
        collaborators.push({
          _id: user._id,
          name: user.name,
          email: user.email,
        });
      }
    }

    const projectData = { ...project.toObject(), ...collaborators };

    return NextResponse.json({ project: projectData }, { status: 200 });
  } catch (err) {
    console.error('Get project error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
