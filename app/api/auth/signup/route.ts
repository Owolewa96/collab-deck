/**
 * POST /api/auth/signup
 *
 * Handles user registration by:
 * 1. Validating input (name, email, password)
 * 2. Checking if email already exists
 * 3. Hashing password with bcryptjs
 * 4. Saving user to MongoDB
 * 5. Returning user data or error
 */

import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    // === Connect to database ===
    await connectDB();

    const body = await req.json();
    const { name, email, password, passwordConfirm } = body;

    // === Validation ===
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (password !== passwordConfirm) {
      return NextResponse.json(
        { error: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    // === Check if user already exists ===
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered.' },
        { status: 409 }
      );
    }

    // === Hash password ===
    const hashedPassword = await bcryptjs.hash(password, 10);

    // === Create user ===
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    });

    // === Return success (exclude password) ===
    return NextResponse.json(
      {
        message: 'User created successfully.',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    /* eslint-disable no-console */
    console.error('Signup error:', error);
    /* eslint-enable no-console */

    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
