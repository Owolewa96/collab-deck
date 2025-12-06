import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Notification from '@/models/Notification';

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

    // Fetch notifications for the user (by id or email)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const notifs = await (Notification as any).find({
      $or: [{ user: decoded.id }, { user: decoded.email }],
    }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ notifications: notifs }, { status: 200 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Get notifications error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { user, type, title, description, projectId, taskId, actionUrl, meta } = body;

    await connectDB();

    const notif = await (Notification as any).create({
      user,
      type,
      title,
      description,
      read: false,
      createdBy: decoded.id,
      projectId,
      taskId,
      actionUrl,
      meta,
    });

    return NextResponse.json({ notification: notif }, { status: 201 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Create notification error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
