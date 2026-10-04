# YourApp

> Multi-tenant SaaS for employee documents & info management.

[![CI](https://github.com/your-org/your-app/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/your-app/actions/workflows/ci.yml)
![Status](https://img.shields.io/badge/status-under%20development-orange)
![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
![pnpm](https://img.shields.io/badge/pnpm-%3E%3D9-blue)

---

## What it is

A SaaS where organizations sign up, invite staff, and manage employee
records and documents in an isolated, secure workspace. A project owner
controls tier limits, feature gates, and pricing globally at runtime.

Built as a modern replatform of a legacy system — see
`docs/legacy-analysis/` (added in a later step).

---

## Actors

| Actor | Scope | Capabilities |
| :--- | :--- | :--- |
| **Project Owner** | Global | Edit tiers, feature flags, pricing, global config |
| **Org Admin** | Per-org | Manage employees, documents, members, billing |
| **Org Staff** | Per-org | View/update own profile and documents |
| **Org Viewer** | Per-org | Read-only access |

---

## Features

- **Tenancy** — org signup, isolated workspaces, Postgres RLS, per-org JWT claims
- **Employees** — records, custom fields (planned), status, bulk import (planned)
- **Documents** — upload, versioning, types, signed URLs, audit log
- **RBAC** — owner / admin / staff / viewer, per-org
- **Tiers** — free + pro, editable limits, server-side enforcement
- **Owner panel** — edit tiers, feature flags, pricing
- **Audit** — login, doc access, role/tier changes, data imports

---

## Tech stack

| Layer | Technology |
| :--- | :--- |
| Frontend | Next.js (App Router) + React |
| Backend | Fastify (Node.js 20) |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth (email + OAuth) |
| Storage | Supabase Storage (signed URLs) |
| UI | Tailwind + shadcn/ui |
| Validation | Zod (shared FE + BE) |
| Tests | Vitest + Playwright |
| CI/CD | GitHub Actions |
| Hosting | Vercel (frontend) + Fly/Railway (backend) |
| Monorepo | pnpm workspaces |

---

## Getting started

### Prerequisites

- Node.js `>=20.0.0` (use `nvm use`)
- pnpm `>=9.0.0`
- A Supabase project (added Step 3)

### Install

```bash
git clone git@github.com:your-org/your-app.git
cd your-app
nvm use
pnpm install
cp .env.example .env.local
# fill in Supabase keys (see .env.example)
```

### Run

```bash
pnpm dev
```

- Frontend → http://localhost:3000
- Backend  → http://localhost:4000
- Health   → http://localhost:4000/health

---

## Project structure

```
your-app/
├── frontend/     # Next.js (App Router)
├── backend/      # Fastify (Node.js)
├── shared/       # Config, types, schemas, utils (used by both)
├── docs/         # Architecture, ADRs, runbooks (Step 4+)
├── prompts/      # Reusable AI prompts (Step 4)
├── sample-data/  # Fixtures and seed CSVs
├── .github/      # CI, PR template, CODEOWNERS
├── CLAUDE.md     # AI agent instructions
├── RULES.md      # Non-negotiable rules
├── ARCHITECTURE.md
├── DATA_MODEL.md
├── UI_SPEC.md
└── README.md
```

---

## Available commands

| Command | Purpose |
| :--- | :--- |
| `pnpm dev` | Run all workspaces in dev |
| `pnpm build` | Build all workspaces |
| `pnpm typecheck` | TypeScript check everywhere |
| `pnpm lint` | ESLint everywhere |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm format` | Prettier write |
| `pnpm format:check` | Prettier check (CI) |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm test:e2e` | E2E tests (Playwright) |
| `pnpm clean` | Remove all build artifacts |

---

## Environment variables

See `.env.example`. Copy to `.env.local` and fill in.

| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Public | Frontend base URL |
| `NEXT_PUBLIC_API_URL` | Public | Backend base URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Admin ops, migrations |
| `DATABASE_URL` | **Server only** | Postgres connection |
| `BACKEND_PORT` | Server | Fastify port |
| `CORS_ORIGIN` | Server | Allowed frontend origin |
| `LOG_LEVEL` | Server | Pino log level |

**Never commit `.env.local`.** Never expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend.

---

## Config, not code

Currency, brand, language, and feature flags live in `shared/config/*`:

| Concern | File |
| :--- | :--- |
| App name, URLs | `shared/config/app.config.ts` |
| Currency, language, dates | `shared/config/locale.config.ts` |
| Colors, logo | `shared/config/brand.config.ts` |
| Feature flags | `shared/config/features.config.ts` |

Change them there — not in components.

---

## Documentation

| Doc | Purpose |
| :--- | :--- |
| `CLAUDE.md` | AI agent instructions |
| `RULES.md` | Non-negotiable rules |
| `ARCHITECTURE.md` | System design (Step 4) |
| `DATA_MODEL.md` | Schema reference (Step 4) |
| `UI_SPEC.md` | Design tokens + components (Step 4) |
| `SECURITY.md` | Security policy (Step 4) |
| `DEPLOYMENT.md` | Deploy runbook (Step 4) |
| `CHANGELOG.md` | Release notes |
| `docs/adr/` | Architecture decisions |

---

## Contributing

See `CONTRIBUTING.md` (Step 4). Short version:

1. Branch from `main`: `feat/short-desc`
2. Commit: Conventional Commits
3. Open PR — fill the template
4. CI must pass; one approval required
5. Squash merge

---

## Security

See `SECURITY.md`. Report vulnerabilities to `security@yourapp.com`.

---

## License

Proprietary. See `LICENSE`.

---

## Support

- Issues: [GitHub Issues](https://github.com/your-org/your-app/issues)
- Email: `support@yourapp.com`