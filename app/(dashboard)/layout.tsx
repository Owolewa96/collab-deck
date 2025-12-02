'use client';

import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Collab Deck
          </h2>
        </div>

        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="block px-4 py-2 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/projects"
            className="block px-4 py-2 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Projects
          </Link>
          <Link
            href="/tasks"
            className="block px-4 py-2 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Tasks
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Settings
          </Link>
        </nav>

        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700">
          <button className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
