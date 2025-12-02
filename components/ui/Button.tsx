/**
 * Button Component
 * Reusable button UI atom
 */

import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-md transition focus:outline-none focus:ring-2';
  
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-500',
    secondary: 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white',
    outline: 'border border-zinc-300 text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:text-white',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
