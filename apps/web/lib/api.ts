import { API_URL } from './utils';
import type {
  Comentario,
  FiltroStatus,
  Solicitacao,
  Stats,
} from '@/types/solicitacao';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(err.error || 'Erro na requisição');
  }
  return res.json();
}

export async function fetchSolicitacoes(status?: FiltroStatus): Promise<Solicitacao[]> {
  const query = status && status !== 'todas' ? `?status=${status}` : '';
  return request<Solicitacao[]>(`/api/solicitacoes${query}`);
}

export async function fetchStats(): Promise<Stats> {
  return request<Stats>('/api/solicitacoes/stats');
}

export async function fetchSolicitacao(id: string): Promise<Solicitacao> {
  return request<Solicitacao>(`/api/solicitacoes/${id}`);
}

export async function createSolicitacao(formData: FormData): Promise<Solicitacao> {
  const res = await fetch(`${API_URL}/api/solicitacoes`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro ao criar solicitação' }));
    throw new Error(err.error);
  }
  return res.json();
}

export async function updateSolicitacao(
  id: string,
  data: Partial<Solicitacao>
): Promise<Solicitacao> {
  return request<Solicitacao>(`/api/solicitacoes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteSolicitacao(id: string): Promise<void> {
  await request(`/api/solicitacoes/${id}`, { method: 'DELETE' });
}

export async function fetchComentarios(solicitacaoId: string): Promise<Comentario[]> {
  return request<Comentario[]>(`/api/solicitacoes/${solicitacaoId}/comentarios`);
}

export async function createComentario(
  solicitacaoId: string,
  data: { autor: string; autorTipo: 'desenvolvedor' | 'usuario'; mensagem: string }
): Promise<Comentario> {
  return request<Comentario>(`/api/solicitacoes/${solicitacaoId}/comentarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function fetchNotificacoes(): Promise<Comentario[]> {
  return request<Comentario[]>('/api/notificacoes?naoLidas=true');
}

export async function marcarComentarioLido(
  solicitacaoId: string,
  comentarioId: string
): Promise<void> {
  await request(
    `/api/solicitacoes/${solicitacaoId}/comentarios/${comentarioId}/lida`,
    { method: 'PATCH' }
  );
}
