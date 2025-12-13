import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import DashboardClient from './dashboard/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

export default async function DashboardPage() {
  // Check authentication
  const cookies = await (await import('next/headers')).cookies();
  const token = cookies.get('authToken')?.value;
  if (!token) {
    redirect('/auth/signup');
  }

  let userName: string;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { name: string };
    userName = decoded.name;
  } catch (err) {
    redirect('/auth/signup');
  }

  // Fetch initial projects (placeholder, can be expanded)
  const initialProjects: any[] = [];

  return <DashboardClient userName={userName} initialProjects={initialProjects} />;
}
