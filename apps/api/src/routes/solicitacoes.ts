import { Router, Request, Response } from 'express';
import { Solicitacao } from '../models/Solicitacao';
import { Comentario } from '../models/Comentario';
import { upload } from '../middleware/upload';
import type { Status } from '../types';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const filter: Record<string, unknown> = {};

    if (status && status !== 'todas') {
      filter.status = status as Status;
    }

    const solicitacoes = await Solicitacao.find(filter).sort({ criadaEm: -1 });

    const withCounts = await Promise.all(
      solicitacoes.map(async (s) => {
        const msgCount = await Comentario.countDocuments({
          solicitacaoId: s._id,
        });
        return { ...s.toObject(), msgCount };
      })
    );

    res.json(withCounts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar solicitações' });
  }
});

router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [total, pendente, em_andamento, concluida] = await Promise.all([
      Solicitacao.countDocuments(),
      Solicitacao.countDocuments({ status: 'pendente' }),
      Solicitacao.countDocuments({ status: 'em_andamento' }),
      Solicitacao.countDocuments({ status: 'concluida' }),
    ]);

    res.json({ total, pendente, em_andamento, concluida });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const solicitacao = await Solicitacao.findById(req.params.id);
    if (!solicitacao) {
      res.status(404).json({ error: 'Solicitação não encontrada' });
      return;
    }
    res.json(solicitacao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar solicitação' });
  }
});

router.post('/', upload.array('anexos', 5), async (req: Request, res: Response) => {
  try {
    const {
      nomeSolicitante,
      nomePaciente,
      prontuarioPaciente,
      etiquetaPrincipal,
      etiquetaEspecifica,
      descricao,
      prioridade,
    } = req.body;

    if (!nomeSolicitante || !nomePaciente || !etiquetaPrincipal || !descricao) {
      res.status(400).json({ error: 'Campos obrigatórios faltando' });
      return;
    }

    const files = (req.files as Express.Multer.File[]) || [];
    const anexos = files.map((f) => ({
      nome: f.originalname,
      url: `/uploads/${f.filename}`,
      tipo: f.mimetype.startsWith('video/') ? ('video' as const) : ('imagem' as const),
      tamanhoBytes: f.size,
    }));

    const titulo = descricao.trim().split('\n')[0].slice(0, 80) || 'Nova solicitação';

    const solicitacao = await Solicitacao.create({
      nomeSolicitante,
      nomePaciente,
      prontuarioPaciente,
      etiquetaPrincipal,
      etiquetaEspecifica,
      titulo,
      descricao,
      prioridade: prioridade || 'media',
      anexos,
    });

    res.status(201).json(solicitacao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar solicitação' });
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { status, prioridade, etiquetaPrincipal, etiquetaEspecifica, notasEquipe } =
      req.body;

    const update: Record<string, unknown> = {};

    if (status) update.status = status;
    if (prioridade) update.prioridade = prioridade;
    if (etiquetaPrincipal) update.etiquetaPrincipal = etiquetaPrincipal;
    if (etiquetaEspecifica !== undefined) update.etiquetaEspecifica = etiquetaEspecifica;
    if (notasEquipe !== undefined) update.notasEquipe = notasEquipe;

    if (status === 'concluida') {
      update.concluidaEm = new Date();
    } else if (status) {
      update.concluidaEm = null;
    }

    const solicitacao = await Solicitacao.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!solicitacao) {
      res.status(404).json({ error: 'Solicitação não encontrada' });
      return;
    }

    res.json(solicitacao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar solicitação' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const solicitacao = await Solicitacao.findByIdAndDelete(req.params.id);
    if (!solicitacao) {
      res.status(404).json({ error: 'Solicitação não encontrada' });
      return;
    }
    await Comentario.deleteMany({ solicitacaoId: req.params.id });
    res.json({ message: 'Solicitação removida' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover solicitação' });
  }
});

export default router;
