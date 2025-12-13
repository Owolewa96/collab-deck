'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  creator: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  collaborators: User[];
  // User preferences (from ProjectUser model)
  isPinned?: boolean;
  isArchived?: boolean;
  isFavorite?: boolean;
  isContributing?: boolean;
  recentlyViewed?: boolean;
  viewedAt?: string;
  // Computed fields
  taskCount?: number;
  teamMembers?: number;
  daysUntilDeadline?: number;
  updatedAt: string;
}

interface Task {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  status: 'todo' | 'in-progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignees: string[];
  dueDate?: string;
  createdBy: string;
  createdAt: string;
}

export default function TasksPage() {
  const [filter, setFilter] = useState<'all' | 'assigned' | 'created' | 'overdue'>('all');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [collaborators, setCollaborators] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Fetch tasks
        const tasksRes = await fetch('/api/user/tasks', { credentials: 'include' });
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          if (mounted) {
            const serverTasks = Array.isArray(tasksData.tasks)
              ? tasksData.tasks.map((t: any) => ({
                  id: t._id || t.id,
                  title: t.title,
                  projectId: t.projectId,
                  projectName: t.projectName || t.project?.name || 'Project',
                  status: t.status || 'todo',
                  priority: t.priority || 'medium',
                  assignees: Array.isArray(t.assignees) ? t.assignees.map(String) : [],
                  dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : undefined,
                  createdBy: t.createdBy || t.creator || '',
                  createdAt: t.createdAt,
                }))
              : [];
            setTasks(serverTasks);
            if (tasksData.currentUser) setCurrentUser(tasksData.currentUser);
            if (Array.isArray(tasksData.collaborators)) setCollaborators(tasksData.collaborators.map(String));
          }
        }
      } catch (err) {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Quick workflow summary (moved from Dashboard Tasks & Workflow)
  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const overdueCount = tasks.filter((t) => t.dueDate && t.dueDate < new Date().toISOString().split('T')[0]).length;

  const filtered = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    switch (filter) {
      case 'assigned':
        return tasks.filter((t) => t.assignees.includes(currentUser));
      case 'created':
        return tasks.filter((t) => t.createdBy === currentUser);
      case 'overdue':
        return tasks.filter((t) => t.dueDate && t.dueDate < today);
      default:
        return tasks.filter((t) => t.assignees.includes(currentUser) || t.createdBy === currentUser);
    }
  }, [filter, tasks, currentUser]);

  const PriorityBadge = ({ p }: { p: Task['priority'] }) => {
    const classes: Record<Task['priority'], string> = {
      low: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
      high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
      critical: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
    };
    return <span className={`px-2 py-1 rounded text-xs font-semibold ${classes[p]}`}>{p}</span>;
  };

  const StatusPill = ({ s }: { s: Task['status'] }) => {
    const map: Record<Task['status'], string> = {
      'todo': 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
      'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
      'done': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200',
      'blocked': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
    };
    const label = s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1);
    return <span className={`px-2 py-1 rounded text-xs font-medium ${map[s]}`}>{label}</span>;
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <Link href={`/projects/${task.projectId}`} className="text-xs text-zinc-500 dark:text-zinc-400">{task.projectName}</Link>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mt-1">{task.title}</h3>
          <div className="flex items-center gap-2 mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1">Assigned: {task.assignees.join(', ')}</div>
            {task.dueDate && <div>• Due {task.dueDate}</div>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <PriorityBadge p={task.priority} />
          <StatusPill s={task.status} />
          <Link href={`/projects/${task.projectId}/tasks/${task.id}`} className="text-xs text-blue-600 dark:text-blue-400">Open</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Tasks & Workflow summary (migrated from Dashboard) */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">📋 Tasks & Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">To Do</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{todoCount}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{inProgressCount}</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">Done</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{doneCount}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm font-medium text-red-900 dark:text-red-200">Overdue</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">{overdueCount}</p>
          </div>
        </div>
      </section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Tasks</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">All tasks you are involved in (assigned or created)</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="px-3 py-2 border rounded-lg bg-white dark:bg-zinc-900">
            <option value="all">All Involved</option>
            <option value="assigned">Assigned To Me</option>
            <option value="created">Created By Me</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-600 dark:text-zinc-400">No tasks found for this filter.</p>
        </div>
      )}
    </div>
  );
}
