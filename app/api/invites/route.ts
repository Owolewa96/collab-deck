import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
// @ts-ignore
import Project from '@/models/Project';
// @ts-ignore
import Invite from '@/models/Invite';
import { createNotification } from '@/lib/notify';
import sendEmail from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';
}

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
        console.error('Token verify failed', err);
      }
    }

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const body = await req.json();
    const { projectId, email, message } = body;

    if (!projectId || !email) return NextResponse.json({ error: 'projectId and email required' }, { status: 400 });

    const project = await (Project as any).findById(projectId);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const isCreator = String(project.creator) === String(userId) || String(project.creator) === String(userEmail);
    const isCollaborator = Array.isArray(project.collaborators) && (project.collaborators.includes(userId) || project.collaborators.includes(userEmail));
    if (!isCreator && !isCollaborator) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // create invite token
    const inviteToken = (globalThis as any).crypto?.randomUUID?.() || require('crypto').randomUUID();

    const invite = await (Invite as any).create({
      token: inviteToken,
      projectId: project._id,
      email,
      inviter: userId,
      message: message || '',
      accepted: false,
    });

    // send email if configured (SendGrid preferred; SMTP fallback)
    try {
      const appUrl = getAppUrl();
      const acceptUrl = `${appUrl}/invite/accept?token=${inviteToken}`;
      const html = `<p>${message || 'You have been invited to collaborate on a project.'}</p><p><a href="${acceptUrl}">Accept Invitation</a></p>`;
      await sendEmail({ to: email, subject: `Invitation to join project ${project.name}`, html });
    } catch (err) {
      console.error('invite email send error', err);
    }

    // create a persistent notification for the invitee (by email)
    try {
      await createNotification({
        user: email,
        type: 'invite',
        title: `Invitation: ${project.name}`,
        description: message || `You were invited to ${project.name}`,
        createdBy: userId,
        projectId: project._id,
        actionUrl: `${getAppUrl()}/invite/accept?token=${inviteToken}`,
      });
    } catch (err) {
      console.error('create invite notification error', err);
    }

    return NextResponse.json({ message: 'Invite created', invite }, { status: 201 });
  } catch (err) {
    console.error('Create invite error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // allow listing invites for the current user (inviter)
    const token = req.cookies.get('authToken')?.value;
    let userId: string | null = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        userId = decoded.id;
      } catch (err) {
        // ignore
      }
    }

    await connectDB();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const invites = await (Invite as any).find({ inviter: userId }).lean();
    return NextResponse.json({ invites }, { status: 200 });
  } catch (err) {
    console.error('List invites error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
