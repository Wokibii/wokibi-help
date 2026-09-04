import type { EtiquetaPrincipal } from '@/types/solicitacao';

export const ETIQUETAS: Record<
  EtiquetaPrincipal,
  { label: string; especificas: { value: string; label: string }[] }
> = {
  erro: {
    label: 'Erro',
    especificas: [
      { value: 'dados_incorretos', label: 'Dados incorretos ou desatualizados' },
      { value: 'painel_nao_carrega', label: 'Painel não carrega / erro de exibição' },
      { value: 'valor_clinico_inconsistente', label: 'Valor clínico inconsistente' },
      { value: 'filtro_periodo_falha', label: 'Filtro ou período com falha' },
      { value: 'outro_erro', label: 'Outro erro na plataforma' },
    ],
  },
  melhoria_feedback: {
    label: 'Melhoria da plataforma / Feedback',
    especificas: [
      { value: 'layout_usabilidade', label: 'Layout ou usabilidade' },
      { value: 'novo_filtro', label: 'Novo filtro ou período' },
      { value: 'performance', label: 'Performance / lentidão' },
      { value: 'acessibilidade', label: 'Acessibilidade' },
    ],
  },
  criacao_feature: {
    label: 'Criação de feature',
    especificas: [
      { value: 'novo_bloco_visualizacao', label: 'Novo bloco de visualização' },
      { value: 'integracao_dados', label: 'Integração de novos dados' },
      { value: 'exportacao', label: 'Exportação / relatório' },
    ],
  },
  ajuda: {
    label: 'Ajuda',
    especificas: [
      { value: 'como_usar', label: 'Como usar a plataforma' },
      { value: 'interpretacao_dados', label: 'Interpretação de dados clínicos' },
      { value: 'duvida_clinica', label: 'Dúvida clínica sobre exibição' },
    ],
  },
};

export const PRIORIDADES = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
] as const;

export const STATUS_OPTIONS = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'concluida', label: 'Concluída' },
] as const;

export function getEtiquetaLabel(value: string): string {
  for (const key of Object.keys(ETIQUETAS) as EtiquetaPrincipal[]) {
    if (key === value) return ETIQUETAS[key].label;
    const especifica = ETIQUETAS[key].especificas.find((e) => e.value === value);
    if (especifica) return especifica.label;
  }
  return value;
}

export function getEtiquetaPrincipalLabel(value: EtiquetaPrincipal): string {
  return ETIQUETAS[value]?.label ?? value;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
