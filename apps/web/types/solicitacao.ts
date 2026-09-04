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
