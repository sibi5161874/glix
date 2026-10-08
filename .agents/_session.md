# Session State

## Project
- Name: Glix Connect HR Portal
- Started: 2026-10-05

## Current phase
- Phase: 4–6 feature work complete; **this session's last work was a cross-cutting audit-fix pass, not a new phase** — CI, security, and test-debt items raised by an external code-audit of the repo (see "Audit-fix pass" below).
- Task: —
- Last action: Worked through a 15-item ranked audit (CI has no DB, no auth tests, no rate limiting, missing/broken E2E, dependency CVEs, disabled CSP, unfiltered export, duplicated tier-limit logic, no structured error context, an O(2 queries) list endpoint, stale BUILD_PLAN checkboxes, undocumented API versioning). All 15 addressed; #14 (formal a11y pass) deliberately deferred per the audit's own "premature today" call, though 3 concrete icon-button a11y bugs found along the way were fixed. Full backend suite: 67/67 passing (was 43 at the start of this pass). See CHANGELOG.md's two new "(audit-fix pass)" entries for the itemized list.

## Progress
- Phases complete: 0 (Basement), 1 (Auth + Tenancy), 2 (Employees), 3 (Leave Management), 4 (Documents), 5 (Loans + Announcements) — manifest numbering; = BUILD_PLAN.md Phases 1,2,3,4,5,6
- Phases in progress: —
- Phases pending: 6–11 (manifest numbering; = BUILD_PLAN.md Phases 7–12: Reports, Settings, Billing/Support, Superadmin, Polish, Launch)
- Files read: 46 (bootstrap) + re-reads during cleanup + Phase 2/3 exploration + Phase 4-6 verification + audit-fix pass

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

## Phase 4-6 details (Documents, Loans, Announcements — for resume / handoff)

These phases' code wasn't written in this session — it arrived already in the working tree, uncommitted, on top of the Phase 2-3 commit. The entries below are from verifying it before the first commit, not from building it.

### The legacy-employee-fields decision referenced above is now acted on
`documents` + `document_types` is in real use (not just planned) — `document-types.routes.ts`/`document-type.service.ts`/`document-type.repository.ts` give org_admins a config UI at `/documents/types`, and the employee detail page's Documents tab (`employees/[id]/employee-documents-tab.tsx`) lists/uploads against it. The legacy fields (passport, visa, Emirates ID, etc.) still aren't on `employees` directly — they go through `document_types`, matching the original decision.

### Real bugs found during verification (not caught by typecheck/lint/the existing 39 tests)
- **The exact `date`-column JS-Date-parsing pitfall got reintroduced twice**, independently, in code that arrived already written — once in `document.repository.ts` (`issue_date`/`expiry_date`), once in `loan.repository.ts` (`start_month`) — despite it being documented and fixed three separate times earlier this session (auth's DOB, employees' `joiningDate`/`dob`, leave's dates) and despite `document-mapper.ts` now carrying an explicit comment about it. **If you're about to select a `date` column into a repository mapper in this codebase, grep for `to_char.*YYYY-MM-DD` in a sibling repository first and copy that pattern — don't write a fresh `instanceof Date` check.** Both bugs were silent: no error, no failing test, just a row that was one calendar day wrong — only caught by actually reading the UI's displayed date against what was typed in.
- **A response-envelope contract mismatch crashed `/dashboard` outright** (not silent — `TypeError` on every page load). `announcementService.list` returns `{ items, total, page, limit }` like every other list endpoint in this codebase, but `lib/announcements.ts` was typed as if it returned a bare array, and nothing checked that the two sides actually agreed — `apiFetch<T>`'s `T` is caller-asserted, not derived from a runtime schema, so TypeScript had no way to catch this. **This class of bug — frontend `lib/*.ts` response-shape assumptions silently drifting from what the backend actually returns — won't be caught by `pnpm typecheck`. It needs either an actual page load or a frontend integration test; there is still no frontend test suite (flagged back in the Phase 2/3 code-audit too).**
- Both of the above reinforce the same gap: 43 backend tests + clean typecheck/lint was not sufficient to catch either issue. Browser verification before committing is still doing real work in this codebase, not a formality.

### File-size cleanup (RULES.md §3)
Split 4 files that exceeded 250 lines (see CHANGELOG.md for the full list and new file names). No behavior changes, pure extraction.

## Audit-fix pass details (for resume / handoff)

A code-review audit of the repo (not written by this agent — pasted in by the project owner) ranked 15 improvements. All 15 were addressed this session; details below for anything non-obvious.

### CI (`.github/workflows/ci.yml`)
- Main `ci` job: added a `postgres:16` service + `DATABASE_URL`/`DATABASE_URL_MIGRATE`/`JWT_SECRET` env + `db:migrate`/`db:seed` steps before `pnpm test`. **Could not fully dry-run this exact config locally** — no access to a local Postgres superuser password to simulate a truly fresh `glix_ci` database the way the Docker image's `postgres` user would be. Reasoned through the role architecture carefully (020_roles.sql's `glix_app` creation only needs *a* superuser-equivalent role as `DATABASE_URL_MIGRATE`, not literally a role named `glix_user`) but this is the one piece of this session's CI work that's unverified end-to-end. **If the `ci` job fails on its next real run, start here.**
- New `e2e` job: own Postgres service, backend started backgrounded (`nohup ... &`, persists across steps on the same runner — verified this pattern works, not just assumed), `wait-on` for `/health`, then `pnpm --filter frontend test:e2e`. Uploads backend logs + Playwright report as artifacts on failure.

### Playwright / E2E (`frontend/playwright.config.ts`, `frontend/e2e/`)
- **Dev-mode cold-compile flakiness is real and was reproduced repeatedly**, not theoretical: on a freshly started `next dev` server (not `next build`), the first visit to `/dashboard` can take long enough to blow past a 15s `toHaveURL` assertion — same phenomenon Phase 1's notes already documented for `/superadmin/dashboard` ("~28s cold compile, not a bug"). **Fix: in CI (`isCI` check in the config), the webServer command is `pnpm build && pnpm start`, not `pnpm dev`.** A production server has no per-route compile tax. Locally, `pnpm dev` is still used (fast iteration, `reuseExistingServer: true`) — expect occasional first-run flakiness locally, that's normal, not a regression.
- `next build` alone took 70-115s in this environment. `webServer.timeout` is `240_000` (4 min) — don't shrink this without re-timing a cold build first; it already timed out once at 120s.
- The test's own cleanup is belt-and-suspenders: the UI delete step runs normally, but an `afterEach` hook also logs in via the API directly (seeded `owner@acme.test` credentials) and deletes anything matching `E2E-*` — so a failure mid-test still can't leak data into the dev DB the way earlier test files did (see Phase 4-6 section above).

### Rate limiting (`@fastify/rate-limit`)
Registered globally with `global: false` — **routes don't get rate-limited unless they explicitly opt in** via `{ config: { rateLimit: {...} } }` (see `auth.routes.ts`). Only `/v1/auth/login` (10/min) and `/v1/auth/register` (5/min) opt in today. If a future route is public-facing or credential-bearing, it needs the same treatment — nothing enforces this automatically.

### Tier limits (`tier-limit.service.ts`)
**Do not copy the original `isWithinLimit` (`shared/config/tiers.config.ts`) calling convention of `current + aboutToAdd - 1` into new code.** That arithmetic only happens to work for integer counts (employees) — it's subtly wrong for a continuous quantity like storage MB (verified wrong in `tier-limit.service.test.ts`'s "does the math correctly" test, which would fail against the old formula). `assertWithinTierLimit` does `current + aboutToAdd > limit` directly instead; use that function, don't call `isWithinLimit` directly from a service.

### Known gap, explicitly not fixed this pass
Still **zero frontend tests**. The dashboard-crash bug (Phase 4-6 section above) and the response-envelope class of bug it represents is frontend-only and wouldn't be caught by backend tests, typecheck, or lint — only by actually loading the page. The new Playwright E2E test covers one flow; it is not a substitute for broader frontend test coverage.

## Next action
- Await `next` from project owner to start Phase 6 (manifest numbering) / Phase 7 (`BUILD_PLAN.md` numbering) — Reports.
- **Suggested follow-up, not yet actioned:** a frontend unit/component test suite (Vitest + Testing Library, or similar) — still the single biggest gap now that CI, auth tests, rate limiting, and E2E exist.
- **Unverified, flag for next session:** confirm the `ci` job's Postgres service actually works on a real GitHub Actions run (see CI section above) — watch the first PR this branch's work goes through.

## Last update
- 2026-10-08
