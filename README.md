# Dikriana — Personal Developer Portfolio

Production-oriented personal portfolio for Dikriana, an Informatics Engineering student with a Computer and Network Engineering background and verified IT Support internship experience. The interface presents capabilities through evidence rather than arbitrary percentages.

## Highlights

- Evidence-based Capability Explorer with filtering, search, relationship map, and detail panels
- Project system that keeps demo records out of the public portfolio
- Ask Dikriana: optional local Ollama integration with a deterministic, grounded fallback
- Accessible keyboard navigation, command palette, responsive layouts, and reduced-motion support
- Secure Express API, SQLite contact storage, validation, rate limiting, and production headers

## Stack

React 19, TypeScript strict, Vite, Node.js, Express, SQLite, Zod, Helmet, Vitest, and ESLint.

## Quick start

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Development UI: `http://127.0.0.1:5173` (API diproxy ke port 3000).

```powershell
npm run build
npm run start
```

Production: `http://127.0.0.1:3000`.

## Personalize

Cari `TODO: USER_DATA_REQUIRED`. CV, LinkedIn, production domain, school name, and real project case studies are intentionally not invented. Screenshots can be added under `public/projects/`.

## Architecture

The browser only calls the portfolio backend. Contact messages are stored locally in SQLite and are never exposed through a read endpoint.

```text
Browser → Express API → SQLite
                  └──→ Ollama at 127.0.0.1:11434 (optional)
```

Ollama is never exposed to the browser or proxied wholesale. The assistant receives only structured public portfolio knowledge, has no tools or filesystem access, and does not store conversations.

## Optional Ollama setup

Install Ollama separately and pull a small model manually. The project never downloads a model automatically. Configure `.env`:

```env
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=
OLLAMA_TIMEOUT_MS=15000
```

When `OLLAMA_MODEL` is empty, the backend selects the smallest locally listed model. If Ollama is unavailable, Ask Dikriana continues with verified deterministic answers.

## Quality checks

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm audit
```

See `docs/` for security, Windows operation, and the future Cloudflare Tunnel plan. No website deployment is included.

## Screenshots

Screenshots will be added after final personal assets and real project case studies are available.
