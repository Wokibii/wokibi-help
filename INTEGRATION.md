# Guia de Integração — Wokibi Help

Este documento descreve como integrar o módulo **Wokibi Help** no sistema Wokibi existente.

## O que copiar

### Frontend (componentes reutilizáveis)

```
apps/web/components/
├── SolicitacaoModal/     → Modal de nova solicitação
├── SolicitacaoCard/      → Card da lista administrativa
├── SolicitacaoChat/      → Modal de chat
├── SolicitacaoFilters/   → Filtros por status
├── NotificacoesPopover/  → Popover de notificações
├── FabButton/            → Botão flutuante (+)
├── StatusBadge/          → Badge de status/prioridade
└── ui/                   → Primitivos Radix (Dialog, Select, etc.)

apps/web/lib/
├── api.ts                → Cliente HTTP
├── constants.ts          → Etiquetas e labels
└── utils.ts

apps/web/types/
└── solicitacao.ts        → Tipos TypeScript
```

### Backend

Opção A: Rodar a API como serviço separado (`apps/api`).

Opção B: Copiar as rotas e models para o backend existente do Wokibi.

## Dependências frontend

```json
{
  "@radix-ui/react-dialog": "^1",
  "@radix-ui/react-select": "^2",
  "@radix-ui/react-toggle-group": "^1",
  "@radix-ui/react-label": "^2",
  "@radix-ui/react-popover": "^1",
  "lucide-react": "^0.400",
  "tailwindcss": "^3"
}
```

## Uso do Modal

No botão FAB (+) ou em qualquer trigger do Wokibi:

```tsx
import { SolicitacaoModal } from '@/components/SolicitacaoModal';

function LupaPaciente() {
  const [open, setOpen] = useState(false);
  const paciente = usePacienteAtual(); // do contexto Wokibi
  const usuario = useUsuarioLogado();

  return (
    <>
      <FabButton onClick={() => setOpen(true)} />
      <SolicitacaoModal
        open={open}
        onOpenChange={setOpen}
        nomeSolicitanteDefault={usuario.nome}
        pacienteDefault={{
          nome: paciente.nome,
          prontuario: paciente.id,
        }}
        onSuccess={() => toast('Solicitação enviada!')}
      />
    </>
  );
}
```

## Link para Lista de Solicitações

Na sidebar do Wokibi, seção "SOLICITAÇÕES":

```tsx
<Link href="/solicitacoes">
  Lista de Solicitações
  {stats.pendente > 0 && <Badge>{stats.pendente}</Badge>}
</Link>
```

## Variáveis de ambiente

```env
# Frontend
NEXT_PUBLIC_API_URL=https://api.wokibi.com.br

# Backend
MONGODB_URI=mongodb://...
PORT=4000
CORS_ORIGIN=https://app.wokibi.com.br
MAX_FILE_SIZE=8388608
```

## Contrato de dados

### Criar solicitação (POST /api/solicitacoes)

`Content-Type: multipart/form-data`

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| nomeSolicitante | string | sim |
| nomePaciente | string | sim |
| prontuarioPaciente | string | não |
| etiquetaPrincipal | enum | sim |
| etiquetaEspecifica | string | não |
| descricao | string | sim |
| prioridade | enum | não (default: media) |
| anexos | file[] | não (max 5, 8MB cada) |

### Etiquetas principais

- `erro`
- `melhoria_feedback`
- `criacao_feature`
- `ajuda`

### Status

- `pendente` (default)
- `em_andamento`
- `concluida`

## Tema visual

O módulo usa dark mode alinhado ao Wokibi:

| Token | Cor |
|-------|-----|
| Background | `#0D0D12` |
| Card | `#1C1C26` |
| Purple accent | `#9333EA` |
| Border | `#2D2D3A` |

Configure as cores no `tailwind.config.ts` ou adapte para o design system existente.

## Chat — duas visões

```tsx
// Visão do desenvolvedor (lista administrativa)
<SolicitacaoChat visao="desenvolvedor" autorNome="Equipe Wokibi" ... />

// Visão do usuário (notificações / detalhe da solicitação)
<SolicitacaoChat visao="usuario" autorNome={usuario.nome} ... />
```

## Checklist de integração

- [ ] Copiar componentes e dependências
- [ ] Configurar `NEXT_PUBLIC_API_URL`
- [ ] Conectar FAB (+) ao `SolicitacaoModal` com paciente do contexto
- [ ] Adicionar link "Lista de Solicitações" na sidebar
- [ ] Integrar `NotificacoesPopover` no header
- [ ] Deploy da API ou merge das rotas no backend Wokibi
- [ ] Configurar storage de anexos (S3/Cloudinary em produção)
