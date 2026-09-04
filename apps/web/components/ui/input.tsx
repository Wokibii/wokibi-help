'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-xs font-medium uppercase tracking-wider text-wokibi-muted',
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-11 w-full rounded-xl border border-wokibi-border bg-wokibi-bg px-3 py-2',
      'text-sm text-white placeholder:text-wokibi-muted',
      'focus:outline-none focus:ring-2 focus:ring-wokibi-purple/50',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[120px] w-full rounded-xl border border-wokibi-border bg-wokibi-bg px-3 py-2',
      'text-sm text-white placeholder:text-wokibi-muted resize-none',
      'focus:outline-none focus:ring-2 focus:ring-wokibi-purple/50',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
