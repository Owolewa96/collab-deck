import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Notification from '@/models/Notification';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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
    const { read } = body;

    await connectDB();

    // Only allow marking as read/unread for recipient
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const notif: any = await (Notification as any).findById(id);
    if (!notif) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (String(notif.user) !== String(decoded.id) && String(notif.user) !== String(decoded.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    notif.read = !!read;
    const updated = await notif.save();

    return NextResponse.json({ notification: updated }, { status: 200 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Update notification error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const notif: any = await (Notification as any).findById(id);
    if (!notif) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (String(notif.user) !== String(decoded.id) && String(notif.user) !== String(decoded.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await (Notification as any).deleteOne({ _id: id });

    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Delete notification error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
