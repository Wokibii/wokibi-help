export type EtiquetaPrincipal =
  | 'erro'
  | 'melhoria_feedback'
  | 'criacao_feature'
  | 'ajuda';

export type Prioridade = 'baixa' | 'media' | 'alta';
export type Status = 'pendente' | 'em_andamento' | 'concluida';
export type AutorTipo = 'desenvolvedor' | 'usuario';

export interface Anexo {
  nome: string;
  url: string;
  tipo: 'imagem' | 'video';
  tamanhoBytes: number;
}

export interface ISolicitacao {
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
  concluidaEm?: Date;
  criadaEm: Date;
  atualizadaEm: Date;
}

export interface IComentario {
  solicitacaoId: string;
  autor: string;
  autorTipo: AutorTipo;
  mensagem: string;
  lida: boolean;
  criadaEm: Date;
}
