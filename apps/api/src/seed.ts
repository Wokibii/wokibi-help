import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { Solicitacao } from './models/Solicitacao';
import { Comentario } from './models/Comentario';

dotenv.config();

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wokibi-help';
  await connectDB(uri);

  await Comentario.deleteMany({});
  await Solicitacao.deleteMany({});

  const solicitacoes = await Solicitacao.insertMany([
    {
      nomeSolicitante: 'Dra. Ribeiro',
      nomePaciente: 'Lindionaldo Humberto da Silva',
      prontuarioPaciente: '22321970',
      etiquetaPrincipal: 'erro',
      etiquetaEspecifica: 'dados_incorretos',
      titulo: 'erro nos exames',
      descricao: 'erro nos exames',
      prioridade: 'media',
      status: 'pendente',
      anexos: [],
    },
    {
      nomeSolicitante: 'Dra. Ribeiro',
      nomePaciente: 'Lindionaldo Humberto da Silva',
      prontuarioPaciente: '22321970',
      etiquetaPrincipal: 'erro',
      etiquetaEspecifica: 'outro_erro',
      titulo: 'Painel de gasometria não atualiza',
      descricao:
        'Quero um bloco com a evolução diária da gasometria arterial e o balanço hídrico das últimas 72h.',
      prioridade: 'media',
      status: 'em_andamento',
      notasEquipe: 'Bloco em desenvolvimento; previsto para o próximo sprint.',
      anexos: [],
    },
    {
      nomeSolicitante: 'Dr. Martins',
      nomePaciente: 'Maria Aparecida Santos',
      prontuarioPaciente: '18450231',
      etiquetaPrincipal: 'criacao_feature',
      etiquetaEspecifica: 'novo_bloco_visualizacao',
      titulo: 'Novo bloco de evolução de diurese',
      descricao: 'Preciso de um bloco com evolução horária de diurese nas últimas 48h.',
      prioridade: 'alta',
      status: 'em_andamento',
      anexos: [],
    },
    {
      nomeSolicitante: 'Enf. Paula',
      nomePaciente: 'João Carlos Oliveira',
      prontuarioPaciente: '19283746',
      etiquetaPrincipal: 'ajuda',
      etiquetaEspecifica: 'como_usar',
      titulo: 'Como filtrar por período customizado?',
      descricao: 'Não consigo encontrar onde alterar o período de visualização dos exames.',
      prioridade: 'baixa',
      status: 'pendente',
      anexos: [],
    },
  ]);

  await Comentario.insertMany([
    {
      solicitacaoId: solicitacoes[0]._id,
      autor: 'Equipe Wokibi',
      autorTipo: 'desenvolvedor',
      mensagem: 'Bom dia, logo mais nossa equipe estará resolvendo este erro',
      lida: false,
    },
    {
      solicitacaoId: solicitacoes[0]._id,
      autor: 'Dra. Ribeiro',
      autorTipo: 'usuario',
      mensagem: 'Ok, obg',
      lida: true,
    },
    {
      solicitacaoId: solicitacoes[1]._id,
      autor: 'Equipe Wokibi',
      autorTipo: 'desenvolvedor',
      mensagem: 'Estamos trabalhando neste bloco. Previsão: próxima semana.',
      lida: false,
    },
  ]);

  console.log('Seed concluído: 4 solicitações, 3 comentários');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
