# AI Integration Brief — Wokibi Help

> **Audience:** another AI agent integrating this module into an existing product (typically Wokibi or a similar Next.js/React app).
> **Human instruction:** give this file + the `apps/` folder to the AI and ask it to follow this brief end-to-end.

---

## 0. Mission

Integrate **Wokibi Help** into the host software so that:

1. End users can open a **new request modal** (FAB `+`) with requester + patient context prefilled.
2. Admins/devs can open a **request list** with filters, status/priority edits, notes, delete, and chat.
3. Users see a **notifications bell** for unread developer chat messages.
4. Backend persists requests, comments, and file uploads.

Do **not** rewrite the product from scratch. Prefer copy/adapt of the files listed below. Preserve API contracts and component props unless the host stack forces a thin adapter layer.

---

## 1. What this module is

Standalone monorepo demo of a **help/request desk**:

| Piece | Path | Role |
|-------|------|------|
| API | `apps/api` | Express + MongoDB + Multer uploads |
| Web demo | `apps/web` | Next.js 14 App Router UI (demo shell + real components) |

**Demo pages** (`apps/web/app/page.tsx`, `apps/web/app/solicitacoes/page.tsx`) show how pieces wire together. Reuse the **components/lib/types**, not necessarily the demo layout.

### Domain model (Portuguese field names — keep them)

- **Solicitação** = support/feature request tied to a patient context.
- **Comentário** = chat message (`autorTipo`: `desenvolvedor` | `usuario`).
- **Notificação** = comment from `desenvolvedor` with `lida: false`.

---

## 2. Integration strategy (choose one)

### Strategy A — API as separate service (recommended first)

1. Deploy/run `apps/api` with its own MongoDB.
2. Point host frontend `NEXT_PUBLIC_API_URL` (or equivalent) at that API.
3. Copy only frontend module files into the host app.

### Strategy B — Merge into host backend

1. Port models + routes from `apps/api/src` into the host API.
2. Keep the same URL paths under `/api/solicitacoes`, `/api/notificacoes` **or** introduce a single base-path adapter in `apps/web/lib/api.ts`.
3. Wire Multer (or host upload middleware) and static `/uploads`.

**Constraint:** if the host already uses auth, wrap these routes with the host auth middleware. This demo has **no authentication**.

---

## 3. Exact files to copy (frontend)

Copy these into the host app (adjust import aliases if needed; this repo uses `@/` → `apps/web`).

```
apps/web/components/
  SolicitacaoModal.tsx
  SolicitacaoCard.tsx
  SolicitacaoChat.tsx
  SolicitacaoFilters.tsx
  NotificacoesPopover.tsx
  FabButton.tsx
  StatusBadge.tsx
  ui/button.tsx
  ui/dialog.tsx
  ui/input.tsx
  ui/select.tsx
  ui/toggle-group.tsx

apps/web/lib/
  api.ts
  constants.ts
  utils.ts

apps/web/types/
  solicitacao.ts
```

Optional reference pages (do not require copying verbatim):

```
apps/web/app/page.tsx              # FAB + modal + notifications pattern
apps/web/app/solicitacoes/page.tsx # admin list + filters + chat pattern
```

Backend to run or port:

```
apps/api/src/
  index.ts
  config/db.ts
  middleware/upload.ts
  models/Solicitacao.ts
  models/Comentario.ts
  routes/solicitacoes.ts
  routes/comentarios.ts
  routes/notificacoes.ts
  types/index.ts
```

---

## 4. Dependencies to ensure in the host frontend

```json
{
  "@radix-ui/react-dialog": "^1",
  "@radix-ui/react-select": "^2",
  "@radix-ui/react-toggle-group": "^1",
  "@radix-ui/react-label": "^2",
  "@radix-ui/react-popover": "^1",
  "lucide-react": "^0.400",
  "clsx": "^2",
  "tailwind-merge": "^2",
  "tailwindcss": "^3"
}
```

Host must support **`'use client'`** components (Next.js App Router or equivalent client boundary).

Merge Tailwind tokens from `apps/web/tailwind.config.ts`:

```ts
wokibi: {
  bg: '#0D0D12',
  card: '#1C1C26',
  border: '#2D2D3A',
  purple: '#9333EA',
  'purple-light': '#A855F7',
  muted: '#9CA3AF',
  pending: '#F59E0B',
  progress: '#9333EA',
  done: '#10B981',
}
```

If the host has its own design system, map `wokibi-*` classes to host tokens — do not leave broken class names.

---

## 5. Environment

```env
# Frontend (host)
NEXT_PUBLIC_API_URL=https://<help-api-host>

# API
PORT=4000
MONGODB_URI=mongodb://...
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=8388608
CORS_ORIGIN=https://<host-frontend-origin>
```

`apps/web/lib/utils.ts` reads `API_URL` from `NEXT_PUBLIC_API_URL`. Keep that contract or update both `utils.ts` and callers.

---

## 6. Component contracts (use these props)

### `FabButton`

```tsx
<FabButton onClick={() => setOpen(true)} />
```

Floating action button. Place on screens where creating a request makes sense (e.g. patient view).

### `SolicitacaoModal`

```tsx
<SolicitacaoModal
  open={open}
  onOpenChange={setOpen}
  nomeSolicitanteDefault={usuario.nome}           // logged-in user
  pacienteDefault={{ nome: p.nome, prontuario: p.id }} // current patient context
  onSuccess={(solicitacao) => { /* toast / invalidate queries */ }}
/>
```

Creates via `POST /api/solicitacoes` as `multipart/form-data`.

### `NotificacoesPopover`

```tsx
<NotificacoesPopover />
```

Self-contained: fetches `GET /api/notificacoes?naoLidas=true` when opened. Put in header/nav.

### Admin list page pattern

Use:

- `fetchSolicitacoes(status)` + `fetchStats()`
- `SolicitacaoFilters`
- `SolicitacaoCard` with `onUpdate`, `onDelete`, `onOpenChat`
- `SolicitacaoChat` modal

```tsx
<SolicitacaoChat
  solicitacao={selected}
  visao="desenvolvedor" | "usuario"
  open={chatOpen}
  onOpenChange={setChatOpen}
  autorNome="Equipe Wokibi" // or current user name
/>
```

### Sidebar / nav link

Add a route equivalent to `/solicitacoes` (admin). Optionally show pending count from `GET /api/solicitacoes/stats` → `pendente`.

---

## 7. REST API contract (do not break)

Base: `{API_URL}`

| Method | Path | Body / notes |
|--------|------|----------------|
| GET | `/api/health` | health |
| GET | `/api/solicitacoes?status=` | `status`: `pendente` \| `em_andamento` \| `concluida` |
| GET | `/api/solicitacoes/stats` | `{ total, pendente, em_andamento, concluida }` |
| GET | `/api/solicitacoes/:id` | one request |
| POST | `/api/solicitacoes` | **multipart/form-data** (see fields) |
| PATCH | `/api/solicitacoes/:id` | JSON partial update |
| DELETE | `/api/solicitacoes/:id` | delete |
| GET | `/api/solicitacoes/:id/comentarios` | chat list |
| POST | `/api/solicitacoes/:id/comentarios` | JSON `{ autor, autorTipo, mensagem }` |
| PATCH | `/api/solicitacoes/:id/comentarios/:comentarioId/lida` | sets `lida: true` |
| GET | `/api/notificacoes?naoLidas=true` | unread dev comments |
| GET | `/uploads/...` | static files |

### POST `/api/solicitacoes` fields

| Field | Required | Notes |
|-------|----------|--------|
| `nomeSolicitante` | yes | string |
| `nomePaciente` | yes | string |
| `prontuarioPaciente` | no | string |
| `etiquetaPrincipal` | yes | `erro` \| `melhoria_feedback` \| `criacao_feature` \| `ajuda` |
| `etiquetaEspecifica` | no | see `lib/constants.ts` |
| `descricao` | yes | string |
| `prioridade` | no | `baixa` \| `media` \| `alta` (default `media`) |
| `anexos` | no | files, max 5, max 8MB each (image/video) |

Server derives `titulo` from etiquetas/descrição. Default `status` = `pendente`.

### Enums (locked)

- Status: `pendente` | `em_andamento` | `concluida`
- Prioridade: `baixa` | `media` | `alta`
- AutorTipo: `desenvolvedor` | `usuario`

Types of truth: `apps/web/types/solicitacao.ts` and `apps/api/src/types/index.ts`.

---

## 8. Host wiring steps (execute in order)

1. **Inventory host stack** — confirm React/Next (or adapt), Tailwind, Mongo availability, auth model.
2. **API** — Strategy A or B; ensure CORS allows the host origin; ensure `/uploads` is reachable from the browser (URLs returned in `anexos.url`).
3. **Copy frontend files** listed in §3; fix imports/`@/` alias.
4. **Install deps** + merge Tailwind `wokibi` colors (or remap).
5. **Env** — set `NEXT_PUBLIC_API_URL` / API Mongo + CORS.
6. **User surface** — mount `FabButton` + `SolicitacaoModal` where patient/user context exists; pass real `nomeSolicitanteDefault` and `pacienteDefault`.
7. **Admin surface** — add `/solicitacoes` (or host path) using the list page pattern.
8. **Header** — mount `NotificacoesPopover`.
9. **Nav** — link to the list; optional pending badge via `stats`.
10. **Verify** — create request with attachment → appears in list → change status → chat both sides → notification appears for unread dev messages.
11. **Production uploads** — demo stores files on local disk (`UPLOAD_DIR`). Replace with S3/Cloudinary/etc. if required; keep the `Anexo` shape `{ nome, url, tipo, tamanhoBytes }`.

---

## 9. Known gaps (fix or document during integration)

| Gap | Detail |
|-----|--------|
| Mark-as-read not wired in UI | `marcarComentarioLido` exists in `lib/api.ts` and `PATCH .../lida` exists in API, but `NotificacoesPopover` / `SolicitacaoChat` never call it. Notifications stay until something sets `lida: true`. **Recommended:** call `marcarComentarioLido` when user opens the related chat or clicks a notification. |
| No auth | Any client can hit the API. Add host auth before production. |
| No user scoping on notifications | `GET /api/notificacoes` returns all unread developer comments globally (demo). Scope by requester/user when auth exists. |
| Demo-only shell | Home page patient data is hardcoded (`PACIENTE_DEMO`). Replace with host context. |

---

## 10. Do / Don't for the integrating AI

**Do**

- Prefer adapting existing components over rewriting.
- Keep Portuguese API field names unless you add a deliberate translation layer (then update both API and `lib/api.ts`).
- Reuse `lib/constants.ts` etiquetas unless product owners change the taxonomy.
- Match host routing/auth/toast patterns at the **call sites**, not inside every leaf component unless necessary.

**Don't**

- Don't invent new endpoints that duplicate existing ones.
- Don't remove multipart upload without replacing storage.
- Don't drop the chat `visao` dual-mode without an equivalent UX.
- Don't commit secrets; use `.env` / `.env.example` patterns already in the repo.
- Don't treat `tsconfig.tsbuildinfo` as a source file to integrate.

---

## 11. Acceptance checklist

- [ ] API health OK from the host frontend origin (CORS).
- [ ] User can create a solicitação with patient context prefilled.
- [ ] Attachment upload works and preview/link resolves.
- [ ] Admin list filters by status; stats counts match.
- [ ] Admin can edit status, priority, notes; delete works.
- [ ] Chat works for `desenvolvedor` and `usuario`.
- [ ] Bell shows unread developer messages.
- [ ] (Recommended) Opening/reading a notification marks it read and clears the badge.
- [ ] Design tokens render correctly (no missing `wokibi-*` classes).
- [ ] Auth applied if host requires it.

---

## 12. Prompt template (human → AI)

Copy-paste:

```text
Integrate the Wokibi Help module into this repository.

Follow INTEGRATION.md exactly (mission, file list, API contract, wiring steps, known gaps).
Use Strategy A (separate API) unless this repo already has Express/Mongo — then prefer Strategy B.
Wire FabButton + SolicitacaoModal with our logged-in user and current patient context.
Add the admin solicitations page to our navigation.
Mount NotificacoesPopover in the header.
Wire marcarComentarioLido when the user opens the related chat.
Do not rewrite unrelated features. Keep API field names. Report files changed and how to run.
```
