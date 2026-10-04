# Glix Connect HR Portal — Legacy App Analysis & Functional Spec

This directory contains the complete, neutral functional specification and reverse-engineered architecture of the **Glix Connect HR Portal** live application (`https://connect.rmd.city/public/`), captured via automated deep-crawl inspection.

---

## Directory Index

| File | Purpose |
| :--- | :--- |
| **[`_state.md`](_state.md)** | Crawl progress state and phase completion tracking |
| **[`_coverage.md`](_coverage.md)** | Coverage tracker across all 51 URLs, actions, and modal dialogs |
| **[`00-client-brief.md`](00-client-brief.md)** | Original client inputs and target portal endpoints |
| **[`01-inventory.md`](01-inventory.md)** | Module inventory and full ASCII navigation hierarchy |
| **[`02-user-flows.md`](02-user-flows.md)** | Step-by-step user journeys and operational flows |
| **[`03-screens.md`](03-screens.md)** | Exhaustive screen catalog: fields, validations, tables, and buttons (88 KB) |
| **[`04-data-shapes.md`](04-data-shapes.md)** | Inferred database entities, constraints, and relational ERD |
| **[`05-roles-matrix.md`](05-roles-matrix.md)** | Role-Based Access Control (RBAC) permission matrix |
| **[`06-integrations.md`](06-integrations.md)** | External service dependencies and migration targets |
| **[`07-reports-exports.md`](07-reports-exports.md)** | Reporting specifications, date filters, and export definitions |
| **[`08-gaps.md`](08-gaps.md)** | Gap analysis comparing legacy limitations against target architecture |
| **[`09-open-questions.md`](09-open-questions.md)** | Decisions log and open questions tracker |
| **[`10-redesign-notes.md`](10-redesign-notes.md)** | Modernization blueprint and UI improvements |
| **[`11-parity-matrix.md`](11-parity-matrix.md)** | 1:1 feature parity tracking matrix |
| **[`12-new-user-flows.md`](12-new-user-flows.md)** | Modernized architecture sequence diagrams (Next.js + Fastify + Postgres RLS) |
| **[`13-migration-plan.md`](13-migration-plan.md)** | Schema migration and field mapping plan |
| **[`screenshots/`](screenshots/)** | Visual archive of 79 full-page screenshots and modal captures |

---

## Key App Findings Summary

- **Product Name:** Glix Connect HR Portal
- **Domain:** Multi-tenant HR Operations, Leave Management, and Document Automation
- **Target Market:** GCC / UAE (Default Currency: AED `د.إ`, Timezone: `Asia/Dubai`)
- **Key Modules:** Onboarding Wizard, Executive Dashboard, Employees Directory & Bulk CSV Import, Leave Lifecycle & Calendar, Loans & Advances, Announcements, Document Expiry Vault, and Reporting Hub.
