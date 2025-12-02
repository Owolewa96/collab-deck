'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

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

  const [tasks] = useState<Task[]>([
    {
      id: 't1',
      title: 'Fix login form validation',
      projectId: '1',
      projectName: 'Website Redesign',
      status: 'in-progress',
      priority: 'high',
      assignees: ['you@example.com', 'john@example.com'],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdBy: 'you@example.com',
      createdAt: new Date().toISOString().split('T')[0],
    },
    {
      id: 't2',
      title: 'Update API documentation',
      projectId: '3',
      projectName: 'Backend API Enhancement',
      status: 'todo',
      priority: 'medium',
      assignees: ['sarah@example.com'],
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdBy: 'john@example.com',
      createdAt: new Date().toISOString().split('T')[0],
    },
    {
      id: 't3',
      title: 'Design dashboard layout',
      projectId: '2',
      projectName: 'Mobile App Development',
      status: 'done',
      priority: 'low',
      assignees: ['you@example.com'],
      createdBy: 'jane@example.com',
      createdAt: new Date().toISOString().split('T')[0],
    },
    {
      id: 't4',
      title: 'Review code submission',
      projectId: '5',
      projectName: 'Security Audit',
      status: 'todo',
      priority: 'critical',
      assignees: ['john@example.com', 'you@example.com'],
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdBy: 'sarah@example.com',
      createdAt: new Date().toISOString().split('T')[0],
    },
  ]);

  const currentUser = 'you@example.com';

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
  }, [filter, tasks]);

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
        {filtered.map((task) => (
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
