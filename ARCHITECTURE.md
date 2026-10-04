# ARCHITECTURE.md

System design for YourApp. Read `CLAUDE.md` and `RULES.md` first.

---

## 1. System Overview

See [`docs/architecture/system-overview.mermaid`](docs/architecture/system-overview.mermaid).

Three deployable units + managed services:

| Unit | Role | Runtime |
| :--- | :--- | :--- |
| `frontend/` | UI, session handling, calls backend | Next.js on Vercel |
| `backend/` | API, business logic, DB writes | Fastify on Fly/Railway |
| `shared/` | Config, types, Zod schemas, utils | Imported, not deployed |
| Supabase | Postgres + Auth + Storage | Managed |
| Resend (planned) | Transactional email | Managed |
| Razorpay (planned) | Payments | Managed |

**Why split frontend + backend?** Next.js alone could do everything, but
a separate Fastify layer gives us: long-running jobs, webhook handling,
rate limiting, structured logs, and independent scaling — without Vercel's
serverless constraints.

---

## 2. Layers

| Layer | Responsibility | Where |
| :--- | :--- | :--- |
| Presentation | Rendering, forms, client state | `frontend/app/**` |
| API boundary | HTTP, auth, validation, rate limit | `backend/src/routes/**` |
| Domain / service | Business rules, orchestration | `backend/src/services/**` |
| Data access | Queries, RLS-scoped access | `backend/src/repos/**` |
| Persistence | Postgres + Storage | Supabase |
| Shared | Config, types, schemas, utils | `shared/**` |

**Rule:** frontend never talks to the DB directly. All data flows through `backend/`.
Exception: Supabase Auth SDK in the frontend (for login/session only).

---

## 3. Package Boundaries

```
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
- `shared/` importing Next.js, Fastify, or Supabase SDKs
- Any relative import crossing workspace boundaries

Enforced by ESLint (`eslint.config.mjs`, `no-restricted-imports` in Step 5).

---

## 4. Request Lifecycle

See [`docs/architecture/data-flow.mermaid`](docs/architecture/data-flow.mermaid).

**Every user request follows this path:**

1. **Browser** → Next.js server component or client fetch
2. **Frontend** attaches `Authorization: Bearer <supabase-jwt>`
3. **Fastify** middleware:
   - Verifies JWT with Supabase JWKS
   - Extracts `sub` (user_id), `org_id`, `role`, `is_project_owner`
   - Attaches to `request.auth`
   - Rejects 401 on invalid/expired
4. **Route handler**: Zod-validates body / query / params
5. **Service**: applies business rules, tier gates, permission checks
6. **Repo**: executes query using **user-scoped** Supabase client (RLS applies)
7. **Response**: `{ data }` or `{ error, code, details }`
8. **Audit**: sensitive actions write to `audit_log`

---

## 5. Auth Strategy

See [`docs/architecture/auth-flow.mermaid`](docs/architecture/auth-flow.mermaid).

- **Issuer:** Supabase Auth (email/password + Google OAuth)
- **Token:** JWT, 1-hour expiry, refresh token rotation on
- **Claims:** `sub`, `email`, `org_id`, `role`, `is_project_owner` (via
  custom access token hook, migration `005_jwt_claims_hook.sql`)
- **Verification:** backend verifies with Supabase JWKS endpoint; no shared
  secret needed
- **Session storage:** Supabase SSR helper sets httpOnly cookies on Next.js;
  frontend reads session, passes JWT to backend
- **Multi-org users:** v1 supports one active org per session.
  Switching org = re-issue token (Step 8+)

### Backend DB access pattern

| Operation | Client used | RLS |
| :--- | :--- | :--- |
| User-initiated request | user-scoped (JWT) | **enforced** |
| Migrations / seeds | `service_role` | bypassed (intentional) |
| Admin cron jobs | `service_role` | bypassed (audited) |
| Webhooks (payments) | `service_role` | bypassed (idempotent, logged) |

`service_role` never touches user-initiated code paths.

---

## 6. State Management

| State type | Tool |
| :--- | :--- |
| Server data (cacheable) | React Query on client, server components on server |
| Session | Supabase SSR cookies |
| UI state (modals, tabs) | `useState` / `useReducer` local |
| Cross-cutting UI | Zustand (only if needed) |
| Form state | `react-hook-form` + Zod resolver |

**Rule:** no `useEffect` for fetching. Server components or React Query only.

---

## 7. Multi-Tenancy

See [`docs/architecture/tenant-isolation.mermaid`](docs/architecture/tenant-isolation.mermaid).

- **Model:** shared schema + `org_id` column + RLS
- **JWT carries `org_id`** — RLS reads it, no join needed
- **Storage:** bucket `org-documents`, path prefix `{org_id}/...`
- **Every tenant table:**
  - `org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE`
  - Indexed: `(org_id, ...)`
  - RLS policy filtering `org_id = auth.jwt()->>'org_id'`

**Cross-tenant access = P0 bug.** `scripts/verify-tenant-isolation.ts` runs in CI (Step 10).

---

## 8. Third-Party Integrations

| Service | Purpose | Failure mode | Fallback |
| :--- | :--- | :--- | :--- |
| Supabase | DB + Auth + Storage | Hard outage → app down | Status page; no fallback v1 |
| Razorpay | Payments (v1.1) | Webhook delay → retry queue | Idempotency keys; manual reconcile |
| Resend | Email (v1.1) | Delay → retry | Queue + retry policy |
| Sentry | Errors (planned) | Non-blocking | Log to stdout |

No integration may block the request path synchronously.

---

## 9. Performance Budget

| Metric | Target |
| :--- | :--- |
| API p50 latency | < 100ms |
| API p95 latency | < 300ms |
| API p99 latency | < 800ms |
| Frontend LCP | < 2.5s on 4G |
| Frontend TTI | < 3.5s |
| Bundle (initial) | < 200KB gzipped |
| DB query (indexed) | < 20ms |
| Cold start (backend) | < 500ms |

Regressions block merge. Enforced by Lighthouse CI (Step 10).

---

## 10. Scalability Ceiling

Current architecture handles ~10K orgs / ~500K documents without change.
What breaks first at 10× scale:

| Bottleneck | Mitigation |
| :--- | :--- |
| DB connections | Supabase pooler (already used); PgBouncer in transaction mode |
| Storage egress | Cloudflare in front of signed URLs; regional buckets |
| Fastify single instance | Horizontal scale behind load balancer; Redis for rate limit |
| Audit log size | Partition by month; archive to S3 after 12 months |
| Full-text search | Add `pg_trgm` or migrate to Typesense |
| JWT size | Move low-cardinality claims out of JWT; accept one DB lookup |

These are documented so we know when to invest.

---

## 11. Security Boundary

Trust boundaries:

```
[Browser] ——(JWT)——▶ [Frontend] ——(JWT)——▶ [Backend] ——(JWT)——▶ [Postgres RLS]
              ▲                                              ▲
              │                                              │
        Supabase Auth (JWKS)                          service_role
        (verifies signature)                          (bypasses RLS,
                                                       audited)
```

Rules:
- Browser is untrusted — every input validated server-side
- Frontend is untrusted — backend re-validates, re-checks permissions
- Backend is trusted for user requests — but RLS is still the safety net
- `service_role` is trusted — used only in admin contexts, always audited

---

## 12. Open Questions

Tracked in `DECISIONS.md` (Step 5):

- Email provider choice (Resend vs Supabase SMTP)
- Payments provider (Razorpay vs Stripe — INR-first suggests Razorpay)
- Backend host (Fly vs Railway vs Render)
- Background job runner (BullMQ vs Trigger.dev vs pg_cron)
- Error tracking (Sentry vs Axiom vs Logflare)
- Multi-org switching UX (session vs subdomain vs per-request header)
- Document encryption at rest (Supabase-managed vs app-level)

Each becomes an ADR in `docs/adr/` when decided.
