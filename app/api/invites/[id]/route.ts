import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
// @ts-ignore
import Invite from '@/models/Invite';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

export async function DELETE(
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

    // Only inviter can cancel
    if (String(invite.inviter) !== String(userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await (Invite as any).findByIdAndDelete(id);

    return NextResponse.json({ message: 'Invite cancelled' }, { status: 200 });
  } catch (err) {
    console.error('Delete invite error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
