<div align="center">
  <img src="public/logo.png" alt="Lucidexis logo" width="160" />
</div>

# Lucidexis UI

Frontend for **Lucidexis** — document management, semantic search, and an AI assistant.

Backend API: [aquadros1003/lucidexis](https://github.com/aquadros1003/lucidexis)

## Tech stack

| Layer | Stack |
| --- | --- |
| UI | React 19, TypeScript, Sass |
| Routing | React Router 7 |
| Data fetching | TanStack Query |
| AI chat | `@assistant-ui/react`, WebSocket |
| i18n | i18next / react-i18next (PL, EN) |
| Markdown | react-markdown, remark-gfm |
| Build | Vite 7, `@vitejs/plugin-react`, `vite-plugin-svgr` |
| Code quality | ESLint 9, Prettier, TypeScript ESLint |
| Deploy | Docker (multi-stage: Node 22 → nginx) |

## Requirements

- Node.js **22+** (recommended)
- npm
- a running [Lucidexis API](https://github.com/aquadros1003/lucidexis) (local or remote)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Environment variables
cp .env.example .env
```

In `.env`, set the API base URL (no trailing slash):

```env
VITE_API_BASE_URL=http://localhost
```

The client builds paths under `/api/v1` (`src/config.ts` → `API_V1`).

```bash
# 3. Dev server
npm run dev
```

The app starts on the Vite port (default `http://localhost:5173`).

### Docker

```bash
docker build --build-arg VITE_API_BASE_URL=http://localhost -t lucidexis-ui .
docker run -p 80:80 lucidexis-ui
```

Images are also published via GitHub Actions (`ghcr.io`) on `v*` tags.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite development server (HMR) |
| `npm run build` | `tsc -b` + production Vite build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint (with autofix) |

## Lint & formatting

Linting combines ESLint with Prettier (`eslint-plugin-prettier` — `prettier/prettier` as an error):

- TypeScript ESLint (recommended)
- React Hooks / React Refresh
- Prettier (`.prettierrc`: single quotes, trailing commas, tab width 2, print width 120)

```bash
npm run lint
```

## Project structure (overview)

```
src/
  api/          # HTTP client, TanStack Query hooks, schemas
  components/   # UI (documents, search, sidebar, assistant…)
  contexts/     # auth
  pages/        # routes (login, documents, search, profile…)
  locales/      # en / pl translations
  hooks/        # domain hooks
```

API requests go through `src/api/client.ts` (`fetchWithHeaders`) — including `Authorization: Bearer` and JSON headers.

## Related

- **API:** https://github.com/aquadros1003/lucidexis