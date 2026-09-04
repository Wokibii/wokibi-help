'use client';

import { useState, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Bell } from 'lucide-react';
import { fetchNotificacoes } from '@/lib/api';
import { formatDate } from '@/lib/constants';
import type { Comentario } from '@/types/solicitacao';

export function NotificacoesPopover() {
  const [notificacoes, setNotificacoes] = useState<Comentario[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotificacoes()
      .then(setNotificacoes)
      .catch(() => setNotificacoes([]));
  }, [open]);

  const count = notificacoes.length;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="relative p-2 rounded-xl text-wokibi-muted hover:bg-wokibi-card hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 w-80 rounded-2xl border border-wokibi-border bg-wokibi-card p-4 shadow-xl"
          sideOffset={8}
          align="end"
        >
          <h3 className="text-sm font-semibold text-white mb-3">Notificações</h3>
          {notificacoes.length === 0 ? (
            <p className="text-sm text-wokibi-muted">Nenhuma notificação nova.</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
              {notificacoes.map((n) => (
                <div
                  key={n._id}
                  className="rounded-xl border border-wokibi-border bg-wokibi-bg p-3"
                >
                  <p className="text-xs font-medium text-wokibi-purple-light">
                    Nova mensagem do desenvolvedor
                  </p>
                  <p className="text-sm text-white mt-1 line-clamp-2">{n.mensagem}</p>
                  <p className="text-xs text-wokibi-muted mt-1">{formatDate(n.criadaEm)}</p>
                </div>
              ))}
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
