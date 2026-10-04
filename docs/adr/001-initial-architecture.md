# ADR 001: Next.js + Fastify + Supabase Monorepo Architecture

## Status
Accepted

## Context
The legacy application was a monolithic PHP/Bootstrap application with server-rendered pages and tenant isolation enforced solely in application code.

## Decision
We replatform the system to a clean TypeScript monorepo with:
1. **Frontend**: Next.js 16 (App Router) + React 19 + Tailwind CSS + Radix UI primitives.
2. **Backend**: Fastify (Node.js 20) with Zod validation and typed AppErrors.
3. **Database & Tenancy**: PostgreSQL (Supabase) with Row-Level Security (RLS) on 100% of tenant tables.
4. **Auth & Storage**: Supabase Auth with custom claims JWT hook + private S3 storage buckets with time-limited signed URLs.

## Consequences
- 100% database-level tenant isolation guarantee even in the event of application logic defects.
- End-to-end type safety shared between frontend and backend via \`shared/\` package.
