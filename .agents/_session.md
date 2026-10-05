# Session State

## Project
- Name: Glix Connect HR Portal
- Started: 2026-10-05

## Current phase
- Phase: 1 (Auth + Tenancy) — **complete**
- Task: —
- Last action: Built and browser-verified login (dual email/employee-code+DOB), 4-step register wizard, superadmin login, app shell + dashboard, superadmin shell + dashboard. Ran typecheck/lint/format clean across all workspaces.

## Progress
- Phases complete: 0 (Basement), 1 (Auth + Tenancy)
- Phases in progress: —
- Phases pending: 2–11
- Files read: 46 (bootstrap) + re-reads during cleanup

## Blockers
- None currently open.

## Phase 1 details (for resume / handoff)

### Backend (`backend/src/`)
- `plugins/auth.plugin.ts` — decorates `fastify.signAuthToken()` and `fastify.authenticate` (JWT verify preHandler, reads `JWT_SECRET`)
- `repositories/auth.repository.ts`, `services/auth.service.ts`, `controllers/auth.controller.ts`, `routes/v1/auth.routes.ts`
- `utils/errors.ts` (`AppError` + subclasses), `utils/http.ts` (`sendSuccess`/`sendError`)
- `index.ts` — **`app.setErrorHandler()` must be registered BEFORE any routes** (Fastify binds the applicable handler onto each route's context at registration time, not dynamically per-request — this bit us once already, don't move it back down)
- New migrations `019`–`023`: `users` INSERT policy + `create_user()` signup function, `glix_app` runtime role (fixes the RLS owner-bypass from Phase 0), pre-auth `SECURITY DEFINER` lookup functions (`find_user_by_email`, `find_employee_login`, `register_organization`, `find_user_memberships`, `is_user_platform_admin`)
- `.agents/rules/backend-constitution.md` §1 updated: added `argon2` (password hashing) and `jsonwebtoken` (JWT) to the approved stack

### Frontend (`frontend/src/`)
- shadcn/ui set up **by hand** (CLI `pnpm dlx shadcn@latest init` hung non-interactively in this environment, twice) — `components.json`, `lib/utils.ts`, Tailwind CSS vars in `globals.css` mirroring `UI_SPEC.md` §0.1, `tailwind.config.ts`. 14 primitives written (see `UI_SPEC.md` §1 for the exact list and what's still missing).
- `auth.ts` — NextAuth v5, Credentials provider calls backend `/v1/auth/login`, backend JWT carried inside the NextAuth session (`session.accessToken`)
- `middleware.ts` — protects `/dashboard`, `/employees`, `/superadmin/*` (except `/superadmin/login`)
- `types/next-auth.d.ts` — module augmentation for the custom session/user fields
- Pages: `login/`, `register/` (4-step wizard, one shared RHF form instance across steps), `superadmin/login/`, `(app)/layout.tsx` + `(app)/dashboard/`, `superadmin/(shell)/layout.tsx` + `superadmin/(shell)/dashboard/`
- **Important env gotcha:** Next.js only auto-loads `.env*` from `frontend/`, not the monorepo root. Fixed by loading the root `.env.local`/`.env` manually at the top of `next.config.mjs` (same file the backend already read via `../env.local`). If a new env var isn't showing up in the frontend, check this first.
- `.env.local` additions: `AUTH_SECRET`, `AUTH_TRUST_HOST=true` (NextAuth v5 reads `AUTH_SECRET`, not just `NEXTAUTH_SECRET`)

### Verified in-browser (not just typecheck)
- Email+password login (org owner) → dashboard, correct role badge
- 4-step register wizard → org/membership created correctly in DB → auto-login → dashboard
- Superadmin login → `/superadmin/dashboard` (first load is slow — ~28s cold Next.js route compile, not a bug)
- Employee-code + DOB login (EMP-001) → dashboard as `org_staff`
- Wrong password / wrong DOB / unlinked employee (EMP-002, no `user_id`) all correctly rejected with generic "invalid credentials" (no information leakage about which case failed)

### Known Phase 1 simplifications (deliberate, not bugs)
- Employee-code login only works if `employees.user_id` is already linked — no auto-provisioning a portal user on an employee's first login yet.
- `employee_code` is only unique per-org (not globally); with no subdomain/org-scoping on login yet, a duplicate code across two orgs is rejected as ambiguous rather than resolved. Fine for now — only one org's worth of demo employees exist.
- Dashboard KPI tiles are static placeholders (`—`) — real data arrives with Employees/Leave/Documents/Loans in later phases, per `BUILD_PLAN.md`.
- Sidebar nav shows all modules but only "Dashboard" is a real link; the rest are visibly disabled (not 404s) until their phases land.

## Phase 3 scope notes (carried over from Phase 0, not yet acted on)
- Legacy employee form has far more fields than the current `employees` table (passport, visa, Emirates ID, labor card, driving license, medical insurance, SOE/ILOE).
- **Decision (approved by project owner):** reuse `documents` + `document_types` rather than denormalizing onto `employees`; add the missing legacy doc types to the `document_types` seed in `017_org_creation_trigger.sql`; employee profile becomes a view joining `employees` + `documents`.

## Next action
- Await `next` from project owner to start Phase 2 (Employees).

## Last update
- 2026-10-05
