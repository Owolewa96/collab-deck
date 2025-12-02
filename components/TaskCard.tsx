/**
 * TaskCard Component
 * Individual task card display
 */

'use client';

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  status?: string;
  onClick?: () => void;
}

export default function TaskCard({
  id,
  title,
  description,
  priority = 'medium',
  assignee,
  dueDate,
  status,
  onClick,
}: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-zinc-900 rounded-md p-3 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition cursor-pointer"
    >
      <h4 className="font-medium text-zinc-900 dark:text-white text-sm">
        {title}
      </h4>
      {description && (
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
          {description}
        </p>
      )}
      <div className="mt-2 flex items-center justify-between gap-2">
        <span
          className={`text-xs px-2 py-1 rounded ${
            priority === 'high'
              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
              : priority === 'medium'
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
          }`}
        >
          {priority}
        </span>
        {dueDate && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {new Date(dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
