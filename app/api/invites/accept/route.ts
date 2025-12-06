import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
// @ts-ignore
import Invite from '@/models/Invite';
// @ts-ignore
import Project from '@/models/Project';
import { createNotification } from '@/lib/notify';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { token } = body;
    if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 });

    // require user to be authenticated to accept
    const authToken = req.cookies.get('authToken')?.value;
    if (!authToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let userId: string | null = null;
    let userEmail: string | null = null;
    try {
      const decoded = jwt.verify(authToken, JWT_SECRET) as { id: string; email: string };
      userId = decoded.id;
      userEmail = decoded.email;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const invite = await (Invite as any).findOne({ token });
    if (!invite) return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    if (invite.accepted) return NextResponse.json({ error: 'Invite already accepted' }, { status: 400 });

    // ensure invite email matches authenticated user email
    if (String(invite.email).toLowerCase() !== String(userEmail).toLowerCase()) {
      return NextResponse.json({ error: 'Invite email does not match authenticated user' }, { status: 403 });
    }

    const project = await (Project as any).findById(invite.projectId);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    // add to project's collaborators if not already present
    const collabs = Array.isArray(project.collaborators) ? project.collaborators.map(String) : [];
    if (!collabs.includes(String(userEmail)) && !collabs.includes(String(userId))) {
      project.collaborators = project.collaborators || [];
      project.collaborators.push(userEmail);
      await project.save();
    }

    invite.accepted = true;
    invite.acceptedBy = userId;
    invite.acceptedAt = new Date();
    await invite.save();

    // notify project creator that user accepted
    try {
      await createNotification({
        user: project.creator,
        type: 'update',
        title: `${userEmail} joined ${project.name}`,
        description: `${userEmail} accepted the invitation and joined the project`,
        createdBy: userId,
        projectId: project._id,
        actionUrl: `/projects/${project._id}`,
      });
    } catch (err) {
      console.error('notify project creator error', err);
    }

    return NextResponse.json({ message: 'Invite accepted', project }, { status: 200 });
  } catch (err) {
    console.error('Accept invite error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
