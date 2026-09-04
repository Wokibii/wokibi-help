'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Stethoscope, ClipboardList, ArrowLeft } from 'lucide-react';
import { SolicitacaoModal } from '@/components/SolicitacaoModal';
import { FabButton } from '@/components/FabButton';
import { NotificacoesPopover } from '@/components/NotificacoesPopover';
import { Button } from '@/components/ui/button';

const PACIENTE_DEMO = {
  nome: 'Lindionaldo Humberto da Silva',
  prontuario: '22321970',
};

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-wokibi-bg">
      <header className="border-b border-wokibi-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wokibi-purple/20">
            <Stethoscope className="h-5 w-5 text-wokibi-purple" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Wokibi</h1>
            <p className="text-xs text-wokibi-muted">Lupa do Paciente — Demo</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificacoesPopover />
          <Link href="/solicitacoes">
            <Button variant="outline" size="sm">
              <ClipboardList className="h-4 w-4" />
              Lista de Solicitações
            </Button>
          </Link>
        </div>
      </header>

      <main className="p-8 max-w-4xl mx-auto">
        <div className="rounded-2xl border border-wokibi-border bg-wokibi-card p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Wokibi Help</h2>
            <p className="text-wokibi-muted mt-2">
              Módulo de solicitações de visualização para integração no Wokibi.
            </p>
          </div>

          <div className="rounded-xl border border-wokibi-border bg-wokibi-bg p-6 space-y-4">
            <h3 className="font-medium text-wokibi-purple-light">Como testar</h3>
            <ul className="text-sm text-wokibi-muted space-y-2 list-disc list-inside">
              <li>Clique no botão <strong className="text-white">+</strong> para abrir o modal de nova solicitação</li>
              <li>Acesse a <Link href="/solicitacoes" className="text-wokibi-purple-light hover:underline">Lista de Solicitações</Link> para a visão administrativa</li>
              <li>Use o chat para comunicação entre desenvolvedor e usuário</li>
            </ul>
          </div>

          <div className="rounded-xl border border-dashed border-wokibi-border p-6 text-center text-wokibi-muted text-sm">
            <p>Paciente em contexto: <span className="text-white">{PACIENTE_DEMO.nome}</span></p>
            <p className="mt-1">Prontuário: {PACIENTE_DEMO.prontuario}</p>
          </div>

          <Link href="/solicitacoes">
            <Button>
              <ArrowLeft className="h-4 w-4 rotate-180" />
              Ir para Lista de Solicitações
            </Button>
          </Link>
        </div>
      </main>

      <FabButton onClick={() => setModalOpen(true)} />

      <SolicitacaoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        nomeSolicitanteDefault="Dra. Ribeiro"
        pacienteDefault={PACIENTE_DEMO}
      />
    </div>
  );
}
