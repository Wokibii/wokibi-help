import mongoose, { Schema, Document, Types } from 'mongoose';
import type { AutorTipo } from '../types';

export interface ComentarioDocument extends Document {
  solicitacaoId: Types.ObjectId;
  autor: string;
  autorTipo: AutorTipo;
  mensagem: string;
  lida: boolean;
  criadaEm: Date;
}

const ComentarioSchema = new Schema<ComentarioDocument>(
  {
    solicitacaoId: {
      type: Schema.Types.ObjectId,
      ref: 'Solicitacao',
      required: true,
      index: true,
    },
    autor: { type: String, required: true },
    autorTipo: {
      type: String,
      enum: ['desenvolvedor', 'usuario'],
      required: true,
    },
    mensagem: { type: String, required: true },
    lida: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: 'criadaEm', updatedAt: false },
  }
);

export const Comentario = mongoose.model<ComentarioDocument>(
  'Comentario',
  ComentarioSchema
);
