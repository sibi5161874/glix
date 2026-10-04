# BUILD_PLAN.md

Ordered feature backlog for Glix Connect replatform.
Derived from `docs/legacy-analysis/11-parity-matrix.md`.
Build bottom-up: foundation → entities → flows → polish.

---

## Phase 1 — Foundation (Week 1)

Migration 008–020 + shared config + Zod schemas.

- [ ] Migrations 008–020 (plans → org trigger)
- [ ] `shared/config/permissions.config.ts`
- [ ] `shared/config/tiers.config.ts`
- [ ] `shared/config/document-types.config.ts`
- [ ] `shared/config/currency.config.ts`
- [ ] Zod schemas (organization, employee, leave, document, loan)
- [ ] Seed script: 3 plans + default leave types + doc types

**Deliverable:** DB ready, types shared, no UI.

---

## Phase 2 — Auth + Tenancy (Week 1–2)

- [ ] Frontend: `/login` (dual: email OR employee code + DOB)
- [ ] Frontend: `/register` (4-step wizard)
- [ ] Frontend: `/superadmin/login`
- [ ] Backend: JWT verification middleware (JWKS)
- [ ] Backend: `POST /v1/auth/create-org` (registration)
- [ ] Backend: org creation trigger seeds defaults
- [ ] Layout: app shell (sidebar + topbar)
- [ ] Layout: superadmin shell

**Deliverable:** Login, register, empty dashboards.

---

## Phase 3 — Employees (Week 2)

- [ ] `/employees` list (search, filter, sort, paginate)
- [ ] `/employees/create` form (Zod + RHF)
- [ ] `/employees/[id]` detail (tabs: Info, Documents, Activity)
- [ ] `/employees/import-export` (CSV bulk import + Excel export)
- [ ] Backend: employees CRUD (RLS-scoped)
- [ ] Backend: CSV parse + validate + bulk insert
- [ ] Backend: XLSX export

**Deliverable:** Full employee management.

---

## Phase 4 — Leave Management (Week 3)

- [ ] `/leaves/requests` (list + approve/reject)
- [ ] `/leaves/balances` (with adjust modal)
- [ ] `/leaves/types` (config CRUD)
- [ ] `/holidays` (config CRUD)
- [ ] `/leaves/calendar` (visual month view)
- [ ] Backend: leave request flow + balance deduction trigger

**Deliverable:** End-to-end leave lifecycle.

---

## Phase 5 — Documents (Week 3–4)

- [ ] `/documents/types` (config CRUD)
- [ ] `/documents` list (with expiry countdown)
- [ ] Upload modal → signed URL flow
- [ ] Backend: signed upload URL issuance
- [ ] Backend: document metadata insert
- [ ] Backend: cron job for 90/60/30-day alerts
- [ ] Notification template wiring (email)

**Deliverable:** Compliance vault with automated alerts.

---

## Phase 6 — Loans + Announcements (Week 4)

- [ ] `/payroll/loans` list + create + approve
- [ ] EMI schedule computation
- [ ] `/announcements` list + create
- [ ] Dashboard widget: recent announcements

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
