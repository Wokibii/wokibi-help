# Wokibi Help

Módulo de solicitações de visualização para integração no **Wokibi**. Permite que usuários solicitem novos blocos de visualização, acompanhem o status e conversem com a equipe de desenvolvimento.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 14, TypeScript, Radix UI, Tailwind CSS |
| Backend | Node.js, Express, MongoDB, Multer |

## Funcionalidades

- **Modal de nova solicitação** — nome, paciente, etiquetas (com sub-opções), descrição, prioridade e anexos
- **Lista administrativa** — filtros por status (Todas, Pendente, Em andamento, Concluída)
- **Chat** — visão desenvolvedor e usuário
- **Notificações** — alertas de novas mensagens

## Pré-requisitos

- Node.js 18.17+ (recomendado 20+)
- MongoDB rodando localmente (ou URI remota)

## Instalação

```bash
# Na raiz do projeto
npm install

# Configurar variáveis de ambiente
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

## Executar

```bash
# Subir MongoDB (Docker)
npm run db:up

# Subir API + Frontend juntos
npm run dev

# Ou separadamente:
npm run dev:api   # http://localhost:4000
npm run dev:web   # http://localhost:3000
```

## Seed (dados de exemplo)

```bash
npm run seed
```

## Estrutura

```
wokibi-help/
├── apps/
│   ├── api/          # Backend Express + MongoDB
│   └── web/          # Frontend Next.js
├── package.json      # Monorepo workspaces
└── README.md
```

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/solicitacoes?status=` | Listar solicitações |
| GET | `/api/solicitacoes/stats` | Contadores por status |
| POST | `/api/solicitacoes` | Criar (multipart) |
| PATCH | `/api/solicitacoes/:id` | Atualizar |
| DELETE | `/api/solicitacoes/:id` | Remover |
| GET | `/api/solicitacoes/:id/comentarios` | Listar chat |
| POST | `/api/solicitacoes/:id/comentarios` | Enviar mensagem |
| GET | `/api/notificacoes?naoLidas=true` | Notificações |

## Integração no Wokibi

Veja [INTEGRATION.md](./INTEGRATION.md) para instruções de como o dono do software pode integrar os componentes no sistema existente.

## Licença

Privado — uso interno Wokibi.
