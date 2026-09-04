import { Router, Request, Response } from 'express';
import { Comentario } from '../models/Comentario';
import { Solicitacao } from '../models/Solicitacao';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { naoLidas } = req.query;

    const filter: Record<string, unknown> = { autorTipo: 'desenvolvedor' };
    if (naoLidas === 'true') {
      filter.lida = false;
    }

    const comentarios = await Comentario.find(filter)
      .sort({ criadaEm: -1 })
      .limit(20);

    const withSolicitacao = await Promise.all(
      comentarios.map(async (c) => {
        const solicitacao = await Solicitacao.findById(c.solicitacaoId);
        return {
          ...c.toObject(),
          solicitacaoTitulo: solicitacao?.titulo,
          solicitacaoEtiqueta: solicitacao?.etiquetaEspecifica,
        };
      })
    );

    res.json(withSolicitacao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar notificações' });
  }
});

export default router;
