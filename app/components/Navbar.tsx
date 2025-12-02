'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="collab-font text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Collab Deck
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/auth/signin"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm font-medium text-white bg-emerald-600 px-4 py-2 rounded-md hover:bg-emerald-500 transition"
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
}
