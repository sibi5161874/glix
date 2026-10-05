# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- Step 1: Foundation — monorepo, TypeScript strict, ESLint, Prettier,
  Husky, commitlint, CI workflow, `@app/shared` package, env validation,
  brand/locale/feature config, Result type, structured logger.
- Step 2: AI + team docs — `CLAUDE.md`, `AGENTS.md`, `RULES.md`,
  full `README.md`, `CHANGELOG.md`.
- Step 3: Supabase setup — baseline schema, migrations (001-007), custom JWT
  claims hook, RLS policies on all tables, private storage bucket, seed data,
  and tenant isolation verification script.
- Step 4: Documentation block — `ARCHITECTURE.md`, `DATA_MODEL.md`, `UI_SPEC.md`,
  and 5 core architecture diagrams (`system-overview`, `data-flow`, `auth-flow`,
  `entity-relationships`, `tenant-isolation`).
- Added Global Backend Engineering Constitution (`.agents/rules/backend-constitution.md`) and Global Engineering Constitution (`.agents/rules/engineering-constitution.md`).
- Step 5: Migrated off Supabase — self-hosted PostgreSQL 16, direct `pg` driver via `@fastify/postgres`, NextAuth v5 + Fastify JWT verification replacing Supabase Auth, VPS filesystem (`UPLOAD_DIR` + `attachments` table) replacing Supabase Storage. See `docs/adr/002-self-hosted-postgres.md`.
- Phase 1 (Auth + Tenancy): `/login` (dual email+password / employee-code+DOB), `/register` (4-step wizard), `/superadmin/login`, app shell (sidebar + topbar) and superadmin shell with empty dashboards. Backend: JWT sign/verify (`argon2` password hashing, `jsonwebtoken`), `POST /v1/auth/register`, `POST /v1/auth/login`, `GET /v1/auth/me`, global Fastify error handler matching `RULES.md` §5's envelope. Frontend: NextAuth v5 Credentials provider bridging to the backend JWT, middleware route protection, hand-built shadcn/ui primitives (shadcn CLI hung non-interactively in this environment — see `UI_SPEC.md` §1), Tailwind tokens wired to `UI_SPEC.md` §0.1. Migrations `019`–`023` add the `SECURITY DEFINER` lookup/signup functions pre-auth flows need (RLS can't be satisfied before a session exists) — see `DATA_MODEL.md` migration timeline.
- Phase 0 (Basement): migrations `008`–`018` — `platform_users`/`platform_settings`/`notification_templates`, `plans` (+ `organizations.plan_id`), `departments`/`designations`/`employees`, leave engine (`leave_types`/`leave_balances`/`leave_requests`/`holidays`), `document_types`/`documents`, `loans`, `announcements`, billing bridge (`subscriptions`/`invoices`), `support_tickets`, org-creation seeding trigger (default leave/document types), and database-level audit triggers on sensitive tables. `db/seed.sql` now seeds `platform_users` (not the Supabase-era `project_owners`, which was never part of the real schema) plus a demo org and employees.

### Changed
- `README.md` — replaced placeholder with full project documentation.
- `package.json` — added database management and verification scripts (`db:*`).
- `.agents/rules/backend-constitution.md` — rewritten to match the locked stack (raw `pg`, no ORM, no Redis/BullMQ) and the 250/50-line limits from `RULES.md` §3.
- `DEPLOYMENT.md`, `docs/adr/001-initial-architecture.md`, `docs/legacy-analysis/04-data-shapes.md`, `docs/legacy-analysis/08-gaps.md`, `docs/legacy-analysis/09-open-questions.md`, `docs/legacy-analysis/10-redesign-notes.md`, `docs/legacy-analysis/11-parity-matrix.md`, `docs/legacy-analysis/12-new-user-flows.md`, `docs/legacy-analysis/13-migration-plan.md` — removed stale Supabase references, replaced with self-hosted PostgreSQL 16 + VPS filesystem + NextAuth/JWT.
- `shared/config/brand.config.ts` — primary color changed to `#F57C00` to match `UI_SPEC.md` (legacy app's orange).
- `db/migrations/007_storage_buckets.sql` renamed to `007_attachments.sql` — filename now matches its actual content (VPS filesystem attachment metadata, not storage buckets).

### Security
- Env validation via Zod at runtime boundaries (`shared/config/env.ts`).
- Enforced PostgreSQL Row Level Security (RLS) across all tenant tables and private storage buckets.
- Append-only `audit_log` with database trigger blocking updates and deletes.
- **Fixed — RLS table-owner bypass.** `glix_user` (table owner, ran migrations) was also the backend's runtime DB role; PostgreSQL exempts owners from their own RLS policies, so RLS provided no actual tenant isolation — verified empirically (a bogus `app.org_id` still returned every row). Fixed via migration `020_roles.sql`: `glix_app`, a non-owner role with only row-level DML grants, is now the backend's runtime role (`DATABASE_URL`); `glix_user` is kept as the migrations/seed-only role (`DATABASE_URL_MIGRATE`). Migration `019_users_insert_policy.sql` also added the `INSERT` policy `006_rls_policies.sql` was missing for `users`, plus a `SECURITY DEFINER` `create_user()` function for the signup path. `pnpm verify:rls` (`scripts/verify-rls.ts`) now proves cross-tenant isolation empirically — two fixture orgs' employees are confirmed mutually invisible under `glix_app`. See `SECURITY.md` §2 and `ARCHITECTURE.md` §5.

---

## How to update this file

- Add entries under `## [Unreleased]` as you merge PRs.
- Group under: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
- On release: rename `[Unreleased]` → `[x.y.z] - YYYY-MM-DD` and add a fresh `[Unreleased]`.
- One line per meaningful change. Link PRs when useful.
