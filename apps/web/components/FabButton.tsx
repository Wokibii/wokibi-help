'use client';

import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FabButtonProps {
  onClick: () => void;
  className?: string;
}

export function FabButton({ onClick, className }: FabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center',
        'rounded-full bg-wokibi-purple text-white shadow-lg shadow-wokibi-purple/30',
        'hover:bg-wokibi-purple-light transition-all hover:scale-105',
        className
      )}
      aria-label="Nova solicitação"
    >
      <Plus className="h-6 w-6" />
    </button>
  );
}
