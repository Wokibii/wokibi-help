'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { User, Paperclip, X, Mic, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogCloseButton,
} from '@/components/ui/dialog';
import { Label, Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ETIQUETAS, PRIORIDADES } from '@/lib/constants';
import { createSolicitacao } from '@/lib/api';
import { cn } from '@/lib/utils';
import type {
  EtiquetaPrincipal,
  MultimodalAssistContext,
  MultimodalAssistHelpers,
  OnMultimodalAssist,
  PacienteContexto,
  Prioridade,
  Solicitacao,
} from '@/types/solicitacao';

interface SolicitacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nomeSolicitanteDefault?: string;
  pacienteDefault?: PacienteContexto;
  onSuccess?: (solicitacao: Solicitacao) => void;
  /**
   * Hook para o pipeline multimodal do host (áudio + imagens → texto/etiquetas).
   * Este módulo NÃO grava nem transcreve áudio — só chama o host.
   */
  onMultimodalAssist?: OnMultimodalAssist;
  /**
   * Substitui o botão Mic padrão. Use quando o host já tiver UI própria de áudio.
   */
  renderMultimodalButton?: (helpers: MultimodalAssistHelpers & {
    busy: boolean;
    disabled: boolean;
  }) => ReactNode;
}

export function SolicitacaoModal({
  open,
  onOpenChange,
  nomeSolicitanteDefault = '',
  pacienteDefault,
  onSuccess,
  onMultimodalAssist,
  renderMultimodalButton,
}: SolicitacaoModalProps) {
  const [nomeSolicitante, setNomeSolicitante] = useState(nomeSolicitanteDefault);
  const [nomePaciente, setNomePaciente] = useState(pacienteDefault?.nome ?? '');
  const [prontuario, setProntuario] = useState(pacienteDefault?.prontuario ?? '');
  const [etiquetaPrincipal, setEtiquetaPrincipal] = useState<EtiquetaPrincipal>('erro');
  const [etiquetaEspecifica, setEtiquetaEspecifica] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState<Prioridade>('media');
  const [anexos, setAnexos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [assistBusy, setAssistBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<MultimodalAssistContext>({
    descricao: '',
    anexos: [],
    etiquetaPrincipal: 'erro',
    etiquetaEspecifica: '',
    prioridade: 'media',
    nomeSolicitante: '',
    nomePaciente: '',
    prontuarioPaciente: '',
  });

  formRef.current = {
    descricao,
    anexos,
    etiquetaPrincipal,
    etiquetaEspecifica,
    prioridade,
    nomeSolicitante,
    nomePaciente,
    prontuarioPaciente: prontuario,
  };

  useEffect(() => {
    if (open) {
      setNomeSolicitante(nomeSolicitanteDefault);
      setNomePaciente(pacienteDefault?.nome ?? '');
      setProntuario(pacienteDefault?.prontuario ?? '');
    }
  }, [open, nomeSolicitanteDefault, pacienteDefault]);

  const especificas = ETIQUETAS[etiquetaPrincipal].especificas;
  const hasMultimodalHook = Boolean(onMultimodalAssist || renderMultimodalButton);

  function buildAssistHelpers(): MultimodalAssistHelpers {
    return {
      getContext: () => ({ ...formRef.current, anexos: [...formRef.current.anexos] }),
      setDescricao,
      appendToDescricao: (texto) => {
        const t = texto.trim();
        if (!t) return;
        setDescricao((prev) => (prev.trim() ? `${prev.trim()} ${t}` : t));
      },
      setEtiquetaPrincipal: (value) => {
        setEtiquetaPrincipal(value);
        setEtiquetaEspecifica(ETIQUETAS[value].especificas[0]?.value ?? '');
      },
      setEtiquetaEspecifica,
      setPrioridade,
      setAnexos: (files) => setAnexos(files.slice(0, 5)),
      addAnexos: (files) =>
        setAnexos((prev) => [...prev, ...files].slice(0, 5)),
    };
  }

  function handleEtiquetaChange(value: EtiquetaPrincipal) {
    setEtiquetaPrincipal(value);
    setEtiquetaEspecifica(ETIQUETAS[value].especificas[0]?.value ?? '');
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setAnexos((prev) => [...prev, ...files].slice(0, 5));
    e.target.value = '';
  }

  function removeAnexo(index: number) {
    setAnexos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleMultimodalClick() {
    if (!onMultimodalAssist || assistBusy || loading) return;
    setError('');
    setAssistBusy(true);
    try {
      await onMultimodalAssist(buildAssistHelpers());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Falha no assistente multimodal'
      );
    } finally {
      setAssistBusy(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!nomeSolicitante || !nomePaciente || !descricao.trim()) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('nomeSolicitante', nomeSolicitante);
      formData.append('nomePaciente', nomePaciente);
      if (prontuario) formData.append('prontuarioPaciente', prontuario);
      formData.append('etiquetaPrincipal', etiquetaPrincipal);
      if (etiquetaEspecifica) formData.append('etiquetaEspecifica', etiquetaEspecifica);
      formData.append('descricao', descricao);
      formData.append('prioridade', prioridade);
      anexos.forEach((f) => formData.append('anexos', f));

      const solicitacao = await createSolicitacao(formData);
      onSuccess?.(solicitacao);
      onOpenChange(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setDescricao('');
    setAnexos([]);
    setEtiquetaEspecifica('');
    setPrioridade('media');
    setAssistBusy(false);
  }

  const assistHelpers = buildAssistHelpers();
  const assistUi = {
    ...assistHelpers,
    busy: assistBusy,
    disabled: loading || assistBusy,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogCloseButton />
        <DialogHeader>
          <DialogTitle>Solicitar nova visualização</DialogTitle>
          <DialogDescription>
            Informe quem solicita, confirme o paciente da Lupa, escolha a etiqueta e descreva o pedido.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Seu nome (solicitante)</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-wokibi-muted" />
                <Input
                  className="pl-10"
                  value={nomeSolicitante}
                  onChange={(e) => setNomeSolicitante(e.target.value)}
                  placeholder="Ex: Dra. Ribeiro"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Paciente (contexto da Lupa)</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-wokibi-muted" />
                <Input
                  className="pl-10"
                  value={nomePaciente}
                  onChange={(e) => setNomePaciente(e.target.value)}
                  placeholder="Nome do paciente"
                />
              </div>
              <Input
                value={prontuario}
                onChange={(e) => setProntuario(e.target.value)}
                placeholder="Prontuário"
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Etiquetas</Label>
            <ToggleGroup
              type="single"
              value={etiquetaPrincipal}
              onValueChange={(v) => v && handleEtiquetaChange(v as EtiquetaPrincipal)}
            >
              {(Object.keys(ETIQUETAS) as EtiquetaPrincipal[]).map((key) => (
                <ToggleGroupItem key={key} value={key} className="text-xs">
                  {ETIQUETAS[key].label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <p className="text-xs text-wokibi-muted">
              Selecione uma etiqueta para ver as opções específicas (úteis para relatório do time de desenvolvimento).
            </p>
          </div>

          {especificas.length > 0 && (
            <div className="space-y-2">
              <Label>Especificar — {ETIQUETAS[etiquetaPrincipal].label}</Label>
              <ToggleGroup
                type="single"
                value={etiquetaEspecifica}
                onValueChange={setEtiquetaEspecifica}
              >
                {especificas.map((e) => (
                  <ToggleGroupItem key={e.value} value={e.value} className="text-xs">
                    {e.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          )}

          <div className="space-y-2">
            <Label>Descrição</Label>
            <div className="relative">
              <Textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Quero um bloco com a evolução diária da gasometria arterial e o balanço hídrico das últimas 72h..."
                className="pb-10"
              />
              <div className="absolute bottom-2 left-2">
                {renderMultimodalButton ? (
                  renderMultimodalButton(assistUi)
                ) : (
                  <button
                    type="button"
                    onClick={handleMultimodalClick}
                    disabled={!hasMultimodalHook || assistUi.disabled}
                    title={
                      hasMultimodalHook
                        ? 'Assistente multimodal (áudio + imagens do host)'
                        : 'Aguardando integração multimodal do host (onMultimodalAssist)'
                    }
                    className={cn(
                      'rounded-lg p-1.5 transition-colors',
                      hasMultimodalHook
                        ? 'text-wokibi-purple-light hover:bg-wokibi-border hover:text-white'
                        : 'cursor-not-allowed text-wokibi-muted/50'
                    )}
                    aria-label="Assistente multimodal"
                  >
                    {assistBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
            {!hasMultimodalHook && (
              <p className="text-xs text-wokibi-muted">
                O microfone é um ponto de integração: o host liga o modelo multimodal via{' '}
                <code className="text-wokibi-purple-light">onMultimodalAssist</code>.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Prioridade</Label>
            <ToggleGroup
              type="single"
              value={prioridade}
              onValueChange={(v) => v && setPrioridade(v as Prioridade)}
            >
              {PRIORIDADES.map((p) => (
                <ToggleGroupItem key={p.value} value={p.value}>
                  {p.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFiles}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center"
              onClick={() => fileRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
              Anexar imagens ou vídeos
            </Button>
            <p className="text-xs text-wokibi-muted">
              Ajude o assistente a entender o contexto visual. Máx. 8 MB por arquivo.
            </p>
            {anexos.length > 0 && (
              <div className="space-y-2">
                {anexos.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-wokibi-border bg-wokibi-bg px-3 py-2"
                  >
                    <span className="text-sm truncate">{file.name}</span>
                    <button type="button" onClick={() => removeAnexo(i)}>
                      <X className="h-4 w-4 text-wokibi-muted hover:text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || assistBusy}>
              {loading ? 'Salvando...' : 'Salvar Solicitação'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
