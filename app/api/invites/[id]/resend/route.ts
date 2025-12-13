import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
// @ts-ignore
import Project from '@/models/Project';
// @ts-ignore
import Invite from '@/models/Invite';
import sendEmail from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const invite = await (Invite as any).findById(id);
    if (!invite) return NextResponse.json({ error: 'Invite not found' }, { status: 404 });

    // Only inviter can resend
    if (String(invite.inviter) !== String(userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (invite.accepted) {
      return NextResponse.json({ error: 'Invite already accepted' }, { status: 400 });
    }

    const project = await (Project as any).findById(invite.projectId);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    // send email again
    try {
      const appUrl = getAppUrl();
      const acceptUrl = `${appUrl}/invite/accept?token=${invite.token}`;
      const html = `<p>${invite.message || 'You have been invited to collaborate on a project.'}</p><p><a href="${acceptUrl}">Accept Invitation</a></p>`;
      await sendEmail({ to: invite.email, subject: `Invitation to join project ${project.name}`, html });
    } catch (err) {
      console.error('resend invite email error', err);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Invite resent' }, { status: 200 });
  } catch (err) {
    console.error('Resend invite error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}