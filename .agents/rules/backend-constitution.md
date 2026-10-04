# ⚙️ GLOBAL BACKEND ENGINEERING CONSTITUTION
## Node.js + Fastify API Standard
### Version 1.0 · Universal · Authoritative

> **Scope:** This document is the **single source of truth** for all backend API engineering decisions across every Node.js + Fastify project in the organization. Every rule reflects production-grade practice. It is technology-opinionated but framework-agnostic in principle — the laws hold whether you swap Fastify for Express, Koa, or Hono.

---

## ⭐ THE GOLDEN RULE

> **This ruleset is CLOSED and COMPLETE.**
>
> No library, pattern, plugin, utility, or approach that is **not** listed in this document may be introduced into the codebase by **anyone** — including AI assistants and senior engineers.
>
> If you believe something new is needed:
> 1. Open a discussion with the **backend architect / tech lead**
> 2. Get **explicit written approval**
> 3. The architect updates this document **FIRST**
> 4. Only then does the new pattern enter the codebase
>
> **AI tools must NEVER add a library, pattern, or approach that is absent from this file — even if it would "work."**

---

## 0 · PRODUCT CONTEXT (adapt per project)

- **Company:** *(your company)*
- **Stack:** Node.js + Fastify + TypeScript
- **Database:** PostgreSQL (via Prisma or Drizzle — pick one per project)
- **Cache / Queue:** Redis + BullMQ
- **Auth model:** JWT access token + refresh token (rotating), stored in **httpOnly secure cookies** for browsers, `Authorization: Bearer` for machine clients
- **Multi-tenancy:** enforced at the query layer via `tenantId` on every request
- **API style:** REST, versioned (`/api/v1/...`), OpenAPI-documented
- **Deployment:** containerized, 12-factor, horizontally scalable, stateless
- **Regions:** configurable via env; currency/locale handled per-tenant

---

## 1 · APPROVED TECHNOLOGY STACK

The versions below are the **only approved versions**. Do **not** upgrade a package without architect approval.

### Runtime & Language
| Package | Version | Notes |
|---|---|---|
| Node.js | `>=20 LTS` | Use LTS only. Never odd-numbered releases in prod. |
| TypeScript | `^5.6` | `strict: true` enforced |
| `tsx` | `^4` | Dev runtime only |
| `tsup` or `esbuild` | latest | Build step |

### HTTP Framework
| Package | Version | Notes |
|---|---|---|
| `fastify` | `^5` | The only HTTP framework. |
| `@fastify/autoload` | `^6` | Plugin/route autoloading |
| `@fastify/cors` | `^10` | CORS |
| `@fastify/helmet` | `^13` | Security headers |
| `@fastify/rate-limit` | `^10` | Rate limiting |
| `@fastify/jwt` | `^9` | JWT handling |
| `@fastify/cookie` | `^11` | Cookie parsing |
| `@fastify/multipart` | `^9` | File uploads |
| `@fastify/static` | `^8` | Static assets (if needed) |
| `@fastify/sensible` | `^6` | HTTP error helpers |
| `@fastify/under-pressure` | `^9` | Overload protection |
| `@fastify/swagger` + `@fastify/swagger-ui` | latest | OpenAPI docs |
| `@fastify/compress` | `^8` | gzip/brotli |

### Validation & Serialization
| Package | Version | Notes |
|---|---|---|
| `zod` | `^3` | **All** input validation |
| `fastify-type-provider-zod` | `^4` | Zod ↔ Fastify type provider |
| `ajv` | bundled | Fastify's default — only via Zod bridge |

> **Rule:** You may use **either** Zod schemas **or** Fastify's native JSON Schema — never both in the same route. Zod is the default.

### Database
| Package | Version | Notes |
|---|---|---|
| `postgres` (postgres.js) **or** `pg` | latest | Raw driver |
| **Prisma** `^6` **or** **Drizzle ORM** `^0.36` | latest | One ORM per project — never mix |
| `@node-pg-migrate` or Prisma Migrate | latest | Forward-only migrations |

### Cache, Queue, Realtime
| Package | Version | Notes |
|---|---|---|
| `ioredis` | `^5` | Redis client |
| `bullmq` | `^5` | Background jobs |
| `@fastify/websocket` | `^11` | WebSockets (only if needed) |

### Observability & Logging
| Package | Version | Notes |
|---|---|---|
| `pino` | bundled with Fastify | Logging |
| `pino-pretty` | `^13` | Dev only |
| `@opentelemetry/*` | latest | Tracing/metrics (if enabled) |
| `prom-client` | `^15` | Prometheus metrics |

### Utilities
| Package | Version | Notes |
|---|---|---|
| `dotenv` | `^16` | Env loading (dev only) |
| `env-schema` | `^6` | Env validation via Zod/Ajv |
| `nanoid` | `^5` | Short IDs |
| `uuid` | `^11` | UUIDs |
| `argon2` | `^0.41` | Password hashing (preferred) |
| `bcrypt` | legacy | Do not use in new code |
| `dayjs` | legacy | **Use `date-fns`** |
| `date-fns` | `^4` | All date operations |
| `lodash-es` | ❌ | Do **not** use. Write the util you need. |

### Testing
| Package | Version | Notes |
|---|---|---|
| `vitest` | `^2` | Unit + integration |
| `supertest` **or** `fastify.inject` | latest | HTTP tests — prefer `inject` |
| `testcontainers` | `^10` | Real Postgres/Redis in CI |
| `@faker-js/faker` | `^9` | Test data |

### Build & DX
| Package | Version | Notes |
|---|---|---|
| `eslint` | `^9` | Flat config |
| `prettier` | `^3` | Formatting |
| `husky` + `lint-staged` | latest | Pre-commit hooks |
| `docker` + `docker-compose` | latest | Local dev |

---

## 2 · ANALYSE BEFORE YOU WRITE

**Non-negotiable. Every task, every AI prompt.**

1. Read **all** related files:
   - Route, controller, service, repository, schema, types, tests, migrations.
2. Map the full **request flow**:
   ```
   HTTP → Fastify hooks → preHandler (auth/tenant) → validator →
   controller → service → repository → DB/cache → response serializer
   ```
3. Check what already exists:
   - `src/schemas/` — schema may exist
   - `src/services/` — service method may exist
   - `src/repositories/` — query may exist
   - `src/plugins/` — plugin may exist
   - `src/utils/` — util may exist
   - `prisma/schema.prisma` / Drizzle schema — model may exist
4. If the feature partially exists — **extend it**.
5. **Never modify a file outside the current task.**
6. **Never duplicate** a service, query, or schema.
7. **Never** rewrite a route to add one field.

> **AI Workflow Rule:** The AI must first **summarize existing code** in a response with **zero** code changes. Only after human confirmation does implementation begin.

---

## 3 · FOLDER STRUCTURE (exact — do not invent)

```
src/
├── server.ts                # Fastify instance factory (no listen)
├── index.ts                 # Entry — env load, build, listen
├── app.ts                   # App builder (plugins + routes)
│
├── config/
│   ├── env.ts               # Zod-validated env (fails fast)
│   ├── constants.ts         # UPPER_SNAKE constants
│   └── feature-flags.ts
│
├── plugins/                 # Fastify plugins (one per concern)
│   ├── db.plugin.ts         # Attaches `fastify.db`
│   ├── redis.plugin.ts      # Attaches `fastify.redis`
│   ├── auth.plugin.ts       # JWT verify, attaches `request.user`
│   ├── tenant.plugin.ts     # Resolves tenant, attaches `request.tenantId`
│   ├── error.plugin.ts      # Global error handler
│   ├── logger.plugin.ts
│   └── swagger.plugin.ts
│   └── metrics.plugin.ts
│
├── hooks/                   # Reusable Fastify hooks
│   ├── onRequest.hook.ts
│   ├── preHandler.hook.ts
│   └── onSend.hook.ts
│
├── routes/                  # Route registration ONLY
│   └── v1/
│       ├── index.ts         # v1 router
│       ├── user.routes.ts
│       ├── invoice.routes.ts
│       └── ...
│
├── controllers/             # HTTP layer — thin, no business logic
│   ├── user.controller.ts
│   └── invoice.controller.ts
│
├── services/                # Business logic — no HTTP, no SQL
│   ├── user.service.ts
│   └── invoice.service.ts
│
├── repositories/            # Data access — SQL/ORM only
│   ├── user.repository.ts
│   └── invoice.repository.ts
│
├── schemas/                 # Zod schemas — one file per domain
│   ├── user.schema.ts
│   ├── invoice.schema.ts
│   └── common.schema.ts
│
├── jobs/                    # BullMQ workers + job definitions
│   ├── workers/
│   │   └── email.worker.ts
│   └── queues.ts
│
├── lib/                     # Third-party singletons/wrappers
│   ├── prisma.ts            # or drizzle.ts
│   ├── redis.ts
│   ├── mailer.ts
│   └── storage.ts
│
├── types/                   # Shared types
│   ├── index.ts             # Global (User, Tenant, ApiRes)
│   └── fastify.d.ts         # Fastify module augmentation
│
├── utils/                   # Pure stateless helpers
│   ├── errors.ts            # AppError + subclasses
│   ├── http.ts              # sendSuccess, sendError
│   ├── logger.ts
│   ├── crypto.ts
│   ├── date.ts
│   └── currency.ts
│
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

**Never invent new top-level folders.** All requests have exactly one home.

---

## 4 · THE REQUEST LIFECYCLE (memorize this)

```
1. TCP / TLS handshake
2. Fastify receives request
3. onRequest hooks:        correlation ID, logging, tracing
4. preParsing hooks:       (rare)
5. preValidation hooks:    auth, tenant resolution, rate limit
6. preHandler hooks:       permission checks, idempotency
7. Validation:             Zod schema parses params/query/body
8. Handler (controller):   calls service — NO logic, NO DB
9. Service:                business rules, orchestration
10. Repository:            DB query (with tenant scope)
11. Response serialization: schema-validated output
12. onSend hooks:          compression, headers
13. onResponse hooks:      metrics, access log
14. error handler:         catches everything, formats safely
```

**Laws:**
- Controllers **never** touch the DB.
- Services **never** touch `request` / `reply`.
- Repositories **never** contain business rules.
- Validation happens **before** the handler.
- Errors are **thrown**, never returned raw.

---

## 5 · IMPORT & MODULE RULES

- **ESM only** — `"type": "module"` in `package.json`.
- **Path aliases** — `#config/*`, `#services/*` etc. via `package.json` `imports`.
  Never `../../../`.
- **Named exports** everywhere. Default exports only when the framework requires it.
- **Import order** enforced by ESLint:
  1. Node built-ins (`node:fs`, `node:crypto`)
  2. Third-party libraries
  3. Internal aliases
- **Zero unused imports** — dead imports inflate cold-start time and mislead readers.
- **No circular imports** — if A imports B and B imports A, you have a design flaw.

---

## 6 · TYPESCRIPT RULES

- `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`.
- **`any` is forbidden** in production code. In tests, prefer `as unknown as T`.
- **Never** `@ts-ignore` / `@ts-expect-error`. Fix the root cause.
- **Every exported function has an explicit return type.**
- **`interface`** for object shapes that may be extended.
- **`type`** for unions, intersections, and mapped types.
- **Branded types** for IDs:
  ```ts
  type UserId = string & { readonly __brand: "UserId" };
  type TenantId = string & { readonly __brand: "TenantId" };
  ```
- **Discriminated unions** for variants — never booleans-as-flags.
- **`Result<T, E>`** for expected failures; `throw` for unexpected ones.
- Global types → `src/types/index.ts`. Feature types → feature folder.
- **Prefer `const`** over `let`; ban `var`.
- **Boolean names** prefixed: `isLoading`, `hasAccess`, `canDelete`.

---

## 7 · ENVIRONMENT & CONFIGURATION

- **Env is validated at boot** with Zod. App refuses to start on missing/malformed env.
- **Never read `process.env` outside `config/env.ts`.**
- **Never** commit `.env`, `.env.local`, or secrets. Only `.env.example`.
- **12-factor**: all config via env — no config files baked into images.
- **Naming:**
  - `DATABASE_URL`, `REDIS_URL`
  - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
  - `PORT`, `HOST`, `NODE_ENV`
  - `LOG_LEVEL`, `CORS_ORIGINS`
- **Secrets rotation** must be supported without code change.

```ts
// src/config/env.ts — the ONLY place env is read
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().int().positive(),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  CORS_ORIGINS: z.string().transform(s => s.split(",")),
});

export const env = EnvSchema.parse(process.env);
```

---

## 8 · LOGGING (pino — Fastify's built-in)

- **pino is the only logger.** No `console.log` in committed code.
- **Structured JSON** in production; pretty in dev.
- **Every log has:**
  - `level`
  - `msg`
  - `requestId` (correlation ID)
  - `userId` / `tenantId` when available
- **Never log:**
  - Passwords, tokens, secrets
  - Full request bodies with PII
  - Credit card numbers, government IDs
- **Log levels:**
  - `trace` — verbose dev only
  - `debug` — dev / troubleshooting
  - `info` — request lifecycle, business events
  - `warn` — recoverable anomalies
  - `error` — failed operations needing attention
  - `fatal` — process about to exit
- **Log sampling** for high-volume info events in production.

```ts
fastify.log.info({ requestId, userId, invoiceId }, "invoice created");
// ❌ fastify.log.info(`invoice ${id} created for user ${userId}`);
```

---

## 9 · VALIDATION — ZOD ONLY

- **All input validated** with Zod: `params`, `query`, `body`, `headers`.
- **Use `fastify-type-provider-zod`** — schemas drive both runtime validation and TypeScript types.
- **Never** write a route without schemas.
- **Response schemas are mandatory** — they strip unexpected fields and prevent data leaks.
- **Strict mode:** reject unknown fields (`.strict()`).
- **Errors** → formatted to `{ field, message }` before returning.

```ts
// src/schemas/invoice.schema.ts
import { z } from "zod";

export const CreateInvoiceBody = z.object({
  customerId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.enum(["AED", "USD", "GBP"]),
  dueDate: z.string().date(),
}).strict();

export const InvoiceResponse = z.object({
  id: z.string().uuid(),
  amount: z.number(),
  currency: z.string(),
  createdAt: z.string().datetime(),
});

export type CreateInvoiceBody = z.infer<typeof CreateInvoiceBody>;
export type InvoiceResponse = z.infer<typeof InvoiceResponse>;
```

```ts
// src/routes/v1/invoice.routes.ts
fastify.post("/invoices", {
  schema: {
    body: CreateInvoiceBody,
    response: { 201: InvoiceResponse },
  },
}, invoiceController.create);
```

---

## 10 · HTTP LAYER — CONTROLLERS

Controllers are **thin**. They translate HTTP → service call → HTTP.

```ts
// src/controllers/invoice.controller.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateInvoiceBody } from "#schemas/invoice.schema";
import { invoiceService } from "#services/invoice.service";
import { sendSuccess } from "#utils/http";

export const invoiceController = {
  async create(
    req: FastifyRequest<{ Body: CreateInvoiceBody }>,
    reply: FastifyReply,
  ) {
    const invoice = await invoiceService.create({
      ...req.body,
      tenantId: req.tenantId,
      userId: req.user.id,
    });
    return sendSuccess(reply, invoice, 201);
  },

  async getById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const invoice = await invoiceService.getById(req.params.id, req.tenantId);
    return sendSuccess(reply, invoice);
  },
};
```

**Controller rules:**
- No business logic.
- No SQL / ORM.
- No direct `try/catch` — let the global error handler catch.
- Return via `sendSuccess` / `sendError` helpers only.
- Always pass `tenantId` and `userId` explicitly to the service.

---

## 11 · SERVICE LAYER — BUSINESS LOGIC

Services contain **all** business rules. They orchestrate repositories, jobs, cache, external APIs.

```ts
// src/services/invoice.service.ts
import { invoiceRepository } from "#repositories/invoice.repository";
import { emailQueue } from "#jobs/queues";
import { NotFoundError, ForbiddenError } from "#utils/errors";

export const invoiceService = {
  async create(input: CreateInvoiceInput) {
    if (input.amount <= 0) throw new ValidationError("amount must be positive");

    const invoice = await invoiceRepository.create(input);

    await emailQueue.add("invoice.created", {
      invoiceId: invoice.id,
      tenantId: input.tenantId,
    });

    return invoice;
  },

  async getById(id: string, tenantId: string) {
    const invoice = await invoiceRepository.findById(id, tenantId);
    if (!invoice) throw new NotFoundError("Invoice");
    return invoice;
  },
};
```

**Service rules:**
- **Never** receives `request` / `reply`.
- **Never** writes SQL — delegates to repositories.
- **Always** scoped by `tenantId`.
- **Throws** typed errors — never returns `null` for "not found".
- Side effects (email, jobs, webhooks) belong **here**, not in controllers.
- One service per domain. Do not cross domains — use events/jobs.

---

## 12 · REPOSITORY LAYER — DATA ACCESS

Repositories are the **only** place that touches the database.

```ts
// src/repositories/invoice.repository.ts
import { db } from "#lib/db";
import { invoices } from "#db/schema";
import { and, eq } from "drizzle-orm";

export const invoiceRepository = {
  async create(input: CreateInvoiceRepoInput) {
    const [row] = await db.insert(invoices).values(input).returning();
    return row;
  },

  async findById(id: string, tenantId: string) {
    return db.query.invoices.findFirst({
      where: and(eq(invoices.id, id), eq(invoices.tenantId, tenantId)),
    });
  },

  async listByTenant(tenantId: string, limit: number, offset: number) {
    return db.query.invoices.findMany({
      where: eq(invoices.tenantId, tenantId),
      limit,
      offset,
      orderBy: desc(invoices.createdAt),
    });
  },
};
```

**Repository rules:**
- **Every query is tenant-scoped.** A missing `tenantId` is a P0 bug.
- **Never** returns `undefined` silently — service handles "not found".
- **Every list query is paginated** (limit + offset/cursor).
- **Indexes** on all `WHERE`, `JOIN`, and `ORDER BY` columns.
- **No N+1.** Use joins, `IN`, or DataLoader.
- **No `SELECT *`** in production paths — select columns explicitly.
- **Transactions** for multi-write operations:
  ```ts
  await db.transaction(async tx => { ... });
  ```

---

## 13 · THE TENANT LAW (multi-tenancy)

> **Every query. Every time. Non-negotiable.**

- `request.tenantId` is **resolved once** in the tenant plugin.
- Every repository method **requires** `tenantId` as an explicit parameter.
- **Row-level security** enforced at the DB where possible (Postgres RLS).
- **Never** derive `tenantId` from the request body — only from the session / subdomain / verified JWT claim.
- **Never** let a client pass a `tenantId` that overrides the session's.
- **Cross-tenant reads are a critical vulnerability.** Reviewers must reject any PR that misses this.

---

## 14 · ERRORS — ONE TAXONOMY

```ts
// src/utils/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number,
    public readonly isOperational = true,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  constructor(msg: string, details?: unknown) {
    super(msg, "VALIDATION_ERROR", 400, true, details);
  }
}
export class UnauthorizedError extends AppError {
  constructor(msg = "Unauthorized") { super(msg, "UNAUTHORIZED", 401); }
}
export class ForbiddenError extends AppError {
  constructor(msg = "Forbidden") { super(msg, "FORBIDDEN", 403); }
}
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, "NOT_FOUND", 404);
  }
}
export class ConflictError extends AppError {
  constructor(msg: string) { super(msg, "CONFLICT", 409); }
}
export class RateLimitError extends AppError {
  constructor() { super("Too many requests", "RATE_LIMITED", 429); }
}
```

**Global error handler** (`error.plugin.ts`):
- Catches **everything** — including unhandled rejections.
- **Logs full error + context** internally.
- **Returns sanitized response** to client:
  ```json
  { "success": false, "error": { "code": "NOT_FOUND", "message": "Invoice not found" } }
  ```
- **Never** leaks stack traces, SQL, or internal paths in production.
- **500s** are always logged at `error` level with full context.

**Laws:**
- Never `throw new Error("...")` — always a typed `AppError` subclass.
- Never return `{ error: "..." }` from a handler — `throw`.
- Never `catch (e) {}` empty. Handle, wrap, or re-throw.
- Never expose raw DB error messages to clients.

---

## 15 · AUTHENTICATION & AUTHORIZATION

### Authentication
- **JWT access token** (short-lived: 15 min) + **refresh token** (rotating, 30 days).
- **Browser clients:** tokens in `httpOnly`, `secure`, `SameSite=Strict` cookies.
- **Machine clients:** `Authorization: Bearer <token>`.
- **Never** store tokens in `localStorage` for browser apps.
- **Refresh token rotation** with **reuse detection** — reuse invalidates the family.
- **Password hashing:** `argon2id` with sane params. bcrypt is legacy.
- **Sessions** stored server-side (Redis) — allows revocation.

### Authorization
- **Role-based** (RBAC) + **attribute-based** (ABAC) where needed.
- **Permission format:** `"RESOURCE:ACTION"` e.g. `"invoice:create"`.
- **Enforced in `preHandler` hook** — never in the controller.
- **Never** trust client-sent role/permission claims.
- **SuperAdmin** bypass is explicit, auditable, and logged.
- Every protected route declares its required permission in the route config.

```ts
fastify.post("/invoices", {
  preHandler: [fastify.authorize("invoice:create")],
  schema: { body: CreateInvoiceBody },
}, invoiceController.create);
```

---

## 16 · DATABASE RULES

- **One ORM per project.** Never mix Prisma and Drizzle.
- **Migrations are forward-only.** Never edit a shipped migration.
- **Every migration is reversible** in principle (down migration or documented rollback).
- **Never** write raw SQL in a service — repositories only.
- **Index** every FK and every `WHERE`/`ORDER BY` column.
- **`EXPLAIN ANALYZE`** any query on a table > 100k rows.
- **Prefer `EXISTS` over `IN`** for large subqueries.
- **Pagination:** cursor-based for large lists; offset for small admin tables.
- **Never `SELECT *`** in production code paths.
- **Soft deletes** (`deleted_at`) for user-facing entities; hard deletes for ephemeral data.
- **Every table has:** `id`, `created_at`, `updated_at`, `tenant_id` (if multi-tenant).

---

## 17 · CACHING & REDIS

- **Redis for:** sessions, rate limits, cache, queues, locks.
- **Never** cache without an **eviction policy** and **TTL**.
- **Cache keys are namespaced**: `tenant:{id}:invoice:{id}`.
- **Cache invalidation on write** — always.
- **Stampede protection** via singleflight / lock.
- **Never** cache user-specific data without user scoping.
- **Never** store secrets in Redis without encryption.
- **Metrics** on hit rate — a cache below 70 % hit rate is a smell.

---

## 18 · BACKGROUND JOBS (BullMQ)

- **All slow work moves off the request path** — emails, PDFs, exports, webhooks, syncs.
- **Jobs are idempotent** — they will be retried.
- **Retries with exponential backoff + jitter.**
- **Dead-letter queue** for permanent failures.
- **Job payloads are small** — pass IDs, not objects.
- **Every job logs** `{ jobId, queue, attempt, tenantId }`.
- **Workers scale independently** from the API.
- **Never** do HTTP-triggered work synchronously that takes > 200 ms.

---

## 19 · API DESIGN CONVENTIONS

- **REST over HTTP/JSON.** No GraphQL unless explicitly approved.
- **Versioned paths:** `/api/v1/...`. Breaking changes bump version.
- **Plural resource names:** `/invoices`, not `/invoice`.
- **Verbs via HTTP methods:** GET, POST, PATCH, PUT, DELETE.
- **Idempotency:** PUT/PATCH/DELETE are idempotent. POST can be with an idempotency key.
- **Pagination:** `?limit=20&cursor=...` — return `{ data, nextCursor }`.
- **Filtering/sorting:** `?status=paid&sort=-createdAt`.
- **Response envelope (success):**
  ```json
  { "success": true, "data": { ... }, "meta": { "requestId": "..." } }
  ```
- **Response envelope (error):**
  ```json
  { "success": false, "error": { "code": "...", "message": "...", "details": {} } }
  ```
- **HTTP status codes:** 200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500. **Never 200 with an error.**
- **`Idempotency-Key` header** mandatory for all POST that create billable/mutating resources.
- **Date/time:** always **ISO 8601 UTC**.
- **Money:** integers in minor units (`cents`), never floats.
- **OpenAPI** auto-generated from Zod schemas — always up to date.

---

## 20 · SECURITY CHECKLIST (every route)

- [ ] Auth required? Declared in `preHandler`.
- [ ] Permission required? Declared in route config.
- [ ] Tenant scoped? `tenantId` propagated.
- [ ] Input validated? Zod schema on `body` / `query` / `params`.
- [ ] Output serialized? Zod response schema (no leaks).
- [ ] Rate limited? Global + per-route where sensitive.
- [ ] Idempotency? For mutating POSTs.
- [ ] Audit logged? For sensitive actions (login, delete, permission change).
- [ ] No PII in logs.
- [ ] No secrets returned.
- [ ] SQL parameterized (never string concat).
- [ ] CSP, CORS, Helmet configured.
- [ ] HTTPS enforced in prod (HSTS).

**Global security:**
- `@fastify/helmet` on.
- `@fastify/cors` — explicit origin allowlist, never `*` with credentials.
- `@fastify/rate-limit` — global + stricter per route.
- `@fastify/under-pressure` — shed load before crash.
- Body size limits (`bodyLimit`) — reject oversized payloads.
- Request timeouts — no hung connections.

---

## 21 · PERFORMANCE LAWS

### The Cost Ladder (prefer top over bottom)
```
1. Don't do the work at all
2. Compute once, cache it
3. Precompute at boot / build
4. Do it in a background job
5. Do it on the request path (fast)
6. Do it synchronously on the request path (slow) ← worst
```

### Rules
- **Measure before optimizing.** No guessing. Profile with `clinic`, `0x`, or APM.
- **Target p95 latency**, not averages.
- **No synchronous I/O** on the request path.
- **No N+1 queries.** Ever.
- **No unbounded queries.** Every list is paginated.
- **Stream large responses** — don't buffer.
- **Compress responses** (`@fastify/compress`) for text > 1 KB.
- **Keep the event loop free** — offload CPU work to workers or child processes.
- **Connection pools sized** — DB, Redis — matched to instance CPU.
- **HTTP keep-alive** on outbound calls.
- **Never** `await` inside a loop over independent items — use `Promise.all` with concurrency limit.
- **Cache aggressively**, invalidate precisely.
- **Bundle-less** — no bundler at runtime. Ship JS as ESM.
- **Cold-start matters** — keep import chains shallow.

### Budgets (per instance)
| Metric | Budget |
|---|---|
| p50 latency (simple GET) | < 30 ms |
| p95 latency (simple GET) | < 150 ms |
| p95 latency (list with filter) | < 400 ms |
| Memory | < 512 MB steady-state |
| Cold start | < 1 s |

---

## 22 · RESILIENCE

- **Timeouts on every outbound call** (HTTP, DB, Redis). No infinite waits.
- **Retries with jitter** only on **idempotent** operations.
- **Circuit breaker** on external APIs.
- **Graceful shutdown:**
  - Stop accepting new requests
  - Drain in-flight
  - Close DB, Redis, queue connections
  - Exit cleanly
  ```ts
  process.on("SIGTERM", async () => {
    await fastify.close();
    await db.end();
    await redis.quit();
    process.exit(0);
  });
  ```
- **Health endpoints:** `/health/live` (process), `/health/ready` (dependencies).
- **Readiness gate** — don't receive traffic until DB/Redis are reachable.
- **Backpressure** — `@fastify/under-pressure` sheds load.

---

## 23 · TESTING

- **Vitest** for everything.
- **`fastify.inject`** preferred over real HTTP in tests.
- **Testcontainers** for real Postgres/Redis in CI — no mocks for DB.
- **Mock at the boundary** — external HTTP, email, payment. Never mock repositories.
- **Every route has:**
  - Happy path
  - Validation failure (400)
  - Auth required (401)
  - Permission denied (403)
  - Not found (404)
  - Tenant isolation (cross-tenant access → 404)
- **Every service has unit tests** for business rules.
- **Coverage targets:**
  - Utils: ≥ 90 %
  - Services: ≥ 85 %
  - Routes: ≥ 80 %
- **Never** write tests and implementation in the same AI prompt.
- **Test names describe behavior:**
  ```ts
  it("returns 403 when user lacks invoice:create", async () => { ... });
  ```

---

## 24 · OBSERVABILITY

- **Logs:** structured, correlation ID on every line.
- **Metrics** (Prometheus): request count, latency histogram, error rate, queue depth, DB pool usage, cache hit rate.
- **Traces** (OpenTelemetry): one trace per request, spans across service + DB + Redis + queues.
- **Alerts** on: error rate > 1 %, p95 latency spike, queue backlog, DB connections saturated.
- **Every alert has a runbook.**
- **Every deploy is traceable** — version tag, commit SHA in logs.

---

## 25 · API VERSIONING & DEPRECATION

- **Version is in the path:** `/api/v1/...`.
- **Breaking changes** require a new version.
- **Deprecation policy:** announce, mark deprecated header, support for **at least 6 months**.
- **Sunset header** on deprecated endpoints: `Sunset: Sat, 31 Dec 2025 23:59:59 GMT`.
- **Never** silently change a response shape.

---

## 26 · DEPENDENCY & SUPPLY CHAIN

- **Every dependency** must be:
  - Actively maintained
  - Permissively licensed (MIT/Apache-2.0/BSD)
  - Below N high/critical CVEs
  - Small enough to justify
- **Lockfile committed** (`package-lock.json`, `pnpm-lock.yaml`).
- **`npm audit` / `pnpm audit` runs in CI** — fails on high.
- **Dependabot / Renovate** enabled — weekly PRs, human-reviewed.
- **Never** install a package to solve a 10-line problem.
- **Never** two packages that do the same thing.
- **Never** a package whose sole maintainer is inactive.

---

## 27 · CODE STYLE & QUALITY GATES

- **ESLint flat config, zero warnings.**
- **Prettier formatting, no debates.**
- **Pre-commit hook** runs lint-staged: format + lint + typecheck on staged files.
- **CI must pass:** lint → typecheck → test → build.
- **No direct commits to `main` or `develop`.**
- **PR ≤ 400 LOC** (excluding tests, migrations, lockfiles).
- **Self-review before requesting review.**
- **No `console.log`**, no `TODO` comments, no commented-out code.
- **No unused variables, imports, or files.**
- **Functions < 40 lines.** Files < 200 lines.
- **Cyclomatic complexity < 10.**
- **No magic numbers** — named constants.

---

## 28 · GIT & COMMITS

### Conventional Commits (strict)
```
feat(scope):     new feature
fix(scope):      bug fix
refactor(scope): behavior-unchanged change
perf(scope):     performance improvement
style(scope):    formatting only
chore(scope):    tooling / deps
docs(scope):     documentation
test(scope):     tests only
build(scope):    build system
ci(scope):       CI config
```

Examples:
```
feat(invoice): add idempotency key support
fix(auth): reject reused refresh tokens
perf(repo): replace N+1 query with single join
refactor(tenant): extract resolver into plugin
```

### Branching
- `feat/*`, `fix/*`, `refactor/*`, `perf/*`, `chore/*`
- **PR targets `develop`**, never `main`.
- **Squash merges** — one commit per feature.

---

## 29 · THE AI WORKFLOW (MANDATORY)

Follow **in order**. Do not skip steps.

1. **READ** — ask AI to summarize existing code. **No writing.**
2. **PLAN** — schemas, types, service boundaries, DB changes.
3. **MIGRATION** — DB migration first, if needed.
4. **SCHEMA** — Zod schemas for input/output.
5. **REPOSITORY** — data access methods.
6. **SERVICE** — business logic.
7. **CONTROLLER** — thin HTTP layer.
8. **ROUTE** — register with auth + permission + schemas.
9. **TESTS** — separate prompt. Happy path + 4 error cases.
10. **REVIEW** — read every line. Reject anything you don't understand.
11. **COMMIT** — Conventional Commits. Push. PR.

**Rule:** After 8–10 AI interactions on one feature, summarize, start a new session. Context rot is real.

**AI must NEVER:**
- Add a library not in this document
- Introduce a new pattern for a solved problem
- Skip schemas, tests, or error handling
- Write SQL in a service or business logic in a repository
- Bypass the tenant scope
- Use `any`, `@ts-ignore`, or `console.log`
- Generate an entire feature in one response

---

## 30 · WHAT AI AND ENGINEERS MUST NEVER DO

### Libraries & Framework
- ❌ Add a package not listed here without approval
- ❌ Use `express`, `koa`, `hapi`, or raw `http` — Fastify only
- ❌ Create a second Fastify instance
- ❌ Use `nodemon` — use `tsx watch` or `node --watch`

### Types & Code
- ❌ Use `any`, `@ts-ignore`, `@ts-expect-error`
- ❌ Use `var`
- ❌ Leave `console.log`, `TODO`, or commented code
- ❌ Write empty `catch` blocks
- ❌ Write magic numbers
- ❌ Duplicate a util / service / repository method that already exists

### Data & Persistence
- ❌ Mix two ORMs
- ❌ Edit a shipped migration
- ❌ Write SQL outside repositories
- ❌ Write business logic inside repositories
- ❌ Skip `tenantId` on a query
- ❌ Use `SELECT *` in production
- ❌ Trust a `tenantId` from the request body

### HTTP & API
- ❌ Return 200 for an error
- ❌ Leak stack traces or SQL errors
- ❌ Return raw ORM objects without serialization
- ❌ Skip Zod validation
- ❌ Skip response schemas
- ❌ Use `res.send`-style raw reply without helpers
- ❌ Return a `null` for a "not found" instead of throwing `NotFoundError`

### Auth & Security
- ❌ Log secrets, tokens, or PII
- ❌ Store JWT in `localStorage` (browser)
- ❌ Use bcrypt for new passwords (use argon2)
- ❌ Use `*` for CORS with credentials
- ❌ Trust client-sent roles / permissions
- ❌ Commit `.env`

### Async & Performance
- ❌ Use `.then().catch()` chains — use `async/await`
- ❌ `await` inside a `for` loop over independent items
- ❌ Add a cache without TTL or invalidation
- ❌ Block the event loop with CPU-heavy work
- ❌ Skip timeouts on outbound calls

### Testing
- ❌ Mock the DB — use testcontainers
- ❌ Skip tenant-isolation tests
- ❌ Write tests and implementation in the same AI prompt

### Process
- ❌ Commit to `main` or `develop` directly
- ❌ Open a PR without tests
- ❌ Modify files outside the task scope
- ❌ Push without running lint + typecheck + tests locally

---

## 31 · FEATURE COMPLETION CHECKLIST

Every item must be checked before a PR is opened.

### 🧠 Code Quality
- [ ] All related files read before writing
- [ ] Zero `any`, zero `@ts-ignore`
- [ ] ESLint passes with zero warnings: `npm run lint`
- [ ] TypeScript passes: `npm run typecheck`
- [ ] No `console.log`, no `TODO`, no commented code
- [ ] No unused imports
- [ ] Functions < 40 lines, files < 200 lines

### 🏗 Architecture
- [ ] Route registered under `/api/v1`
- [ ] Controller is thin (no logic, no DB)
- [ ] Service holds business logic (no HTTP, no SQL)
- [ ] Repository is the only place touching the DB
- [ ] Zod schema on `body` / `query` / `params`
- [ ] Zod response schema defined (no leaks)
- [ ] Route declares auth + permission in `preHandler`

### 🔐 Security
- [ ] `tenantId` propagated to every query
- [ ] Auth required where applicable
- [ ] Permission enforced via `preHandler`
- [ ] Idempotency key for mutating POSTs
- [ ] Rate limit applied (global + route)
- [ ] No PII / secrets in logs
- [ ] No secrets in error responses

### 🗄 Data
- [ ] Migration written and tested forward + rollback
- [ ] Indexes on all `WHERE` / `ORDER BY` / FK columns
- [ ] No N+1 queries (verify with query logger)
- [ ] Pagination on every list endpoint
- [ ] Transactions for multi-write operations

### ⚡ Performance
- [ ] p95 latency measured against budget
- [ ] No synchronous I/O on request path
- [ ] Heavy work moved to a queue
- [ ] Cache added with TTL + invalidation (if applicable)
- [ ] Connection pools sized

### 🛡 Resilience
- [ ] Timeouts on outbound calls
- [ ] Retries only on idempotent ops
- [ ] Graceful shutdown verified
- [ ] Health checks pass

### 🧪 Tests
- [ ] Happy path
- [ ] Validation error (400)
- [ ] Auth required (401)
- [ ] Permission denied (403)
- [ ] Not found (404)
- [ ] **Tenant isolation (cross-tenant returns 404)**
- [ ] Coverage targets met

### 📖 Docs
- [ ] OpenAPI spec regenerated (`/docs` updated)
- [ ] README updated if public behavior changed
- [ ] Changelog entry added if breaking

### 🌳 Git
- [ ] Branch follows convention
- [ ] Commits follow Conventional Commits
- [ ] `.env` not staged
- [ ] PR targets `develop`
- [ ] Self-reviewed

---

## 32 · GOVERNANCE

- This document is **authoritative** and **versioned**.
- **Any change** requires:
  1. Written proposal
  2. Impact analysis (perf, security, DX, migration)
  3. Approval by backend architect
  4. PR updating **this document first**
  5. Only then may code change
- **Every quarter**, review against real-world friction and update deliberately.
- **Local project charters may extend** this document — never contradict it.

---

## 33 · THE ONE-LINE SUMMARY

> **Validate at the boundary. Scope by tenant. Throw typed errors. Cache with intent. Measure before optimizing. Reuse before rewriting. Ship small. Log everything useful, leak nothing.**

---

**END OF CONSTITUTION · Version 1.0 · Node.js + Fastify**
