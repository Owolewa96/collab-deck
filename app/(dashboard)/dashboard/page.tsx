import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import ProjectUser from '@/models/ProjectUser';
import DashboardClient from './client';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

interface ProjectData {
  _id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  creator: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  isFavorite?: boolean;
  isContributing?: boolean;
  recentlyViewed?: boolean;
  viewedAt?: string;
  updatedAt: string;
}

export default async function DashboardPage() {
  let userName = 'User';
  let projects: ProjectData[] = [];

  try {
    // === Extract and verify token ===
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    if (token) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, JWT_SECRET);
        userName = decoded.name || 'User';

        // === Connect to database and fetch projects ===
        await connectDB();

        // Fetch projects where user is creator or collaborator
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dbProjects = await (Project as any).find({
          $or: [
            { creator: decoded.id },
            { collaborators: { $in: [decoded.id, decoded.email] } },
          ],
        }).lean();

        // Fetch user preferences for all projects
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const projectUserPrefs = await (ProjectUser as any).find({
          user: decoded.id,
          project: { $in: dbProjects.map((p: any) => p._id) },
        }).lean();

        // Create a map of project ID to user preferences
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const prefsMap = new Map(
          projectUserPrefs.map((pup: any) => [pup.project.toString(), pup])
        );

        projects = dbProjects.map((p: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const prefs: any = prefsMap.get(p._id.toString()) || {};
          return {
            _id: p._id?.toString() || p.id,
            name: p.name || 'Untitled',
            description: p.description || '',
            status: p.status || 'active',
            creator: p.creator,
            priority: p.priority || 'medium',
            startDate: p.startDate,
            endDate: p.endDate,
            isPinned: prefs.isPinned || false,
            isArchived: prefs.isArchived || false,
            isFavorite: prefs.isFavorite || false,
            isContributing: prefs.isContributing || false,
            recentlyViewed: prefs.recentlyViewed || false,
            viewedAt: prefs.viewedAt,
            updatedAt: p.updatedAt || new Date().toISOString(),
          };
        });
      } catch (err) {
        // Token verification failed, continue with defaults
        // console.error('Token verification error:', err);
      }
    }
  } catch (err) {
    // Database connection or other errors, continue with defaults
    // console.error('Dashboard fetch error:', err);
  }

  return <DashboardClient userName={userName} initialProjects={projects} />;
}
