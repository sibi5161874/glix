# RULES.md — Non-Negotiable Rules

Every rule here has burned someone before.
Cite section numbers in PRs, reviews, and AI prompts.
Do not violate without explicit written approval from the project owner.

---

## §1 Database & Migrations

- Never edit a migration after it has been pushed to a shared branch.
- Every migration must be reversible: `UP` and `DOWN`.
- Never edit schema via the Supabase dashboard on shared environments.
- Every tenant table must have:
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE`
  - `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
  - `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- Index every foreign key.
- Index every `(org_id, ...)` query path.
- Multi-step migrations run inside a transaction.
- Run migration drift check before every push.
- Seed data lives in `supabase/seed.sql` — never inline in migrations.

---

## §2 Security & Tenancy

- **RLS enabled on every table. No exceptions.**
- Every tenant query filters `org_id = auth.jwt()->>'org_id'`.
- `service_role` key:
  - Only in backend server code
  - Never in the frontend bundle
  - Never for user-initiated requests
  - Used only for: migrations, seeds, admin crons
- Every route/server action validates input with Zod.
- Every user-facing route enforces: auth → membership → permission.
- Cross-tenant access = **Critical** bug, P0, fix before anything else.
- Document access uses **signed URLs** with short TTL. No public buckets.
- Every document download is written to `audit_log`.
- Rate limit all public endpoints.
- Secrets only via env vars. Never commit `.env.local`.
- PII columns documented in `SECURITY.md` (Step 4); encrypted at rest where applicable.
- All auth tokens verified on the backend. Never trust client claims.

---

## §3 Code Quality

- TypeScript strict mode. No exceptions.
- No `any` without `// why: <reason>` comment on the same line.
- No file exceeds **250 lines**.
- No function exceeds **50 lines**.
- No dead code. No circular dependencies.
- Comments explain **WHY**, not **WHAT**.
- No `console.log` in committed code (use `logger`).
- Imports use the `@app/shared/*` alias — never reach into `shared/` via relative paths from `frontend/` or `backend/`.

---

## §4 Testing

- Unit tests for all business logic (`shared/`, `backend/services/`).
- Integration tests for route handlers and server actions.
- Playwright E2E for every critical flow:
  - org signup
  - login (email + OAuth)
  - invite staff
  - employee create/edit
  - document upload/download
  - tier upgrade
  - owner tier edit
- Bug fix must start with a failing test that reproduces the bug.
- No merging to `main` with failing tests.
- Co-located tests: `foo.ts` + `foo.test.ts`.

---

## §5 API Design

- All inputs validated with Zod.
- All errors return consistent shape:
  ```json
  { "error": "human message", "code": "MACHINE_CODE", "details": {} }
  ```
- Pagination on all list endpoints (`page`, `limit`, max 100).
- No N+1 queries — use joins or RPCs.
- Idempotency keys for webhooks and payment callbacks.
- Version breaking changes (`/v1/...`).
- Health endpoint at `/health` returns `{ status, version, uptime }`.
- Every route has a request ID (`x-request-id`) for tracing.

---

## §6 Frontend

- Tailwind + shadcn/ui only. No one-off primitives.
- Design tokens from `UI_SPEC.md` (Step 4). No inline styles.
- No hardcoded colors, currency symbols, or languages — import from `shared/config`.
- Every form: client validation (RHF + Zod) AND server validation (Zod).
- Every screen handles: loading, empty, error, success states.
- Accessibility: proper labels, keyboard nav, focus rings, contrast.
- No `useEffect` for data fetching — use server components or React Query.
- No prop drilling beyond 2 levels — use context or composition.

---

## §7 Git & PR

- Conventional Commits: `type(scope): subject`
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- One logical change per PR.
- No direct commits to `main`. PRs only.
- PR template must be filled.
- Link the issue in the PR description.
- Commits pass `commitlint` (enforced by husky).
- Pre-push runs `pnpm typecheck` (enforced by husky).

---

## §8 Deployment

- Migrations applied **before** code deploy. Never after.
- All env vars set in the host **before** deploy.
- Rollback plan documented per release in `DEPLOYMENT.md`.
- Smoke test after every deploy (login, list employees, upload doc).
- Monitor for 15 minutes after deploy before closing the release.
- No deploy on Friday after 4pm IST unless critical.

---

## §9 Tier & Plan Rules

- `config/tiers.config.ts` is the single source of truth.
- Enforcement is **server-side only**. Client flags = UI hints.
- Every limit check goes through `canDo(orgId, action, resource)`.
- Owner tier edits are audit-logged with old + new values.
- Downgrades **never delete data** — they block new writes only.
- Grace period logic documented in `DECISIONS.md` (Step 4).
- Free-tier abuse protection: rate limits + signup throttling.

---

## §10 Legacy Analysis & Replatform

- Source: client's legacy app. Goal: **feature parity + data integrity**.
- Extract: flows, fields, roles, states, business rules, reports.
- Do NOT ship: legacy branding, logos, marketing copy, dead code.
- All findings live in `docs/legacy-analysis/`:
  - `feature-inventory.md`
  - `user-flows.md`
  - `data-shapes.md`
  - `field-mapping.md` (legacy → new schema)
  - `gaps.md` (deliberately dropped or deferred)
- Every migrated table requires a documented mapping.
- Never import legacy data without a dry-run + row-count check.
- Legacy credentials never stored in repo. Use `.env.local`.

---

## §11 Domain / Compliance

- Employee documents may contain PII. Encrypt at rest.
- Retention per `config/document-types.config.ts`.
- Right-to-erasure flow documented in `SECURITY.md`.
- Audit log captures: login, logout, doc view, doc download, role change, tier change, member invite, data import.
- All audit entries are append-only. Never UPDATE or DELETE from `audit_log`.

---

## §12 Anti-Patterns (Banned)

- ❌ Query without `org_id` filter
- ❌ Client-only permission checks
- ❌ Public storage buckets
- ❌ Unbounded queries (always paginate)
- ❌ Silent `catch` blocks
- ❌ Hardcoded tier limits in UI
- ❌ Copying legacy UI verbatim
- ❌ Importing legacy data without a mapping doc
- ❌ Editing migrations after push
- ❌ `service_role` key in frontend
- ❌ `any` without justification
- ❌ Direct commits to `main`
- ❌ Files > 250 lines / functions > 50 lines
- ❌ Inline styles

---

## §13 Amendments

Rules change by PR to this file only. Every amendment:

1. Links to the incident or decision that motivated it
2. Is numbered with an effective date
3. Is announced in `CHANGELOG.md`

No silent edits.
