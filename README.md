# Dikriana — Personal Developer Portfolio

Production-oriented personal portfolio for Dikriana, an Informatics Engineering student with a Computer and Network Engineering background and verified IT Support internship experience. Capabilities are presented through evidence rather than arbitrary percentages.

> Screenshot: a final portfolio screenshot will be added after personal visual assets and the first verified project case study are available.

## Purpose and current status

The site presents a credible professional profile, evidence-based capabilities, education, certification, and verified experience. Public project case studies are intentionally empty until real project data is supplied; demo records remain internal placeholders and are never shown as completed work.

GitHub and email are active. LinkedIn, CV, profile photo, and real project case studies retain clear unavailable states rather than fabricated content. The frontend is published with GitHub Pages at `https://dikri-shadow.github.io/Portfolio/` and configured to use `https://dikri.thedev.id` after its DNS registration is approved.

## Highlights

- Evidence-based Capability Explorer with search, category filters, relationship map, and detail panels
- Reusable project case-study schema with optional sections and public/private/no-repository handling
- Ask Dikriana with deterministic-first answers, focused local Ollama context, and a grounded fallback
- Accessible keyboard navigation, Ctrl+K command palette, responsive layouts, reduced-motion support, focus states, and skip navigation
- Secure Express API, SQLite contact storage, validation, rate limiting, security headers, and production-safe logging

## Technology stack

- Frontend: React 19, TypeScript strict, Vite
- Backend: Node.js, Express, Zod
- Storage: SQLite with prepared statements, WAL, UUIDs, and timestamps
- Security: Helmet, CSP, request-size limits, rate limiting, validation, normalization, honeypot, and human challenge
- Quality: Vitest, ESLint, TypeScript, production build checks, and dependency audit

## Local development

Requirements: Node.js 20 or newer. Ollama is optional.

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Development UI: `http://127.0.0.1:5173` with API requests proxied to port 3000.

## Production architecture

```text
Browser → Express at 127.0.0.1:3000 → SQLite
                                   └→ Ollama at 127.0.0.1:11434 (optional)
```

```powershell
npm run build
npm run start
```

The production server binds only to `127.0.0.1`. The contact API writes locally to SQLite, and there is no public endpoint for reading messages.

## Capability Explorer

Capabilities are grouped by category and supported by concrete evidence from verified experience, education, or this codebase. Learning items are labeled separately. The UI deliberately avoids percentages and unsupported claims of external production experience.

## Ask Dikriana

Common portfolio questions are answered by a verified deterministic engine without invoking an LLM. Natural questions use the smallest suitable locally installed Ollama model with only the relevant knowledge category. Answers are limited to short recruiter-friendly responses.

```env
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3:1.7b
OLLAMA_TIMEOUT_MS=20000
```

The project never downloads models automatically. Ollama is loopback-only, is not exposed to the browser, receives no contact records, and has no tools, shell, filesystem, environment, database, or arbitrary URL access. Timeout, offline, empty, and invalid responses fall back to deterministic verified answers without exposing raw errors.

## Project case studies

The reusable schema supports Overview, Role, Problem, Solution, Architecture, Tech Stack, Key Features, Challenges, What I Learned, Gallery, Live Demo, and Repository. Every detail section is optional and hidden when empty. Repository visibility accepts `public`, `private`, or `none`; private repositories render a clear non-link state.

Add only verified projects in `src/data/projects.ts` and place approved images under `public/projects/`. Do not remove the placeholder marker until every claim and link is verified.

## Security overview

- Contact data remains local and is excluded from Git
- `.env`, databases, WAL files, logs, build artifacts, coverage, and local configuration are ignored
- Contact requests use validation, normalization, a 16 KB body limit, and rate limiting
- Production responses omit raw stack traces and sensitive headers
- The assistant rejects requests for prompts, commands, files, environment data, credentials, and unrelated actions

More detail is available in `docs/SECURITY.md`.

## Accessibility

The interface includes semantic landmarks, keyboard navigation, visible focus states, modal focus management, Escape-to-close behavior, responsive mobile layouts, accessible empty/disabled states, a skip link, and reduced-motion support.

## Testing

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm audit
```

The test suite covers API validation, contact handling, assistant grounding and fallback, prompt-injection rejection, capability data, and content integrity.

## Deployment notes

The GitHub Pages deployment is a static frontend build. Relative Vite asset URLs allow the same artifact to work at the temporary `/Portfolio/` project URL and at the custom domain without changing local development.

GitHub Pages does not run Express, SQLite, or Ollama. In the static build, Ask Dikriana uses grounded deterministic portfolio data in the browser, server status is labeled as static, and contact submissions direct visitors to email. Local and self-hosted production builds retain the Express health API, SQLite contact storage, and local Ollama integration unchanged.

The repository does not contain Cloudflare credentials, contact messages, database files, environment files, or production secrets.

## Windows laptop server

The production server and Quick Tunnel can start automatically after Windows sign-in through two separate Scheduled Tasks:

- `DikrianaPortfolio` runs `scripts/start-portfolio.ps1`
- `DikrianaPortfolioTunnel` runs `scripts/start-tunnel.ps1`

Both scripts prevent duplicate portfolio-specific processes. The tunnel waits for `/api/health`, records logs under the ignored `logs/` directory, and stores its current temporary URL in the ignored `runtime/public-url.txt` file.

Check local health and the latest tunnel URL:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-health.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\show-public-url.ps1
```

Quick Tunnel URLs are temporary and normally change whenever `cloudflared` restarts. The laptop must remain powered on, signed in, awake, and connected to the internet. A stable hostname requires a separate future domain and Named Tunnel phase.

## Remaining portfolio content

- Add verified project case studies and screenshots
- Add the final CV when available
- Add LinkedIn and a profile photo only when supplied
- Choose a production domain and deployment method in a separate phase
