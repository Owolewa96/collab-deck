/**
 * POST /api/projects
 *
 * Create a new project in MongoDB using the Project model.
 * Also initializes a ProjectUser document for the creator with default preferences.
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
// @ts-ignore
import Project from '@/models/Project';
// @ts-ignore
import ProjectUser from '@/models/ProjectUser';
import { notifyMultiple } from '@/lib/notify';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

export async function POST(req: NextRequest) {
  try {
    // === Extract and verify token to get user ID ===
    const token = req.cookies.get('authToken')?.value;
    let userId = null;
    let userEmail = null;
    
    if (token) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
        userEmail = decoded.email;
        /* eslint-disable no-console */
        console.log('Token decoded:', { userId, userEmail });
        /* eslint-enable no-console */
      } catch (err) {
        // Token verification failed
        /* eslint-disable no-console */
        console.error('Token verification failed:', err);
        /* eslint-enable no-console */
      }
    } else {
      /* eslint-disable no-console */
      console.warn('No authToken cookie found');
      /* eslint-enable no-console */
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: No valid token' }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { name, priority, startDate, endDate, collaborators, description } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Project name is required.' }, { status: 400 });
    }

    const projectData = {
      name: name.trim(),
      description: description || '',
      status: 'active',
      creator: userId,
      collaborators: collaborators || [],
      priority: priority || 'medium',
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const created = await (Project as any).create(projectData);

    // === Create ProjectUser document for creator ===
    if (userId) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (ProjectUser as any).findOneAndUpdate(
          { user: userId, project: created._id },
          {
            user: userId,
            project: created._id,
            isPinned: false,
            isArchived: false,
            isFavorite: false,
            isContributing: true,
            recentlyViewed: true,
            viewedAt: new Date(),
          },
          { upsert: true, new: true }
        );
      } catch (err) {
        // Log but don't fail if ProjectUser creation fails
        /* eslint-disable no-console */
        console.warn('Failed to create ProjectUser preference:', err);
        /* eslint-enable no-console */
      }
    }

    // Notify collaborators (excluding the creator) that they've been added to a project
    try {
      const recipients = Array.isArray(created.collaborators) ? created.collaborators : [];
      const filtered = recipients.filter((r: any) => String(r) !== String(userId) && String(r) !== String(userEmail));
      if (filtered.length > 0) {
        await notifyMultiple(filtered, {
          type: 'invite',
          title: `Added to project: ${created.name}`,
          description: `${created.name} — you were added as a collaborator`,
          createdBy: userId,
          projectId: created._id,
          actionUrl: `/projects/${created._id}`,
        });
      }
    } catch (err) {
      console.error('project collaborator notification error:', err);
    }

    return NextResponse.json({ message: 'Project created', project: created }, { status: 201 });
  } catch (err: any) {
    /* eslint-disable no-console */
    console.error('Create project error:', err);
    /* eslint-enable no-console */
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
