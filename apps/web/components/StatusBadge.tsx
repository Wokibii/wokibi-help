'use client';

import { cn } from '@/lib/utils';
import type { Status } from '@/types/solicitacao';

const config: Record<Status, { label: string; dot: string; bg: string }> = {
  pendente: {
    label: 'Pendente',
    dot: 'bg-wokibi-pending',
    bg: 'bg-wokibi-pending/15 text-wokibi-pending border-wokibi-pending/30',
  },
  em_andamento: {
    label: 'Em andamento',
    dot: 'bg-wokibi-purple',
    bg: 'bg-wokibi-purple/15 text-wokibi-purple-light border-wokibi-purple/30',
  },
  concluida: {
    label: 'Concluída',
    dot: 'bg-wokibi-done',
    bg: 'bg-wokibi-done/15 text-wokibi-done border-wokibi-done/30',
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const c = config[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        c.bg
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} />
      {c.label}
    </span>
  );
}

export function PrioridadeLabel({ prioridade }: { prioridade: string }) {
  const colors: Record<string, string> = {
    baixa: 'text-wokibi-muted',
    media: 'text-wokibi-pending',
    alta: 'text-red-400',
  };
  return (
    <span className={cn('text-xs font-medium uppercase tracking-wider', colors[prioridade])}>
      Prioridade {prioridade === 'media' ? 'média' : prioridade}
    </span>
  );
}
