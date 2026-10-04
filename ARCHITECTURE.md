# ARCHITECTURE.md

System design for Glix Connect HR Portal. Read `CLAUDE.md` and `RULES.md` first.

---

## 1. System Overview

Three deployable units + self-hosted Postgres:

| Unit | Role | Runtime |
| :--- | :--- | :--- |
| `frontend/` | UI, session handling, calls backend | Next.js on Vercel / VPS |
| `backend/` | API, business logic, DB writes | Fastify on VPS / Fly / Railway |
| `shared/` | Config, types, Zod schemas, utils | Imported, not deployed |
| PostgreSQL 16 | Relational database + RLS | Self-hosted, Docker-free, direct pg connection |
| Resend (planned) | Transactional email | Managed API |
| Razorpay / Stripe | Payments | Managed API |

**Why split frontend + backend?** Next.js alone could do everything, but
a separate Fastify layer gives us: long-running jobs, webhook handling,
rate limiting, structured logs, and independent scaling.

---

## 2. Layers

| Layer | Responsibility | Where |
| :--- | :--- | :--- |
| Presentation | Rendering, forms, client state | `frontend/src/app/**` |
| API boundary | HTTP, auth, validation, rate limit | `backend/src/routes/**` |
| Domain / service | Business rules, orchestration | `backend/src/services/**` |
| Data access | Queries, RLS-scoped access | `backend/src/plugins/db.plugin.ts` + Repos |
| Persistence | Postgres + File Storage | PostgreSQL 16 + VPS Filesystem (`attachments`) |
| Shared | Config, types, schemas, utils | `shared/**` |

**Rule:** frontend never talks to the DB directly. All data flows through `backend/`.

---

## 3. Package Boundaries

```text
shared/     → pure code, no runtime, no framework imports
frontend/   → imports shared, calls backend HTTP
backend/    → imports shared, owns DB access, owns RLS-scoped queries
```

**Allowed imports:**

| From | May import |
| :--- | :--- |
| `frontend/` | `@app/shared/*` |
| `backend/` | `@app/shared/*` |
| `shared/` | `zod` only |

**Forbidden:**
- `frontend/` importing from `backend/`
- `shared/` importing from `frontend/` or `backend/`
- Any relative import crossing workspace boundaries

---

## 4. Request Lifecycle

**Every user request follows this path:**

1. **Browser** → Next.js server component or client fetch
2. **Frontend** attaches `Authorization: Bearer <jwt-token>`
3. **Fastify** middleware:
   - Verifies JWT with `JWT_SECRET`
   - Extracts `userId`, `orgId`, `role`, `employeeId`, `isPlatformAdmin`
   - Attaches to `request.auth`
   - Rejects 401 on invalid/expired token
4. **Route handler**: Zod-validates body / query / params
5. **Service**: applies business rules, tier gates, permission checks
6. **Repo / `fastify.withTenant(ctx, fn)`**:
   - Acquires client from pool
   - Sets PostgreSQL session variables:
     - `set_config('app.user_id', ...)`
     - `set_config('app.org_id', ...)`
     - `set_config('app.role', ...)`
     - `set_config('app.employee_id', ...)`
     - `set_config('app.is_platform_admin', ...)`
   - Executes queries within transaction (RLS automatically filters via `current_org_id()`, `current_user_id()`, etc.)
7. **Response**: `{ data }` or `{ error, code, details }`
8. **Audit**: sensitive actions write to `audit_log`

---

## 5. Auth Strategy

- **Mechanism:** JWT (signed with `JWT_SECRET`), 7-day expiry
- **Claims:** `sub` (userId), `email`, `orgId`, `role`, `employeeId`, `isPlatformAdmin`
- **Verification:** backend verifies JWT on every request
- **Session storage:** Secure httpOnly cookies in Next.js frontend

### Backend DB access pattern

| Operation | Client used | RLS |
| :--- | :--- | :--- |
| User-initiated request | `withTenant(ctx, fn)` | **enforced via session variables** |
| Migrations / seeds | `scripts/migrate.ts` | superuser connection |
| Admin cron jobs | `withTenant(ctx, fn)` | audited |

---

## 6. Multi-Tenancy

- **Model:** shared schema + `org_id` column + PostgreSQL RLS
- **Session variables:** Fastify sets `app.org_id` before queries; RLS reads `current_org_id()`
- **Storage:** Local VPS filesystem under `UPLOAD_DIR/{org_id}/...` + metadata in `public.attachments` table
- **Every tenant table:**
  - `org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE`
  - Indexed: `(org_id, ...)`
  - RLS policy filtering `org_id = public.current_org_id() or public.is_platform_admin()`
