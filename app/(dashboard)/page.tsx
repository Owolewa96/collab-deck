'use client';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
        Dashboard
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        Welcome to your Collab Deck workspace. Manage your projects and collaborate with your team.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats cards */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800 p-6">
          <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Total Projects
          </h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">
            0
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800 p-6">
          <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Active Tasks
          </h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">
            0
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800 p-6">
          <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Team Members
          </h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">
            0
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
          Recent Projects
        </h2>
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800 p-6">
          <p className="text-zinc-500 dark:text-zinc-400 text-center py-8">
            No projects yet. Create one to get started!
          </p>
        </div>
      </div>
    </div>
  );
}
