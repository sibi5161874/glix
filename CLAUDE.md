# CLAUDE.md — AI Agent Instructions

Read fully before changing code. Then read `RULES.md`.
These two files override your defaults. If unsure, ask — don't guess.

---

## Project

- **Name:** YourApp
- **Domain:** Multi-tenant SaaS — employee documents & info management
- **Tenancy:** Shared schema + `org_id` + Postgres RLS on every tenant table
- **Actors:** `project_owner`, `org_admin`, `org_staff`, `org_viewer`
- **Tiers:** `free`, `pro` (limits editable by project_owner at runtime)
- **Origin:** Replatform of a client's legacy system (see `docs/legacy-analysis/`)

---

## Stack (locked)

| Layer | Tech |
| :--- | :--- |
| Frontend | Next.js (App Router) + React |
| Backend | Fastify (Node.js 20) |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth (email + OAuth), JWT carries `org_id` + `role` |
| Storage | Supabase Storage (signed URLs only) |
| UI | Tailwind + shadcn/ui |
| Validation | Zod (shared frontend + backend) |
| Tests | Vitest (unit) + Playwright (E2E) |
| CI | GitHub Actions |
| Hosting | Vercel (frontend) + [Fly/Railway] (backend) |
| Monorepo | pnpm workspaces (`frontend/`, `backend/`, `shared/`) |

---

## Commands

```bash
# Setup
nvm use && pnpm install && cp .env.example .env.local

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

# DB (added Step 7)
pnpm db:migrate
pnpm db:seed
pnpm db:reset
```

---

## Architecture

- **Apps:** `frontend/` (UI only), `backend/` (API + business logic)
- **Shared:** `shared/` — config, types, schemas, utils (imported by both)
- **Request flow:** UI → Fastify route → Zod validate → service → DB (RLS) → response
- **Auth:** Supabase issues JWT → frontend sends `Authorization: Bearer <jwt>` → backend verifies → uses user JWT for DB calls
- **RLS is the safety net:** even a buggy backend cannot cross tenants
- **`service_role` key:** only migrations, seeds, admin crons. **Never** in user requests. **Never** in frontend.
- See `ARCHITECTURE.md` (Step 4) and `docs/architecture/tenant-isolation.mermaid`.

---

## Non-negotiable rules (details in `RULES.md`)

- RLS on every table — no exceptions (§2)
- Every tenant query filters `org_id = auth.jwt()->>'org_id'` (§2)
- `service_role` key server-side only (§2)
- Zod validation on every input (§5)
- Tier limits enforced **server-side** (§9)
- Migrations reversible; never edit after push (§1)
- No `any` without `// why:` comment (§3)
- Files ≤ 250 lines; functions ≤ 50 lines (§3)
- Bug fix starts with a failing test (§4)
- No direct commits to `main` (§7)

---

## Domain

Read `GLOSSARY.md` + `DATA_MODEL.md` (Step 4).

Core entities: `Organization`, `User`, `Membership`, `Employee`,
`Document`, `DocumentType`, `DocumentVersion`, `Tier`, `Subscription`,
`AuditLog`.

---

## Config — where to look

| Concern | File |
| :--- | :--- |
| App name, URLs | `shared/config/app.config.ts` |
| Currency, language, dates | `shared/config/locale.config.ts` |
| Colors, logo, brand | `shared/config/brand.config.ts` |
| Feature flags (global) | `shared/config/features.config.ts` |
| Env vars + validation | `shared/config/env.ts` |
| Tier limits (per-tenant) | `config/tiers.config.ts` (Step 7) |
| RBAC matrix | `config/permissions.config.ts` (Step 7) |

**Rule:** if it's user-editable, it's config. If it's a secret, it's env. Never mix.

---

## Tier model (summary)

- `config/tiers.config.ts` is the single source of truth.
- All checks go through `canDo(orgId, action, resource)` in `shared/`.
- Client reads flags for UI hints only — **never** for security.
- Downgrades block new writes; never delete data.

---

## Common tasks

See `PROMPTS.md` (Step 4). Use the prompt for the task, don't improvise:

- `prompts/feature-add.md`
- `prompts/bug-fix.md`
- `prompts/refactor.md`
- `prompts/migration-create.md`
- `prompts/security-review.md`
- `prompts/code-review.md`
- `prompts/legacy-analysis.md`

---

## Skills (multi-step workflows)

See `SKILLS.md` (Step 4): `add-module`, `add-role`, `add-doc-type`,
`seed-tenant`, `import-legacy-analysis`, `deploy`.

---

## What NOT to do

- ❌ Query without `org_id` filter
- ❌ Client-side-only permission or tier checks
- ❌ `any` without `// why:` comment
- ❌ Manual DB edits via Supabase dashboard (production)
- ❌ Secrets in client code or committed `.env` files
- ❌ Copying legacy app's branding / copy / logos verbatim
- ❌ Direct commits to `main`
- ❌ Files > 250 lines or functions > 50 lines
- ❌ Importing legacy data without a mapping doc
- ❌ Using `service_role` key for user-initiated requests
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
