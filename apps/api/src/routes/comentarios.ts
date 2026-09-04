import { Router, Request, Response } from 'express';
import { Comentario } from '../models/Comentario';
import { Solicitacao } from '../models/Solicitacao';

const router = Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response) => {
  try {
    const { solicitacaoId } = req.params;
    const comentarios = await Comentario.find({ solicitacaoId }).sort({ criadaEm: 1 });
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar comentários' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { solicitacaoId } = req.params;
    const { autor, autorTipo, mensagem } = req.body;

    if (!autor || !autorTipo || !mensagem) {
      res.status(400).json({ error: 'Campos obrigatórios faltando' });
      return;
    }

    const solicitacao = await Solicitacao.findById(solicitacaoId);
    if (!solicitacao) {
      res.status(404).json({ error: 'Solicitação não encontrada' });
      return;
    }

    const comentario = await Comentario.create({
      solicitacaoId,
      autor,
      autorTipo,
      mensagem,
      lida: false,
    });

    await Solicitacao.findByIdAndUpdate(solicitacaoId, {
      atualizadaEm: new Date(),
    });

    res.status(201).json(comentario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar comentário' });
  }
});

router.patch('/:comentarioId/lida', async (req: Request, res: Response) => {
  try {
    const comentario = await Comentario.findByIdAndUpdate(
      req.params.comentarioId,
      { lida: true },
      { new: true }
    );
    if (!comentario) {
      res.status(404).json({ error: 'Comentário não encontrado' });
      return;
    }
    res.json(comentario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao marcar comentário como lido' });
  }
});

export default router;
