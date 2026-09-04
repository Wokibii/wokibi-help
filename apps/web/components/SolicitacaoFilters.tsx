'use client';

import { cn } from '@/lib/utils';
import type { FiltroStatus, Stats } from '@/types/solicitacao';

interface SolicitacaoFiltersProps {
  filtro: FiltroStatus;
  onFiltroChange: (f: FiltroStatus) => void;
  stats: Stats;
}

const filtros: { value: FiltroStatus; label: string; statKey: keyof Stats }[] = [
  { value: 'todas', label: 'Todas', statKey: 'total' },
  { value: 'pendente', label: 'Pendente', statKey: 'pendente' },
  { value: 'em_andamento', label: 'Em andamento', statKey: 'em_andamento' },
  { value: 'concluida', label: 'Concluída', statKey: 'concluida' },
];

export function SolicitacaoFilters({
  filtro,
  onFiltroChange,
  stats,
}: SolicitacaoFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filtros.map((f) => (
        <button
          key={f.value}
          onClick={() => onFiltroChange(f.value)}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors',
            filtro === f.value
              ? 'border-wokibi-purple bg-wokibi-purple/20 text-white'
              : 'border-wokibi-border text-wokibi-muted hover:border-wokibi-purple/50 hover:text-white'
          )}
        >
          {f.label}
          <span
            className={cn(
              'rounded-full px-1.5 py-0.5 text-xs',
              filtro === f.value ? 'bg-wokibi-purple/40' : 'bg-wokibi-border'
            )}
          >
            {stats[f.statKey]}
          </span>
        </button>
      ))}
    </div>
  );
}
