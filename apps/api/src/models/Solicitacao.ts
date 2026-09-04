import mongoose, { Schema, Document } from 'mongoose';
import type { Anexo, EtiquetaPrincipal, Prioridade, Status } from '../types';

export interface SolicitacaoDocument extends Document {
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

const AnexoSchema = new Schema<Anexo>(
  {
    nome: { type: String, required: true },
    url: { type: String, required: true },
    tipo: { type: String, enum: ['imagem', 'video'], required: true },
    tamanhoBytes: { type: Number, required: true },
  },
  { _id: false }
);

const SolicitacaoSchema = new Schema<SolicitacaoDocument>(
  {
    nomeSolicitante: { type: String, required: true },
    nomePaciente: { type: String, required: true },
    prontuarioPaciente: String,
    etiquetaPrincipal: {
      type: String,
      enum: ['erro', 'melhoria_feedback', 'criacao_feature', 'ajuda'],
      required: true,
    },
    etiquetaEspecifica: String,
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    prioridade: {
      type: String,
      enum: ['baixa', 'media', 'alta'],
      default: 'media',
    },
    status: {
      type: String,
      enum: ['pendente', 'em_andamento', 'concluida'],
      default: 'pendente',
    },
    notasEquipe: String,
    anexos: { type: [AnexoSchema], default: [] },
    concluidaEm: Date,
  },
  {
    timestamps: { createdAt: 'criadaEm', updatedAt: 'atualizadaEm' },
  }
);

export const Solicitacao = mongoose.model<SolicitacaoDocument>(
  'Solicitacao',
  SolicitacaoSchema
);
