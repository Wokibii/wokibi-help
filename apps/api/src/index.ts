import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import solicitacoesRouter from './routes/solicitacoes';
import comentariosRouter from './routes/comentarios';
import notificacoesRouter from './routes/notificacoes';
import { uploadDir } from './middleware/upload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/wokibi-help';

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  })
);
app.use(express.json());
app.use('/uploads', express.static(path.resolve(uploadDir)));

app.use('/api/solicitacoes', solicitacoesRouter);
app.use('/api/solicitacoes/:solicitacaoId/comentarios', comentariosRouter);
app.use('/api/notificacoes', notificacoesRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function start() {
  await connectDB(MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
  });
}

start();
