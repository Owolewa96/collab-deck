/**
 * Card Component
 * Reusable card container UI atom
 */

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800 p-4 ${className}`}
    >
      {children}
    </div>
  );
}
