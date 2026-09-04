'use client';

import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogCloseButton,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchComentarios, createComentario } from '@/lib/api';
import { formatDate, getEtiquetaLabel } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Comentario, Solicitacao } from '@/types/solicitacao';

interface SolicitacaoChatProps {
  solicitacao: Solicitacao | null;
  visao: 'desenvolvedor' | 'usuario';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  autorNome?: string;
}

export function SolicitacaoChat({
  solicitacao,
  visao,
  open,
  onOpenChange,
  autorNome = visao === 'desenvolvedor' ? 'Equipe Wokibi' : 'Usuário',
}: SolicitacaoChatProps) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!solicitacao || !open) return;
    setLoading(true);
    fetchComentarios(solicitacao._id)
      .then(setComentarios)
      .finally(() => setLoading(false));
  }, [solicitacao, open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comentarios]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!solicitacao || !mensagem.trim()) return;

    setSending(true);
    try {
      const novo = await createComentario(solicitacao._id, {
        autor: autorNome,
        autorTipo: visao === 'desenvolvedor' ? 'desenvolvedor' : 'usuario',
        mensagem: mensagem.trim(),
      });
      setComentarios((prev) => [...prev, novo]);
      setMensagem('');
    } finally {
      setSending(false);
    }
  }

  const titulo =
    visao === 'desenvolvedor' ? 'Chat — Visão desenvolvedor' : 'Chat — Visão usuário';

  const subtitulo = solicitacao
    ? `${solicitacao.etiquetaEspecifica ? getEtiquetaLabel(solicitacao.etiquetaEspecifica) : ''} — ${solicitacao.titulo}`
    : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg flex flex-col max-h-[80vh]">
        <DialogCloseButton />
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>{subtitulo}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 min-h-[200px] max-h-[400px] scrollbar-thin py-2">
          {loading ? (
            <p className="text-sm text-wokibi-muted text-center">Carregando...</p>
          ) : comentarios.length === 0 ? (
            <p className="text-sm text-wokibi-muted text-center">
              Nenhuma mensagem ainda. Inicie a conversa abaixo.
            </p>
          ) : (
            comentarios.map((c) => {
              const isDev = c.autorTipo === 'desenvolvedor';
              const isOwn =
                (visao === 'desenvolvedor' && isDev) ||
                (visao === 'usuario' && !isDev);

              return (
                <div
                  key={c._id}
                  className={cn('flex flex-col gap-1', isOwn ? 'items-end' : 'items-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                      isDev
                        ? 'bg-wokibi-purple/25 text-white border border-wokibi-purple/30'
                        : 'bg-wokibi-bg text-white border border-wokibi-border'
                    )}
                  >
                    {c.mensagem}
                  </div>
                  <span className="text-xs text-wokibi-muted px-1">
                    {isDev ? 'Desenvolvedor' : 'Usuário'} — {formatDate(c.criadaEm)}
                  </span>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-wokibi-border">
          <Input
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder={
              visao === 'desenvolvedor'
                ? 'Escreva para o usuário...'
                : 'Escreva para o desenvolvedor...'
            }
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={sending || !mensagem.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
