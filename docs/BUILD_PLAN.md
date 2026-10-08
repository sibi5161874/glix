# BUILD_PLAN.md

Ordered feature backlog for Glix Connect replatform.
Derived from `docs/legacy-analysis/11-parity-matrix.md`.
Build bottom-up: foundation → entities → flows → polish.

---

## Phase 1 — Foundation (Week 1)

Migration 008–020 + shared config + Zod schemas.

- [x] Migrations 008–020 (plans → org trigger)
- [x] `shared/config/permissions.config.ts`
- [x] `shared/config/tiers.config.ts`
- [x] `shared/config/document-types.config.ts`
- [x] `shared/config/currency.config.ts`
- [x] Zod schemas (organization, employee, leave, document, loan)
- [x] Seed script: 3 plans + default leave types + doc types

**Deliverable:** DB ready, types shared, no UI.

---

## Phase 2 — Auth + Tenancy (Week 1–2)

- [x] Frontend: `/login` (dual: email OR employee code + DOB)
- [x] Frontend: `/register` (4-step wizard)
- [x] Frontend: `/superadmin/login`
- [x] Backend: JWT verification middleware (bearer-token verify, not JWKS — see ARCHITECTURE.md §5)
- [x] Backend: `POST /v1/auth/register` (registration — the route is named `/register`, not `/create-org`)
- [x] Backend: org creation trigger seeds defaults
- [x] Layout: app shell (sidebar + topbar)
- [x] Layout: superadmin shell

**Deliverable:** Login, register, empty dashboards.

---

## Phase 3 — Employees (Week 2)

- [x] `/employees` list (search, filter, sort, paginate)
- [x] `/employees/create` form (Zod + RHF)
- [x] `/employees/[id]` detail (tabs: Info, Documents, Activity)
- [x] `/employees/import-export` (CSV bulk import + Excel export)
- [x] Backend: employees CRUD (RLS-scoped)
- [x] Backend: CSV parse + validate + bulk insert
- [x] Backend: XLSX export

**Deliverable:** Full employee management.

---

## Phase 4 — Leave Management (Week 3)

- [x] `/leaves/requests` (list + approve/reject/cancel)
- [x] `/leaves/balances` (with adjust modal)
- [x] `/leaves/types` (config CRUD)
- [x] `/holidays` (config CRUD)
- [x] `/leaves/calendar` (visual month view)
- [x] Backend: leave request flow + balance deduction trigger

**Deliverable:** End-to-end leave lifecycle.

---

## Phase 5 — Documents (Week 3–4)

- [x] `/documents/types` (config CRUD)
- [x] `/documents` list (with expiry countdown, search, type & status filters, KPI cards)
- [x] Upload modal with file upload + metadata insert
- [x] Backend: document upload, streaming download & metadata insert (scoped by org_id)
- [x] Backend: document types CRUD & summary metrics
- [x] Employee detail Documents tab integration
- [x] Integration test suite covering documents & document-types

**Deliverable:** Compliance vault with automated alerts.

---

## Phase 6 — Loans + Announcements (Week 4)

- [x] `/payroll/loans` list + create + approve
- [x] EMI schedule & payment deduction tracking
- [x] `/announcements` list + create + edit + delete
- [x] Dashboard widget: recent announcements & summary cards
- [x] Integration test suite covering loans and announcements routes

**Deliverable:** Financial + broadcast features.

---

## Phase 7 — Reports (Week 5)

- [ ] `/reports` hub
- [ ] `/reports/employees` (demographics)
- [ ] `/reports/leaves` (utilization)
- [ ] `/reports/documents` (expiries)
- [ ] `/reports/loans` (balances)
- [ ] Excel + CSV + PDF export for each
- [ ] Backend: server-side filters + export streaming

**Deliverable:** All 4 reports, exportable.

---

## Phase 8 — Settings (Week 5)

- [ ] `/settings/profile` (org branding, currency)
- [ ] `/departments` (hierarchy CRUD)
- [ ] `/designations` (CRUD)
- [ ] `/settings/roles` (RBAC matrix editor)
- [ ] `/settings/templates` (per-org template overrides)

**Deliverable:** Tenant self-configuration.

---

## Phase 9 — Billing + Support (Week 6)

- [ ] `/settings/subscription` (tier change + payment modal)
- [ ] Backend: Stripe/PayPal/Razorpay integration
- [ ] Webhook handling with idempotency
- [ ] `/support` ticket submission + history
- [ ] Superadmin: ticket management

**Deliverable:** Monetization + support loop.

---

## Phase 10 — Superadmin Platform (Week 6–7)

- [ ] `/superadmin/dashboard` (KPIs: orgs, MRR, tickets)
- [ ] `/superadmin/organizations` (list, create, suspend, impersonate)
- [ ] `/superadmin/subscriptions` (list, modify, stripe/paypal links)
- [ ] `/superadmin/plans` (CRUD tier config)
- [ ] `/superadmin/users` + `/team` + `/roles`
- [ ] `/superadmin/invoices` (record manual payment)
- [ ] `/superadmin/support` (escalated tickets)
- [ ] `/superadmin/landing` (CMS for public page)
- [ ] `/superadmin/policies` (legal text editor)
- [ ] `/superadmin/faq`, `/reviews`, `/leads`
- [ ] `/superadmin/email-templates`, `/whatsapp-templates`
- [ ] `/superadmin/settings` (SMTP, WhatsApp, gateways, SSO, storage)

**Deliverable:** Full platform control plane.

---

## Phase 11 — Polish (Week 7–8)

- [ ] Dark mode
- [ ] Mobile responsive pass on all tables
- [ ] Empty states everywhere
- [ ] Loading skeletons everywhere
- [ ] Error boundaries + retry UX
- [ ] Keyboard shortcuts
- [ ] Accessibility audit (WCAG AA)
- [ ] Performance: Lighthouse 90+
- [ ] SEO: metadata, OG tags for landing

**Deliverable:** Production-ready UX.

---

## Phase 12 — Launch (Week 8)

- [ ] E2E Playwright suite (10 critical flows)
- [ ] Load test (k6): 100 concurrent users
- [ ] Security review (`prompts/security-review.md`)
- [ ] Data migration from legacy (dry-run → live)
- [ ] Deploy to Vercel + Fly
- [ ] Smoke test + rollback plan
- [ ] Client handover

**Deliverable:** Live.

---

## Total Estimate

| Phase | Weeks | Priority |
| :--- | :--- | :--- |
| 1–2 Foundation + Auth | 2 | P0 |
| 3 Employees | 1 | P0 |
| 4 Leave | 1 | P0 |
| 5 Documents | 1.5 | P0 |
| 6 Loans + Announcements | 1 | P1 |
| 7 Reports | 1 | P1 |
| 8 Settings | 1 | P1 |
| 9 Billing + Support | 1 | P1 |
| 10 Superadmin | 1.5 | P0 |
| 11 Polish | 1 | P0 |
| 12 Launch | 1 | P0 |
| **Total** | **~12 weeks** | |

With a senior full-stack + AI copilot: **8–10 weeks**.
Solo + AI: **12–16 weeks**.
