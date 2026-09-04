export type EtiquetaPrincipal =
  | 'erro'
  | 'melhoria_feedback'
  | 'criacao_feature'
  | 'ajuda';

export type Prioridade = 'baixa' | 'media' | 'alta';
export type Status = 'pendente' | 'em_andamento' | 'concluida';
export type FiltroStatus = 'todas' | Status;
export type AutorTipo = 'desenvolvedor' | 'usuario';

export interface Anexo {
  nome: string;
  url: string;
  tipo: 'imagem' | 'video';
  tamanhoBytes: number;
}

export interface Solicitacao {
  _id: string;
  nomeSolicitante: string;
  nomePaciente: string;
  prontuarioPaciente?: string;
  etiquetaPrincipal: EtiquetaPrincipal;
  etiquetaEspecifica?: string;
  titulo: string;
  descricao: string;
  prioridade: Prioridade;
  status: Status;
  notasEquipe?: string;
  anexos: Anexo[];
  concluidaEm?: string;
  criadaEm: string;
  atualizadaEm: string;
  msgCount?: number;
}

export interface Comentario {
  _id: string;
  solicitacaoId: string;
  autor: string;
  autorTipo: AutorTipo;
  mensagem: string;
  lida: boolean;
  criadaEm: string;
  solicitacaoTitulo?: string;
  solicitacaoEtiqueta?: string;
}

export interface Stats {
  total: number;
  pendente: number;
  em_andamento: number;
  concluida: number;
}

export interface PacienteContexto {
  nome: string;
  prontuario: string;
}

/** Snapshot do formulário para o pipeline multimodal do host (áudio + imagens). */
export interface MultimodalAssistContext {
  descricao: string;
  anexos: File[];
  etiquetaPrincipal: EtiquetaPrincipal;
  etiquetaEspecifica: string;
  prioridade: Prioridade;
  nomeSolicitante: string;
  nomePaciente: string;
  prontuarioPaciente: string;
}

/** Helpers para a IA/host preencher o modal a partir do modelo multimodal. */
export interface MultimodalAssistHelpers {
  getContext: () => MultimodalAssistContext;
  setDescricao: (texto: string) => void;
  appendToDescricao: (texto: string) => void;
  setEtiquetaPrincipal: (value: EtiquetaPrincipal) => void;
  setEtiquetaEspecifica: (value: string) => void;
  setPrioridade: (value: Prioridade) => void;
  setAnexos: (files: File[]) => void;
  addAnexos: (files: File[]) => void;
}

export type OnMultimodalAssist = (
  helpers: MultimodalAssistHelpers
) => void | Promise<void>;
