/**
 * POST /api/projects
 *
 * Create a new project in MongoDB using the Project model.
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, priority, startDate, endDate, collaborators, description, creator } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Project name is required.' }, { status: 400 });
    }

    const projectData = {
      name: name.trim(),
      description,
      status: 'active',
      creator,
      collaborators,
      priority,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    };

    const created = await Project.create(projectData);

    return NextResponse.json({ message: 'Project created', project: created }, { status: 201 });
  } catch (err: any) {
    /* eslint-disable no-console */
    console.error('Create project error:', err);
    /* eslint-enable no-console */
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
