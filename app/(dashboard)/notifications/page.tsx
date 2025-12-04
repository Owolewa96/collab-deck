'use client';

import Link from 'next/link';
import { useState } from 'react';

interface NotificationItem {
  id: string;
  type: 'deadline' | 'mention' | 'assignment' | 'update' | 'system';
  title: string;
  description: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

const NotificationComponent = ({ notification }: { notification: NotificationItem }) => {
  const typeIcons: Record<string, string> = {
    deadline: '⏰',
    mention: '👤',
    assignment: '📋',
    update: '🔔',
    system: '⚙️',
  };
  const typeColors: Record<string, string> = {
    deadline: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20',
    mention: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
    assignment: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20',
    update: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20',
    system: 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50',
  };

  return (
    <div className={`border rounded-lg p-4 ${typeColors[notification.type]} ${!notification.read ? 'font-medium' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-xl">{typeIcons[notification.type]}</span>
          <div className="flex-1">
            <h4 className="text-sm text-zinc-900 dark:text-white">{notification.title}</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{notification.description}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">{notification.timestamp}</p>
          </div>
        </div>
        {!notification.read && <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1 shrink-0"></div>}
      </div>
    </div>
  );
};

export default function NotificationsPage() {
  const [notificationItems] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'deadline',
      title: 'Website Redesign due in 5 days',
      description: 'Complete remaining tasks to meet deadline',
      read: false,
      timestamp: '1 hour ago',
    },
    {
      id: '2',
      type: 'mention',
      title: 'You were mentioned by John Doe',
      description: 'In Backend API Enhancement task comments',
      read: false,
      timestamp: '3 hours ago',
    },
    {
      id: '3',
      type: 'assignment',
      title: 'New task assigned: "Code Review"',
      description: 'In Security Audit project',
      read: false,
      timestamp: '1 day ago',
    },
    {
      id: '4',
      type: 'update',
      title: 'Project update: Database Migration',
      description: 'Jane Smith marked project as completed',
      read: true,
      timestamp: '2 days ago',
    },
  ]);

  const unreadNotifications = notificationItems.filter((n) => !n.read);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">All your notifications and alerts</p>
        </div>
        <Link href="/dashboard" className="text-sm text-emerald-600 hover:underline">Back to dashboard</Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-zinc-700 dark:text-zinc-300">Unread</div>
        <div className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full">{unreadNotifications.length}</div>
      </div>

      <div className="space-y-3">
        {notificationItems.map((n) => (
          <NotificationComponent key={n.id} notification={n} />
        ))}
      </div>
    </div>
  );
}
