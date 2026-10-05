# ADR 001: Next.js + Fastify + PostgreSQL Monorepo Architecture

## Status
Superseded by [ADR-002](./002-self-hosted-postgres.md). Kept for historical context.

## Context
The legacy application was a monolithic PHP/Bootstrap application with server-rendered pages and tenant isolation enforced solely in application code.

## Decision
We replatform the system to a clean TypeScript monorepo with:
1. **Frontend**: Next.js (App Router) + React + Tailwind CSS + shadcn/ui.
2. **Backend**: Fastify (Node.js 20) with Zod validation and typed AppErrors.
3. **Database & Tenancy**: PostgreSQL with Row-Level Security (RLS) on 100% of tenant tables.
4. **Auth & Storage**: JWT-based auth with custom claims + private file storage with time-limited signed access.

## Consequences
- 100% database-level tenant isolation guarantee even in the event of application logic defects.
- End-to-end type safety shared between frontend and backend via \`shared/\` package.

## Note
This ADR originally specified Supabase (managed Postgres + Auth + S3-compatible storage) as the concrete implementation of items 3–4. That choice was reversed — see ADR-002 for the self-hosted replacement and rationale.
