/**
 * Board Component
 * Displays a kanban/scrum board with columns and tasks
 */

'use client';

interface Column {
  _id: string;
  name: string;
}

interface Task {
  _id: string;
  columnId: string;
  title: string;
  priority?: 'low' | 'medium' | 'high';
}

interface BoardProps {
  projectId: string;
  tasks?: Task[];
  columns?: Column[];
}

export default function Board({ projectId, tasks = [], columns = [] }: BoardProps) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column._id}
          className="shrink-0 w-80 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4"
        >
          <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
            {column.name}
          </h3>
          <div className="space-y-3">
            {tasks
              .filter((task) => task.columnId === column._id)
              .map((task) => (
                <div
                  key={task._id}
                  className="bg-white dark:bg-zinc-900 rounded-md p-3 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition cursor-pointer"
                >
                  <h4 className="font-medium text-zinc-900 dark:text-white text-sm">
                    {task.title}
                  </h4>
                  {task.priority && (
                    <div className="mt-2 inline-block">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
