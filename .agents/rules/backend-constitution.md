# ⚙️ BACKEND ENGINEERING CONSTITUTION — Glix Connect
## Fastify + raw `pg` · Version 2.0 (supersedes 1.0)

> **Scope:** Authoritative for `backend/` in this project only. It exists to prevent
> drift — not to be comprehensive. Where it's silent, follow `RULES.md` and
> `ARCHITECTURE.md`.
>
> **v2.0 note:** v1.0 assumed Prisma/Drizzle, Redis, BullMQ, and cookie-rotated
> refresh tokens. None of that matches this project's locked stack
> (`CLAUDE.md`). v2.0 replaces it — do not resurrect the removed sections.

---

## ⭐ THE GOLDEN RULE

> No library, pattern, or approach absent from this document or `CLAUDE.md`'s
> locked stack may be introduced — by anyone, including AI assistants —
> without updating this document first via an approved PR.

---

## 1 · APPROVED STACK (closed list)

| Layer | Choice | Notes |
|---|---|---|
| Runtime | Node.js 20 LTS | |
| Language | TypeScript, `strict: true` | |
| HTTP framework | Fastify 5 | The only HTTP framework. No Express/Koa/Hono. |
| DB driver | `pg` via `@fastify/postgres` | **No ORM.** No Prisma, no Drizzle. |
| Migrations | Plain `.sql` files in `db/migrations/`, run by `scripts/migrate.ts` | Forward-only, reversible in principle |
| Validation | `zod` | All input validation, every boundary |
| Auth | NextAuth v5 (frontend) issues JWT; backend verifies with `JWT_SECRET` | `Authorization: Bearer <jwt>` header — no cookie-based refresh rotation in the backend |
| Logging | Fastify's built-in `pino` | No `console.log` |
| Password hashing | `argon2` | `argon2id`, never plain/sha, never store raw DOB as a password hash |
| JWT sign/verify | `jsonwebtoken` | Signs/verifies with `JWT_SECRET`; claims per ARCHITECTURE.md §5 (`sub`, `email`, `orgId`, `role`, `employeeId`, `isPlatformAdmin`) |
| File upload | `@fastify/multipart` | Added Phase 2 for CSV bulk-import (`POST /v1/employees/import`). Streamed, size-capped. |
| Spreadsheet export | `exceljs` | Added Phase 2 for XLSX export (`GET /v1/employees/export`). No CSV-injection: numeric/date cells typed, not raw strings. |
| CSV parsing | hand-rolled (`backend/src/utils/csv.ts`) | No dependency — the import format is a fixed, known column set. |
| Testing | Vitest + `fastify.inject` | Playwright for E2E |
| Cache / Queue | **None in v1.** | Do not add Redis or BullMQ without a written proposal + update to this file first |

---

## 2 · READ BEFORE YOU WRITE

1. Read the route, service, repository, schema, and migration that already touch this feature.
2. If it partially exists, **extend it** — never duplicate a service/query/schema.
3. Never modify a file outside the current task.

---

## 3 · FOLDER STRUCTURE (as it exists in `backend/src/`)

```
backend/src/
├── index.ts              # bootstrap: load env, register plugins, listen
├── plugins/              # one Fastify plugin per concern
│   └── db.plugin.ts      # decorates fastify.withTenant(ctx, fn)
├── middleware/           # preHandler factories (e.g. requirePermission)
├── routes/
│   └── v1/
│       └── <domain>.routes.ts
├── controllers/          # thin HTTP layer, no DB, no business logic
├── services/             # business logic, no HTTP, no SQL
├── repositories/         # the only place that runs SQL
├── schemas/              # Zod request/response schemas, one file per domain
├── utils/
│   ├── errors.ts         # AppError + subclasses
│   └── http.ts           # sendSuccess / sendError helpers
└── tests/
    ├── unit/
    └── integration/
```

No new top-level folders without updating this document first.

---

## 4 · REQUEST LIFECYCLE

```
1. Fastify receives request
2. onRequest:      request ID, logging
3. preHandler:     JWT verify (auth), permission check
4. Zod validates params/query/body
5. Controller:     thin — calls service, returns via sendSuccess/sendError
6. Service:        business rules; calls repository; never touches request/reply
7. Repository:     fastify.withTenant(ctx, fn) — sets Postgres session vars
                    (app.user_id, app.org_id, app.role, app.employee_id,
                    app.is_platform_admin), runs the query inside a transaction
8. Response:       { data } or { error, code, details }
9. onSend / onResponse: audit log for sensitive actions
```

**Laws:**
- Controllers never touch the DB.
- Services never touch `request`/`reply`.
- Repositories never contain business rules.
- Every tenant-scoped repository method takes `RequestContext` (or org/user IDs) explicitly — never infer it.

---

## 5 · THE TENANT LAW

- Tenant context (`userId`, `orgId`, `role`, `employeeId`, `isPlatformAdmin`) is resolved once from the verified JWT, in a preHandler/auth plugin.
- Every tenant query runs through `fastify.withTenant(ctx, fn)` (see `backend/src/plugins/db.plugin.ts`), which sets the Postgres session variables that `006_rls_policies.sql`'s helper functions (`current_org_id()`, `current_role()`, etc.) read.
- **RLS is the real safety net** — even a backend bug that forgets a filter cannot cross tenants, per `RULES.md` §2.
- Never trust an `orgId` from the request body. It comes from the JWT only.
- Cross-tenant access is a P0 bug.

---

## 6 · VALIDATION — ZOD ONLY

- Every route validates `params`/`query`/`body` with a Zod schema from `shared/schemas/*` (shared with the frontend) or `backend/src/schemas/*` (backend-only).
- `.strict()` on every input schema — reject unknown fields.
- Response schemas strip unexpected fields.

```ts
// backend/src/schemas/employee.schema.ts (re-exports shared, or backend-only additions)
import { CreateEmployeeInput } from "@app/shared/schemas/employee.schema";
export { CreateEmployeeInput };
```

---

## 7 · ERROR TAXONOMY

```ts
// backend/src/utils/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  constructor(msg: string, details?: unknown) { super(msg, "VALIDATION_ERROR", 400, details); }
}
export class UnauthorizedError extends AppError {
  constructor(msg = "Unauthorized") { super(msg, "UNAUTHORIZED", 401); }
}
export class ForbiddenError extends AppError {
  constructor(msg = "Forbidden") { super(msg, "FORBIDDEN", 403); }
}
export class NotFoundError extends AppError {
  constructor(resource: string) { super(`${resource} not found`, "NOT_FOUND", 404); }
}
export class ConflictError extends AppError {
  constructor(msg: string) { super(msg, "CONFLICT", 409); }
}
```

**Laws:**
- Never `throw new Error("...")` — always an `AppError` subclass.
- Never empty `catch {}`.
- Never leak stack traces or raw SQL errors to the client.
- Global error handler returns `{ error: message, code, details }` (matches `RULES.md` §5).

---

## 8 · LOGGING

- Fastify's built-in `pino` only. No `console.log` in committed code.
- Structured: `fastify.log.info({ requestId, userId, orgId }, "employee created")`.
- Never log passwords, tokens, secrets, or full PII payloads.

---

## 9 · AUTHENTICATION & AUTHORIZATION

- **Frontend:** NextAuth v5 handles sign-in and session storage (secure httpOnly cookie).
- **Backend:** stateless — verifies the JWT on every request using `JWT_SECRET`, extracts `userId`, `orgId`, `role`, `employeeId`, `isPlatformAdmin`. No session store, no refresh-token rotation in the backend (that's NextAuth's concern on the frontend).
- Every protected route declares its required permission; checked via `shared/config/permissions.config.ts`'s `can()`/`roleHasPermission()` server-side. Client-side checks are UI hints only.
- SuperAdmin (`is_platform_admin`) bypass is explicit and auditable.

---

## 10 · API DESIGN

- Versioned paths: `/api/v1/...` (`RULES.md` §5).
- Plural resource names: `/employees`, not `/employee`.
- Pagination on every list endpoint: `?page=&limit=` (max 100), per `shared/constants/index.ts` `PAGINATION`.
- Response envelope — success: `{ "data": T }`; error: `{ "error": string, "code": string, "details"?: unknown }`.
- Dates: ISO 8601 UTC.
- Every route carries `x-request-id` for tracing.

---

## 11 · DATABASE RULES

- **No ORM.** Raw SQL via `pg`, through repositories only.
- Migrations are plain `.sql` files in `db/migrations/`, numbered sequentially, applied by `scripts/migrate.ts`. Never edit a migration after it's pushed.
- Every tenant table: `id uuid PK`, `org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE`, `created_at`, `updated_at`, RLS enabled.
- Index every FK and every `(org_id, ...)` query path.
- No `SELECT *` in production code paths.
- Paginate every list query.
- Transactions for multi-write operations (already the default inside `withTenant`).

---

## 12 · SECURITY CHECKLIST (every route)

- [ ] Auth required? Verified in preHandler.
- [ ] Permission required? Checked via `permissions.config.ts`.
- [ ] Tenant scoped? Query runs inside `withTenant`.
- [ ] Input validated with Zod (`.strict()`).
- [ ] Response schema applied (no field leaks).
- [ ] No PII/secrets in logs or error responses.
- [ ] Audit logged, if the action is sensitive (login, delete, role/tier change — `RULES.md` §2, §11).
- [ ] Rate limiting applied where the route is public-facing.

---

## 13 · TESTING

- Vitest for everything. `fastify.inject` preferred over real HTTP.
- Every route: happy path, validation failure (400), auth required (401), permission denied (403), not found (404), **tenant isolation (cross-tenant → 404)**.
- Mock at the boundary (external HTTP, email) — never mock the repository layer; test against a real Postgres instance.
- Bug fixes start with a failing test (`RULES.md` §4).

---

## 14 · CODE STYLE & LIMITS

- Files ≤ 250 lines, functions ≤ 50 lines — **matches `RULES.md` §3** (this file's old 200/40 limits are retired).
- No `any` without a `// why:` comment.
- No `console.log`, no `TODO` comments, no commented-out code, no empty `catch`.
- Named exports; `const` over `let`; no `var`.
- PR size: aim for ≤ 400 LOC (tests/migrations excluded) — a soft guideline, not a CI gate.

---

## 15 · GIT & COMMITS

- Conventional Commits (`RULES.md` §7). No direct commits to `main`.
- One logical change per PR.

---

## 16 · THE AI WORKFLOW

1. **READ** — summarize existing related code. No writing yet.
2. **MIGRATION** — write the `.sql` file first, if schema changes.
3. **SCHEMA** — Zod schemas for input/output.
4. **REPOSITORY** — data access, tenant-scoped.
5. **SERVICE** — business logic.
6. **CONTROLLER** — thin HTTP layer.
7. **ROUTE** — register under `/api/v1` with auth + permission + schemas.
8. **TESTS** — separate step: happy path + the 4 error cases from §13.
9. **COMMIT** — Conventional Commits.

**AI must never:** add a library not in §1 · write SQL outside repositories · put business logic in a repository · skip `org_id` scoping · use `any`/`@ts-ignore`/`console.log` · generate an entire feature in one response.

---

## 17 · GOVERNANCE

Any change to this document requires a written proposal, approval, and a PR updating this file **before** the corresponding code lands.

---

**END OF CONSTITUTION · v2.0 · Glix Connect backend**
