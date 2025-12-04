/**
 * GET /api/user/projects
 *
 * Fetches all projects for the current authenticated user:
 * 1. Reads authToken cookie and verifies JWT
 * 2. Fetches projects where user is creator or in collaborators
 * 3. Returns project list for dashboard/pages
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Project from '@/models/Project';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

export async function GET(req: NextRequest) {
  try {
    // === Extract and verify token ===
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found.' },
        { status: 401 }
      );
    }

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

    // === Fetch projects where user is creator or collaborator ===
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projects = await (Project as any).find({
      $or: [
        { creator: decoded.id },
        { collaborators: { $in: [decoded.id, decoded.email] } },
      ],
    }).lean();

    // === Format and return projects ===
    const formattedProjects = projects.map((project: any) => ({
      _id: project._id?.toString() || project.id,
      name: project.name || 'Untitled',
      description: project.description || '',
      status: project.status || 'active',
      creator: project.creator,
      priority: project.priority || 'medium',
      startDate: project.startDate,
      endDate: project.endDate,
      updatedAt: project.updatedAt,
      requiresAction: false,
    }));

    return NextResponse.json(formattedProjects, { status: 200 });
  } catch (error) {
    /* eslint-disable no-console */
    console.error('User projects fetch error:', error);
    /* eslint-enable no-console */

    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
