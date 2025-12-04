/**
 * GET /api/auth/me
 *
 * Returns the current authenticated user's profile by:
 * 1. Reading the authToken cookie
 * 2. Verifying the JWT token
 * 3. Fetching the user from the database
 * 4. Returning user profile (id, name, email, role)
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

export async function GET(req: NextRequest) {
  try {
    // === Extract token from cookie ===
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found.' },
        { status: 401 }
      );
    }

    // === Verify and decode token ===
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid or expired token.' },
        { status: 401 }
      );
    }

    // === Connect to database ===
    await connectDB();

    // === Fetch user from database ===
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await (User as any).findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    // === Return user profile ===
    const userProfile = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || null,
    };

    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    /* eslint-disable no-console */
    console.error('Auth/me error:', error);
    /* eslint-enable no-console */

    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
