import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import ProjectsClient from './client';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

interface ProjectData {
  _id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  creator: string;
  collaborators: string[];
  priority?: string;
  startDate?: string;
  endDate?: string;
  updatedAt: string;
}

export default async function ProjectsPage() {
  let projects: ProjectData[] = [];
  let userId: string | null = null;

  try {
    // === Extract and verify token ===
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    if (!token) {
      redirect('/auth/signin');
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;

      // === Connect to database ===
      await connectDB();

      // Fetch only projects where user is creator or collaborator
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dbProjects = await (Project as any).find({
        $or: [
          { creator: userId },
          { creator: decoded.email }, // Also check by email
          { collaborators: { $in: [userId, decoded.email] } },
        ],
      }).lean();

      projects = dbProjects.map((p: any) => ({
        _id: p._id?.toString() || p.id,
        name: p.name || 'Untitled',
        description: p.description || '',
        status: p.status || 'active',
        creator: p.creator,
        collaborators: p.collaborators || [],
        priority: p.priority || 'medium',
        startDate: p.startDate,
        endDate: p.endDate,
        updatedAt: p.updatedAt || new Date().toISOString(),
      }));
    } catch (err) {
      // Token verification failed
      redirect('/auth/signin');
    }
  } catch (err) {
    // Database connection or other errors
    /* eslint-disable no-console */
    console.error('Projects page error:', err);
    /* eslint-enable no-console */
  }

  return <ProjectsClient initialProjects={projects} />;
}
