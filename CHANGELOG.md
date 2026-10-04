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

### Changed
- `README.md` — replaced placeholder with full project documentation.
- `package.json` — added database management and verification scripts (`db:*`).

### Security
- Env validation via Zod at runtime boundaries (`shared/config/env.ts`).
- Enforced PostgreSQL Row Level Security (RLS) across all tenant tables and private storage buckets.
- Append-only `audit_log` with database trigger blocking updates and deletes.

---

## How to update this file

- Add entries under `## [Unreleased]` as you merge PRs.
- Group under: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
- On release: rename `[Unreleased]` → `[x.y.z] - YYYY-MM-DD` and add a fresh `[Unreleased]`.
- One line per meaningful change. Link PRs when useful.
