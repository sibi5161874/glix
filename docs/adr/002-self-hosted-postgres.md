# ADR 002: Move from Supabase to Self-Hosted PostgreSQL 16 + VPS Filesystem

## Status
Accepted

## Context
[ADR-001](./001-initial-architecture.md) originally specified Supabase (managed Postgres + Supabase Auth + S3-compatible Storage) as the concrete backing for database, auth, and file storage. The project subsequently moved off Supabase (see git history: `refactor: migrate from supabase to self-hosted postgresql`). `CLAUDE.md`, `ARCHITECTURE.md`, `SECURITY.md`, and migrations `001`–`007` already reflect the new architecture; several docs generated before the move (`DEPLOYMENT.md`, legacy-analysis docs) still described Supabase and needed updating to match.

## Decision
Replace each Supabase-backed capability with a self-hosted equivalent:

| Capability | Was (ADR-001) | Now |
| :--- | :--- | :--- |
| Database | Supabase managed Postgres | Self-hosted PostgreSQL 16, direct `pg` driver via `@fastify/postgres` |
| Tenant isolation | RLS + `auth.jwt() ->> 'org_id'` | RLS + `public.current_org_id()`, reading a Postgres session variable (`app.org_id`) set per-request by Fastify's `withTenant` helper |
| Auth | Supabase Auth, custom JWT claims hook | NextAuth v5 (frontend) issuing a JWT; Fastify verifies it on every backend request and extracts `userId`, `orgId`, `role`, `employeeId`, `isPlatformAdmin` |
| File storage | Private Supabase Storage (S3-compatible), signed URLs | VPS filesystem under `UPLOAD_DIR`, with metadata + authorization in the `attachments` table; downloads always go through an authenticated backend route — no public or signed URLs |

## Consequences
- No managed-service dependency for database, auth, or storage — full control over the Postgres instance and filesystem, at the cost of owning backups, scaling, and uptime ourselves.
- RLS tenant isolation is preserved (still the safety net per `RULES.md` §2), just driven by session variables instead of Supabase's JWT-reading helpers.
- Signed-URL-based direct-to-storage uploads are no longer available; all document upload/download traffic now passes through the Fastify backend, which is simpler to reason about for audit logging (`RULES.md` §2: every document download is written to `audit_log`) but adds backend load for large files.
- Docs and ADR-001 examples that assumed Supabase needed a cleanup pass (tracked in `CHANGELOG.md`) to avoid misleading future contributors or AI agents.
