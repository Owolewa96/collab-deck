/**
 * POST /api/auth/signin
 *
 * Handles user login by:
 * 1. Validating input (email, password)
 * 2. Finding user by email
 * 3. Comparing password with bcryptjs
 * 4. Generating JWT token
 * 5. Returning token or error
 */

import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

export async function POST(req: NextRequest) {
  try {
    // === Connect to database ===
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    // === Validation ===
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // === Find user by email ===
    const user = await User.findByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // === Compare password ===
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // === Generate JWT token ===
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // === Return token and user data ===
    const response = NextResponse.json(
      {
        message: 'Sign in successful.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // === Set token in httpOnly cookie ===
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    /* eslint-disable no-console */
    console.error('Signin error:', error);
    /* eslint-enable no-console */

    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
