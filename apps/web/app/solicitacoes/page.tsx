'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Stethoscope, ClipboardList, ArrowLeft } from 'lucide-react';
import { SolicitacaoCard } from '@/components/SolicitacaoCard';
import { SolicitacaoFilters } from '@/components/SolicitacaoFilters';
import { SolicitacaoChat } from '@/components/SolicitacaoChat';
import { SolicitacaoModal } from '@/components/SolicitacaoModal';
import { FabButton } from '@/components/FabButton';
import { NotificacoesPopover } from '@/components/NotificacoesPopover';
import { fetchSolicitacoes, fetchStats } from '@/lib/api';
import type { FiltroStatus, Solicitacao, Stats } from '@/types/solicitacao';

const PACIENTE_DEMO = {
  nome: 'Lindionaldo Humberto da Silva',
  prontuario: '22321970',
};

export default function SolicitacoesPage() {
  const [filtro, setFiltro] = useState<FiltroStatus>('todas');
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pendente: 0,
    em_andamento: 0,
    concluida: 0,
  });
  const [loading, setLoading] = useState(true);
  const [chatSolicitacao, setChatSolicitacao] = useState<Solicitacao | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [list, st] = await Promise.all([
        fetchSolicitacoes(filtro),
        fetchStats(),
      ]);
      setSolicitacoes(list);
      setStats(st);
    } catch {
      setSolicitacoes([]);
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleUpdate(updated: Solicitacao) {
    setSolicitacoes((prev) =>
      prev.map((s) => (s._id === updated._id ? { ...s, ...updated } : s))
    );
    fetchStats().then(setStats);
  }

  function handleDelete(id: string) {
    setSolicitacoes((prev) => prev.filter((s) => s._id !== id));
    fetchStats().then(setStats);
  }

  function handleOpenChat(s: Solicitacao) {
    setChatSolicitacao(s);
    setChatOpen(true);
  }

  return (
    <div className="min-h-screen bg-wokibi-bg">
      <header className="border-b border-wokibi-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl text-wokibi-muted hover:bg-wokibi-card hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wokibi-purple/20">
                <Stethoscope className="h-5 w-5 text-wokibi-purple" />
              </div>
              <div>
                <h1 className="text-sm font-semibold">Wokibi</h1>
                <p className="text-xs text-wokibi-muted">Lista de Solicitações</p>
              </div>
            </div>
          </div>
          <NotificacoesPopover />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-wokibi-purple" />
              <h2 className="text-2xl font-semibold">Lista de Solicitações</h2>
            </div>
            <p className="text-sm text-wokibi-muted mt-1">
              Visão administrativa — acompanhe pedidos, etiquetas, status e chat com o usuário.
            </p>
          </div>
          <span className="rounded-full border border-wokibi-border px-3 py-1 text-xs text-wokibi-muted">
            {stats.total} solicitações
          </span>
        </div>

        <SolicitacaoFilters filtro={filtro} onFiltroChange={setFiltro} stats={stats} />

        {loading ? (
          <p className="text-center text-wokibi-muted py-12">Carregando...</p>
        ) : solicitacoes.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-wokibi-border">
            <p className="text-wokibi-muted">Nenhuma solicitação encontrada.</p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-3 text-sm text-wokibi-purple-light hover:underline"
            >
              Criar nova solicitação
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {solicitacoes.map((s) => (
              <SolicitacaoCard
                key={s._id}
                solicitacao={s}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onOpenChat={handleOpenChat}
              />
            ))}
          </div>
        )}
      </main>

      <FabButton onClick={() => setModalOpen(true)} />

      <SolicitacaoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        nomeSolicitanteDefault="Dra. Ribeiro"
        pacienteDefault={PACIENTE_DEMO}
        onSuccess={() => loadData()}
      />

      <SolicitacaoChat
        solicitacao={chatSolicitacao}
        visao="desenvolvedor"
        open={chatOpen}
        onOpenChange={setChatOpen}
        autorNome="Equipe Wokibi"
      />
    </div>
  );
}
