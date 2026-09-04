'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const variants = {
  default: 'bg-wokibi-purple hover:bg-wokibi-purple-light text-white',
  outline: 'border border-wokibi-border bg-transparent hover:bg-wokibi-card text-white',
  ghost: 'bg-transparent hover:bg-wokibi-card text-wokibi-muted hover:text-white',
  success: 'border border-wokibi-done/50 text-wokibi-done hover:bg-wokibi-done/10',
  danger: 'text-red-400 hover:bg-red-400/10',
};

const sizes = {
  default: 'h-10 px-4 py-2 rounded-xl text-sm font-medium',
  sm: 'h-8 px-3 rounded-lg text-xs font-medium',
  lg: 'h-12 px-6 rounded-xl text-base font-medium',
  icon: 'h-10 w-10 rounded-xl flex items-center justify-center',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
