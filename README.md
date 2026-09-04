# Wokibi Help

Módulo de solicitações (help desk) para integração no **Wokibi** (ou outro software host). Usuários abrem pedidos com contexto de paciente, acompanham status e conversam com a equipe de desenvolvimento.

Este repositório é um **pacote pronto para integrar**: API + UI de demonstração + guia escrito para outra IA executar a integração no software destino.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 14, TypeScript, Radix UI, Tailwind CSS |
| Backend | Node.js, Express, MongoDB, Multer |

## Funcionalidades

- **Modal de nova solicitação** — solicitante, paciente, etiquetas, descrição, prioridade e anexos
- **Lista administrativa** — filtros por status, edição, exclusão
- **Chat** — visão desenvolvedor e usuário
- **Notificações** — sino com mensagens não lidas do desenvolvedor

## Como integrar no seu software (via IA)

A forma prevista de uso é: o time do produto entrega este código a uma IA e pede a integração no repositório host.

### Passos para a pessoa

1. **Rode o demo localmente** (opcional, mas útil) com a seção [Instalação](#instalação) abaixo, para entender o comportamento.
2. **Abra o software destino** (ex.: monorepo do Wokibi) no mesmo ambiente da IA.
3. **Entregue à IA** pelo menos:
   - a pasta `apps/` deste repositório (ou o repo inteiro), e
   - o arquivo **[INTEGRATION.md](./INTEGRATION.md)** — brief completo para agentes.
4. **Cole um pedido explícito**, por exemplo:

```text
Integre o módulo Wokibi Help neste repositório.

Siga o INTEGRATION.md ao pé da letra (missão, arquivos a copiar, contrato da API,
passos de wiring e gaps conhecidos).
Use a Strategy A (API separada) salvo se já tivermos Express/Mongo — aí use Strategy B.
Conecte FabButton + SolicitacaoModal com o usuário logado e o paciente em contexto.
Coloque a lista administrativa na navegação e o NotificacoesPopover no header.
Ao abrir o chat relacionado, chame marcarComentarioLido.
Não reescreva features não relacionadas. Mantenha os nomes dos campos da API.
Ao final, liste os arquivos alterados e como subir.
```

5. **Revise o checklist** no final do `INTEGRATION.md` (criar pedido, anexo, lista, chat, sino, CORS/auth).

O `INTEGRATION.md` é a fonte da verdade para a IA: o que copiar, props dos componentes, endpoints, enums, tokens de tema, lacunas conhecidas e ordem de execução. O README só orienta o humano; o brief técnico está lá.

### O que a IA deve montar no host

| Ponto no software | Peça deste módulo |
|-------------------|-------------------|
| Tela com paciente / ação rápida | `FabButton` + `SolicitacaoModal` |
| Header | `NotificacoesPopover` |
| Menu / sidebar | Link para a lista + badge opcional de pendentes |
| Área admin | Página no padrão de `app/solicitacoes/page.tsx` |
| Backend | Serviço `apps/api` **ou** rotas/models mergeados |

## Pré-requisitos

- Node.js 18.17+ (recomendado 20+)
- MongoDB local ou URI remota
- Docker (opcional, para Mongo via Compose)

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
│   └── web/          # Frontend Next.js (demo + componentes)
├── INTEGRATION.md    # Brief para IA integrar no software host
├── package.json      # Monorepo workspaces
└── README.md
```

## API (resumo)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/solicitacoes?status=` | Listar solicitações |
| GET | `/api/solicitacoes/stats` | Contadores por status |
| POST | `/api/solicitacoes` | Criar (multipart) |
| PATCH | `/api/solicitacoes/:id` | Atualizar |
| DELETE | `/api/solicitacoes/:id` | Remover |
| GET | `/api/solicitacoes/:id/comentarios` | Listar chat |
| POST | `/api/solicitacoes/:id/comentarios` | Enviar mensagem |
| PATCH | `/api/solicitacoes/:id/comentarios/:comentarioId/lida` | Marcar como lida |
| GET | `/api/notificacoes?naoLidas=true` | Notificações |

Contrato completo, enums e campos multipart: [INTEGRATION.md](./INTEGRATION.md).

## Licença

Privado — uso interno Wokibi.
