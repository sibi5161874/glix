# Session State

## Project
- Name: Glix Connect HR Portal
- Started: 2026-10-05

## Current phase
- Phase: 3 (Leave Management) — **complete**
- Task: —
- Last action: Built and browser-verified Leave Management end-to-end: requests (create/approve/reject/cancel), balances (list + adjust, confirmed the `on_leave_approved` DB trigger correctly increments `used`), leave types config CRUD, holidays config CRUD, and a real month-grid calendar view overlaying holidays + approved leave. 10 new backend tests (41 total). Ran typecheck/lint/test clean across all workspaces.

## Progress
- Phases complete: 0 (Basement), 1 (Auth + Tenancy), 2 (Employees), 3 (Leave Management)
- Phases in progress: —
- Phases pending: 4–11 (manifest numbering; = BUILD_PLAN.md Phases 5–12)
- Files read: 46 (bootstrap) + re-reads during cleanup + Phase 2/3 exploration

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

## Phase 2 details (for resume / handoff)

### Backend (`backend/src/`)
- `app.ts` — new: `buildApp()` factored out of `index.ts` so tests can `fastify.inject` without binding a port. `index.ts` is now just env-load + `buildApp()` + `listen()`.
- `middleware/require-permission.ts` — new top-level folder; `requirePermission(permission)` preHandler wrapping `shared/config/permissions.config.ts`'s `can()`. Platform admins bypass.
- `utils/request-context.ts` — `toRequestContext(auth)`, the one place `AuthClaims` → `RequestContext` conversion happens; throws `ForbiddenError` if the caller has no `orgId`/`role` (not linked to an org).
- `repositories/employee.repository.ts`, `services/employee.service.ts` (+ `employee-import.service.ts`, `employee-export.service.ts`), `controllers/employee.controller.ts`, `routes/v1/employees.routes.ts` — standard layering per `backend-constitution.md` §3–4.
- `repositories/lookup.repository.ts`, `services/lookup.service.ts`, `controllers/lookup.controller.ts`, `routes/v1/lookups.routes.ts` — read-only `/v1/departments`, `/v1/designations` (needed by the create/edit form and list filters).
- `utils/csv.ts` — hand-rolled RFC-4180 parser (quoted fields, escaped `""`), no dependency.
- Tier-limit check (`assertWithinEmployeeLimit` in `employee.service.ts`) **must** run on the same tenant-scoped `PoolClient` as the insert — a separate `fastify.pg` pool connection has no `app.org_id` session var set, so RLS would silently return a zero count. Learned this the hard way during implementation, not in production.
- Dates/timestamps are cast to text in SQL (`to_char(...)`) in `employee.repository.ts`'s `SELECT_COLUMNS` — same reasoning as Phase 1's `023_employee_login_dob_text.sql`: `pg` maps `date`/`timestamptz` to JS `Date`, which silently shifts by the server's local offset.
- New deps: `@fastify/multipart`, `exceljs`, `vitest` (dev) — all in `backend/package.json` and documented in `.agents/rules/backend-constitution.md` §1.

### Frontend (`frontend/src/`)
- New shadcn/ui primitives (hand-built, same pattern as Phase 1): `table.tsx`, `tabs.tsx`, `dialog.tsx`.
- `app/(app)/employees/` — `page.tsx` (list, server component), `employee-filters.tsx` / `employee-pagination.tsx` / `employee-row-actions.tsx` (client), `employee-form.tsx` + `employee-form-fields.tsx` (shared create/edit form, split across two files to stay under RULES.md §3's 250-line cap), `create/page.tsx`, `[id]/page.tsx` (detail + tabs), `[id]/edit/page.tsx`, `import-export/page.tsx` + `types.ts`.
- `lib/employees.ts` — typed `apiFetch` wrappers for the employees/lookups endpoints.
- Sidebar nav: "Employees" enabled (`components/app-shell/sidebar-nav.tsx`).

### Bugs found and fixed during browser verification (not caught by typecheck/lint/unit tests)
- `basicSalary` number input submitted as a string against `z.number()` — RHF's `{...field}` spread doesn't coerce `<input type="number">`'s string value. Fixed with explicit `Number(...)` in `TextField`.
- Create-mode form silently failed with **no visible error and no network request** — `defaultValues` included a `status: undefined` key that doesn't exist on `CreateEmployeeInput`'s shape at all (only `UpdateEmployeeInput` has it); `.strict()` rejects it as an unrecognized key even though the value is `undefined`, because RHF still submits the key. Fixed by omitting it from `defaultValues` outside edit mode. **If a create-mode RHF form using a `.strict()` schema silently won't submit with no error, check for a stray key from the broader "edit" type in `defaultValues` first.**
- Delete returned a raw 500 — `apiFetch` always sent `Content-Type: application/json`, including on bodyless `DELETE`s; Fastify's parser rejects an empty body under that header, and the old `sendError` collapsed every non-`AppError` into a 500 regardless of the real status it carried. Fixed both: `apiFetch` only sets the header when there's a body, and `sendError` now passes through a Fastify client error's real 4xx.

### Verified in-browser (not just typecheck)
- List: search (debounced), filter, pagination with real seeded + created data
- Create → detail page navigation with correct field values
- Edit → status change persisted and reflected on detail page
- Delete → confirm dialog → row removed from list
- Detail page tabs (Info/Documents/Activity) switch correctly; Documents/Activity show the expected "not yet" stub
- XLSX export → 200 response with the right content-type
- CSV import verified via backend integration tests instead of the browser (no file-upload capability in the available browser tool) — happy path, per-row validation failures, and the permission check all covered

### Known Phase 2 simplifications (deliberate, not bugs)
- Import/export have no org-level audit trail beyond the DB's own `audit_employees` trigger (each inserted row is audited individually; there's no single "bulk import" audit event).
- Export has no filter wiring from the list page's current search/filter state — it always exports everything (documented in the UI copy).
- No department/designation management UI yet (Phase 8 per `BUILD_PLAN.md`) — the create/edit form's dropdowns will be empty until an admin seeds them via DB or a future settings page.

## Phase 3 details (for resume / handoff)

### Backend (`backend/src/`)
- No new migration — `011_leave.sql` (Phase 0) already had `leave_types`/`leave_balances`/`leave_requests`/`holidays`, full RLS, and the `on_leave_approved` trigger that increments `leave_balances.used` on approval. This phase is pure application code over an already-complete schema.
- `repositories/leave-type.repository.ts`, `holiday.repository.ts`, `leave-request.repository.ts`, `leave-balance.repository.ts` + matching `services/`, `controllers/`, `routes/v1/leave-types.routes.ts`, `holidays.routes.ts`, `leave-requests.routes.ts`, `leave-balances.routes.ts`.
- `leave-request.service.ts`'s `cancel()` encodes two distinct authorization paths the RLS policies themselves draw: a **self** cancelling their own still-pending request goes through `DELETE` (matches `leave_requests_delete_self_cancel`, which only lets you delete your *own* row); an **admin/staff** cancelling someone else's goes through `UPDATE status='cancelled'` instead (matches `leave_requests_update_admin_or_approver`, which doesn't check `employee_id` at all). Don't collapse these into one code path — the RLS policies genuinely require different operations depending on who's acting.
- No `leaves:requests:cancel` permission key exists in `shared/config/permissions.config.ts` — the route reuses `leaves:requests:create`'s broader role set and leaves the real self-vs-approver check to the service layer. Add a dedicated key if the matrix ever needs finer-grained UI hints here.
- `assertPending()` helper in `leave-request.service.ts` is the one place approve/reject/cancel all check `status === 'pending'` before mutating — a second `/approve` call on an already-approved request correctly 409s (tested).
- Total-days calculation (`countDays` in `leave-request.service.ts`) is inclusive calendar days — **does not exclude weekends or holidays yet**, a deliberate simplification, not a bug.

### Frontend (`frontend/src/`)
- `app/(app)/leaves/` — shared `layout.tsx` + `leave-subnav.tsx` (tabs: Requests / Balances / Types / Calendar / Holidays) wraps every page in the section, including `/holidays` which lives one level up, outside `(app)/leaves/`.
- `leaves/calendar/calendar-grid.tsx` — a real CSS-grid month view (not a list), computed client-side from a server-fetched holidays + approved-leave-requests pair for the given month; month navigation is plain `<Link>`s with `?year=&month=` query params, no client state needed.
- `leaves/types/` and `holidays/` use lightweight controlled-input Dialog forms (no RHF/Zod) rather than the heavier pattern `employees/employee-form.tsx` uses — deliberate: these are small, fixed-shape admin-config forms, not domain entities with many optional fields.
- `middleware.ts` and `sidebar-nav.tsx` updated to protect and surface `/leaves/*` and `/holidays/*`.

### Verified in-browser (not just typecheck)
- Full request lifecycle: create (admin, on behalf of an employee) → approve → balance's `used` column increments by the correct day count (confirmed via the Balances page, cross-checked against the backend trigger).
- Leave Types: create/edit/delete dialogs, all 6 seeded types (`017_org_creation_trigger.sql`) render correctly.
- Holidays: create/delete, correctly appears on the right calendar day.
- Calendar: month navigation, holiday badges and approved-leave badges both render on the correct grid cells.
- **Test-data hygiene note for next session:** `leave.routes.test.ts`'s approve/reject tests create real rows with fixed dates and no natural uniqueness constraint; the suite now tracks and deletes them in `afterAll` via the migration role (`DATABASE_URL_MIGRATE`, same pattern as `scripts/seed.ts`) since approved/rejected requests can't go through the app's own `cancel` endpoint. If you add more leave-request tests, push their IDs onto `createdRequestIds` or you'll get duplicate rows in the dev DB across runs (this bit us once already this session — showed up as literal duplicate rows on the `/leaves/requests` page).

### Known Phase 3 simplifications (deliberate, not bugs)
- `countDays` is calendar-day inclusive — no weekend/holiday exclusion yet. Real payroll systems usually want this; revisit when there's a concrete requirement.
- Leave balance "Remaining" (`allocated + carriedOver - used`) is computed client-side for display only, never trusted server-side for anything (no over/under-allocation enforcement on create — a request can be approved even if it exceeds remaining balance; flagged, not blocking, matches the legacy system's permissive behavior per `docs/legacy-analysis/`).
- Calendar only shows `approved` leave, not `pending` — intentional, avoids showing unconfirmed absences as fact.

## Phase 4 scope notes (BUILD_PLAN.md numbering; = Documents — carried over from Phase 0, not yet acted on)
- Legacy employee form has far more fields than the current `employees` table (passport, visa, Emirates ID, labor card, driving license, medical insurance, SOE/ILOE).
- **Decision (approved by project owner):** reuse `documents` + `document_types` rather than denormalizing onto `employees`; add the missing legacy doc types to the `document_types` seed in `017_org_creation_trigger.sql`; employee profile becomes a view joining `employees` + `documents`.

## Next action
- Await `next` from project owner to start Phase 4 (manifest numbering) / Phase 5 (`BUILD_PLAN.md` numbering) — Documents.

## Last update
- 2026-10-06
