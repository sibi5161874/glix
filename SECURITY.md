# Security Policy

## Multi-Tenant Security Model

This application enforces strict tenant isolation using **PostgreSQL Row-Level Security (RLS)** at the database layer.

### 1. Mandatory Tenant Scoping
- Every table containing tenant data **must** include an `org_id` column indexed with a foreign key to `organizations(id)`.
- Every tenant query enforces `org_id = current_org_id()` (backed by PostgreSQL session setting `app.org_id`).
- Fastify middleware / plugins set session variables (`app.user_id`, `app.org_id`, `app.role`, `app.employee_id`, `app.is_platform_admin`) inside a transaction context (`withTenant`) before executing queries.
- Bypassing RLS or querying tenant data without tenant context is strictly forbidden.

### 2. Superuser & Privilege Constraints
- The `SUPERUSER` postgres role is strictly reserved for migrations, automated test setups, and system maintenance.
- Application connections run under a restricted database user role.
- Database credentials must never be exposed to the client/frontend bundle.

#### Role separation: owner vs runtime
Two distinct, non-superuser Postgres roles are used, deliberately kept separate:

| Role | Used by | Owns tables? | Subject to RLS? |
| :--- | :--- | :---: | :---: |
| `glix_user` | `scripts/migrate.ts`, `scripts/seed.ts` (`DATABASE_URL_MIGRATE`) | Yes | No (owner exemption) |
| `glix_app` | Backend runtime (`DATABASE_URL`, `withTenant`) | No | **Yes** |

This split exists because PostgreSQL exempts a table's *owner* from its own
RLS policies by default (independent of `BYPASSRLS`). A single shared role
would mean the backend's own queries silently bypass every RLS policy in
`db/migrations/*_rls_policies.sql` and the per-table policies in `008`–`018`
— this was discovered and fixed in migration `020_roles.sql` during Phase 0,
and is continuously verified by `pnpm verify:rls` (`scripts/verify-rls.ts`),
which proves cross-tenant row isolation empirically rather than just
checking that policies exist.

`glix_app` has only row-level `SELECT`/`INSERT`/`UPDATE`/`DELETE` grants —
no `CREATE`, no table ownership, no `BYPASSRLS`. It must never be used to
run migrations or seeds.

### 3. File Attachments Security
- Document attachments are stored on the local/VPS filesystem under the directory defined by `UPLOAD_DIR`.
- All attachment metadata and authorization is tracked in `public.attachments` protected by tenant-scoped RLS.
- File downloads and streams are authenticated via backend API routes that verify organization membership.

### 4. Request-Level Hardening
- **Rate limiting:** `@fastify/rate-limit` is registered globally but **opt-in per route** (`global: false`) — a route is only protected if it explicitly sets `config.rateLimit`. Today that's `POST /v1/auth/login` (10/min per IP) and `POST /v1/auth/register` (5/min per IP), the only unauthenticated credential-bearing routes. Any new public or credential-bearing route must add this explicitly; nothing enforces it automatically.
- **CSP:** the backend is a pure JSON/binary API (it never renders HTML, including the XLSX/document-download endpoints), so Helmet's Content-Security-Policy is set to `default-src 'none'; frame-ancestors 'none'` — there's no first-party script/style to allow.

### 5. Reporting Vulnerabilities
If you discover a security vulnerability, please send an advisory directly to `security@yourcompany.com` rather than opening a public issue.
