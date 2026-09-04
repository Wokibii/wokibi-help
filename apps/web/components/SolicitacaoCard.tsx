'use client';

import { useState } from 'react';
import {
  MessageCircle,
  Clock,
  CheckCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label, Textarea } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge, PrioridadeLabel } from '@/components/StatusBadge';
import {
  ETIQUETAS,
  STATUS_OPTIONS,
  PRIORIDADES,
  getEtiquetaLabel,
  getEtiquetaPrincipalLabel,
  formatDate,
} from '@/lib/constants';
import { updateSolicitacao, deleteSolicitacao } from '@/lib/api';
import { uploadUrl } from '@/lib/utils';
import type {
  EtiquetaPrincipal,
  Prioridade,
  Solicitacao,
  Status,
} from '@/types/solicitacao';

interface SolicitacaoCardProps {
  solicitacao: Solicitacao;
  onUpdate: (s: Solicitacao) => void;
  onDelete: (id: string) => void;
  onOpenChat: (s: Solicitacao) => void;
}

export function SolicitacaoCard({
  solicitacao,
  onUpdate,
  onDelete,
  onOpenChat,
}: SolicitacaoCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);

  async function patch(data: Partial<Solicitacao>) {
    setSaving(true);
    try {
      const updated = await updateSolicitacao(solicitacao._id, data);
      onUpdate(updated);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Remover esta solicitação?')) return;
    await deleteSolicitacao(solicitacao._id);
    onDelete(solicitacao._id);
  }

  const etiquetaLabel = solicitacao.etiquetaEspecifica
    ? getEtiquetaLabel(solicitacao.etiquetaEspecifica)
    : getEtiquetaPrincipalLabel(solicitacao.etiquetaPrincipal);

  return (
    <div className="rounded-2xl border border-wokibi-border bg-wokibi-card overflow-hidden">
      <div
        className="p-5 cursor-pointer hover:bg-wokibi-bg/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={solicitacao.status} />
            <PrioridadeLabel prioridade={solicitacao.prioridade} />
            <span className="text-xs text-wokibi-muted">
              {getEtiquetaPrincipalLabel(solicitacao.etiquetaPrincipal)} — {etiquetaLabel}
            </span>
            {(solicitacao.msgCount ?? 0) > 0 && (
              <span className="text-xs text-wokibi-purple-light">
                {solicitacao.msgCount} msg
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="p-1.5 text-wokibi-muted hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-wokibi-muted" />
            ) : (
              <ChevronDown className="h-5 w-5 text-wokibi-muted" />
            )}
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <p className="text-sm text-wokibi-muted">
            Solicitante: <span className="text-white">{solicitacao.nomeSolicitante}</span>
            {' · '}
            Paciente:{' '}
            <span className="text-white">
              {solicitacao.nomePaciente}
              {solicitacao.prontuarioPaciente && ` — ${solicitacao.prontuarioPaciente}`}
            </span>
          </p>
          <h3 className="text-base font-semibold text-white">{solicitacao.titulo}</h3>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-wokibi-border p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-wokibi-muted uppercase tracking-wider">Criada em</span>
              <p className="text-white mt-1">{formatDate(solicitacao.criadaEm)}</p>
            </div>
            <div>
              <span className="text-wokibi-muted uppercase tracking-wider">Atualizada em</span>
              <p className="text-white mt-1">{formatDate(solicitacao.atualizadaEm)}</p>
            </div>
            <div>
              <span className="text-wokibi-muted uppercase tracking-wider">Concluída em</span>
              <p className="text-white mt-1">
                {solicitacao.concluidaEm ? formatDate(solicitacao.concluidaEm) : '—'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={solicitacao.status}
                onValueChange={(v) => patch({ status: v as Status })}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select
                value={solicitacao.prioridade}
                onValueChange={(v) => patch({ prioridade: v as Prioridade })}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORIDADES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Etiqueta principal</Label>
              <Select
                value={solicitacao.etiquetaPrincipal}
                onValueChange={(v) => {
                  const principal = v as EtiquetaPrincipal;
                  patch({
                    etiquetaPrincipal: principal,
                    etiquetaEspecifica: ETIQUETAS[principal].especificas[0]?.value,
                  });
                }}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ETIQUETAS) as EtiquetaPrincipal[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {ETIQUETAS[key].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Etiqueta específica</Label>
              <Select
                value={solicitacao.etiquetaEspecifica ?? ''}
                onValueChange={(v) => patch({ etiquetaEspecifica: v })}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {ETIQUETAS[solicitacao.etiquetaPrincipal].especificas.map((e) => (
                    <SelectItem key={e.value} value={e.value}>
                      {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notas da equipe</Label>
            <Textarea
              defaultValue={solicitacao.notasEquipe ?? ''}
              placeholder="Ex: Bloco em desenvolvimento; previsto para o próximo sprint..."
              onBlur={(e) => {
                if (e.target.value !== (solicitacao.notasEquipe ?? '')) {
                  patch({ notasEquipe: e.target.value });
                }
              }}
            />
          </div>

          {solicitacao.anexos.length > 0 && (
            <div className="space-y-2">
              <Label>Anexos</Label>
              <div className="flex flex-wrap gap-3">
                {solicitacao.anexos.map((a, i) => (
                  <a
                    key={i}
                    href={uploadUrl(a.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-20 h-28 rounded-xl border border-dashed border-wokibi-border bg-wokibi-bg overflow-hidden hover:border-wokibi-purple transition-colors"
                  >
                    {a.tipo === 'imagem' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={uploadUrl(a.url)}
                        alt={a.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-wokibi-muted p-2 text-center">
                        {a.nome}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChat(solicitacao)}>
              <MessageCircle className="h-4 w-4" />
              Abrir chat com o usuário
            </Button>
            <Button
              variant="outline"
              className="border-wokibi-purple/50 text-wokibi-purple-light"
              onClick={() => patch({ status: 'em_andamento' })}
              disabled={saving}
            >
              <Clock className="h-4 w-4" />
              Marcar em andamento
            </Button>
            <Button
              variant="success"
              onClick={() => patch({ status: 'concluida' })}
              disabled={saving}
            >
              <CheckCircle className="h-4 w-4" />
              Marcar concluída
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
