<!-- Mirror of CLAUDE.md. Keep in sync. -->
# CLAUDE.md — AI Agent Instructions

Read fully before changing code. Then read `RULES.md`.
These two files override your defaults. If unsure, ask — don't guess.

---

## Project

- **Name:** Glix Connect HR Portal
- **Domain:** Multi-tenant SaaS — employee documents & info management
- **Tenancy:** Shared schema + `org_id` + Postgres RLS on every tenant table
- **Actors:** `project_owner`, `org_admin`, `org_staff`, `org_viewer`
- **Tiers:** `free`, `pro`, `enterprise` (limits editable by project_owner at runtime)
- **Origin:** Replatform of a client's legacy system (see `docs/legacy-analysis/`)

---

## Stack (locked)

| Layer | Tech |
| :--- | :--- |
| Frontend | Next.js (App Router) + React |
| Backend | Fastify (Node.js 20) with direct `pg` driver + `@fastify/postgres` |
| Database | PostgreSQL 16 (self-hosted / local) |
| Auth | NextAuth v5 (Phase 1) + JWT carries `org_id` + `role` |
| Storage | Local VPS filesystem (`UPLOAD_DIR`) + `attachments` table |
| UI | Tailwind + shadcn/ui |
| Validation | Zod (shared frontend + backend) |
| Tests | Vitest (unit) + Playwright (E2E) |
| CI | GitHub Actions |
| Hosting | Vercel (frontend) + VPS / Self-hosted (backend + db) |
| Monorepo | pnpm workspaces (`frontend/`, `backend/`, `shared/`) |

---

## Commands

```bash
# Setup
pnpm install && cp .env.example .env.local

# Dev
pnpm dev                    # all workspaces in parallel
pnpm --filter frontend dev  # frontend only
pnpm --filter backend dev   # backend only

# Quality
pnpm typecheck              # TS everywhere
pnpm lint                   # ESLint everywhere
pnpm format                 # Prettier write
pnpm test                   # unit tests
pnpm test:e2e               # Playwright

# DB
pnpm db:migrate             # run migrations via scripts/migrate.ts
pnpm db:seed                # run seed via scripts/seed.ts
```

---

## Architecture

- **Apps:** `frontend/` (UI only), `backend/` (API + business logic)
- **Shared:** `shared/` — config, types, schemas, utils (imported by both)
- **Request flow:** UI → Fastify route → Zod validate → service → DB (RLS) → response
- **Auth:** NextAuth / JWT → frontend sends `Authorization: Bearer <jwt>` → backend verifies → sets session variables (`app.user_id`, `app.org_id`, etc.) via `withTenant`
- **RLS is the safety net:** even a buggy backend cannot cross tenants
- **Database:** Self-hosted PostgreSQL 16. Fastify uses raw `pg` queries. RLS reads `current_setting('app.*')` set by `db.plugin.ts`.
- **Database Superuser:** only migrations, seeds, admin maintenance. **Never** in user requests. **Never** in frontend.
- See `ARCHITECTURE.md` and `docs/architecture/tenant-isolation.mermaid`.

---

## Non-negotiable rules (details in `RULES.md`)

- RLS on every table — no exceptions (§2)
- Every tenant query filters `org_id = current_org_id()` (§2)
- Database superuser role server-side only (§2)
- Zod validation on every input (§5)
- Tier limits enforced **server-side** (§9)
- Migrations reversible; never edit after push (§1)
- No `any` without `// why:` comment (§3)
- Files ≤ 250 lines; functions ≤ 50 lines (§3)
- Bug fix starts with a failing test (§4)
- No direct commits to `main` (§7)

---

## Domain

Read `GLOSSARY.md` + `DATA_MODEL.md`.

Core entities: `Organization`, `User`, `Membership`, `Employee`,
`Document`, `DocumentType`, `DocumentVersion`, `Tier`, `Subscription`,
`AuditLog`, `Attachment`.

---

## Config — where to look

| Concern | File |
| :--- | :--- |
| App name, URLs | `shared/config/app.config.ts` |
| Currency, language, dates | `shared/config/locale.config.ts` |
| Colors, logo, brand | `shared/config/brand.config.ts` |
| Feature flags (global) | `shared/config/features.config.ts` |
| Env vars + validation | `shared/config/env.ts` |
| Tier limits (per-tenant) | `shared/config/tiers.config.ts` |
| RBAC matrix | `shared/config/permissions.config.ts` |

**Rule:** if it's user-editable, it's config. If it's a secret, it's env. Never mix.

---

## Tier model (summary)

- `shared/config/tiers.config.ts` is the single source of truth.
- All checks go through `canDo(orgId, action, resource)` in `shared/`.
- Client reads flags for UI hints only — **never** for security.
- Downgrades block new writes; never delete data.

---

## What NOT to do

- ❌ Query without `org_id` filter
- ❌ Client-side-only permission or tier checks
- ❌ `any` without `// why:` comment
- ❌ Manual DB edits on shared environments
- ❌ Secrets in client code or committed `.env` files
- ❌ Direct commits to `main`
- ❌ Files > 250 lines or functions > 50 lines
- ❌ Using superuser db role for user-initiated requests
- ❌ Inline styles (use Tailwind tokens)

---

## Verification before marking a task complete

Run and pass **all** of these:

- [ ] `pnpm typecheck`
- [ ] `pnpm lint`
- [ ] `pnpm test`
- [ ] Playwright E2E added for new user flow (if UI)
- [ ] RLS policy added + tested (if new table)
- [ ] `org_id` present, indexed, RLS-covered (if tenant table)
- [ ] Tier limit enforced server-side (if feature is gated)
- [ ] `DATA_MODEL.md` updated (if schema changed)
- [ ] `CHANGELOG.md` updated (if user-facing)
- [ ] No new `any`, no new files > 250 lines
- [ ] Commit message follows Conventional Commits

If you can't tick every box, say what's missing. Don't fake completion.

---

## When in doubt

1. Re-read `RULES.md`
2. Search for existing patterns in the codebase
3. Prefer consistency over cleverness
4. Ask before making architectural decisions
5. If a rule blocks you for a good reason, propose an amendment — don't silently violate

**Length discipline:** this file stays under 220 lines. If it grows, move detail into linked docs.
