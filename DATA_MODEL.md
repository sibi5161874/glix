# DATA_MODEL.md

Complete schema reference for Glix Connect HR Portal.
Derived from crawl: `docs/legacy-analysis/04-data-shapes.md`.
Update on **every** migration.

---

## Conventions

Every tenant table:

| Column | Type | Constraint |
| :--- | :--- | :--- |
| `id` | `uuid` | PK, `default gen_random_uuid()` |
| `org_id` | `uuid` | NOT NULL, FK → `organizations(id)` ON DELETE CASCADE |
| `created_at` | `timestamptz` | NOT NULL, `default now()` |
| `updated_at` | `timestamptz` | NOT NULL, `default now()`, auto-trigger |

Global tables (superadmin scope) omit `org_id`.
Every FK is indexed. Every `(org_id, ...)` path is indexed.
RLS enabled on every table. No exceptions (`RULES.md §2`).

---

## Schema Domains

Three domains, three RLS scopes:

1. **Platform** — superadmin only, no `org_id`: `plans`, `platform_users`, `platform_settings`, `platform_templates`
2. **Tenant** — scoped by `org_id`: everything else
3. **Bridge** — cross-cutting: `subscriptions`, `invoices`, `support_tickets`

---

## Platform Tables (superadmin scope)

### `plans`

Defined by superadmin. Every org is on exactly one plan.

| Column | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- |
| `id` | uuid | PK | |
| `name` | text | NOT NULL | e.g. "Starter", "Growth", "Enterprise" |
| `slug` | citext | UNIQUE, NOT NULL | `free`, `pro`, `enterprise` |
| `max_employees` | integer | NOT NULL | 0 = unlimited |
| `max_storage_mb` | integer | NOT NULL | 0 = unlimited |
| `price_aed` | numeric(10,2) | NOT NULL DEFAULT 0 | |
| `price_usd` | numeric(10,2) | NOT NULL DEFAULT 0 | |
| `price_sar` | numeric(10,2) | NOT NULL DEFAULT 0 | |
| `features` | jsonb | NOT NULL DEFAULT '{}' | Capability flags |
| `is_active` | boolean | NOT NULL DEFAULT true | Visible in register wizard |
| `sort_order` | integer | NOT NULL DEFAULT 0 | |
| `created_at` | timestamptz | NOT NULL DEFAULT now() | |
| `updated_at` | timestamptz | NOT NULL DEFAULT now() | |

**RLS:** superadmin read/write only. Public read for `is_active = true` (registration).

---

### `platform_users`

Superadmin team members. Separate from tenant users.

| Column | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- |
| `id` | uuid | PK, FK → `users(id)` | |
| `email` | citext | UNIQUE, NOT NULL | |
| `full_name` | text | NOT NULL | |
| `role` | text | NOT NULL | `owner`, `admin`, `support` |
| `created_at` | timestamptz | NOT NULL DEFAULT now() | |

**RLS:** superadmin read/write. Users read own row.

---

### `platform_settings`

Global config keys (SMTP, WhatsApp, payment gateway, landing CMS, legal pages).

| Column | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- |
| `key` | text | PK | e.g. `smtp.host`, `landing.hero.title` |
| `value` | jsonb | NOT NULL | Flexible per setting |
| `updated_by` | uuid | FK → `platform_users(id)` | |
| `updated_at` | timestamptz | NOT NULL DEFAULT now() | |

**RLS:** superadmin read/write. Anon read for `landing.*` and `legal.*` keys.

---

### `notification_templates`

Email + WhatsApp templates. Global defaults + per-org overrides.

| Column | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- |
| `id` | uuid | PK | |
| `org_id` | uuid | NULLABLE, FK → `organizations(id)` | NULL = platform default |
| `channel` | text | NOT NULL | `email`, `whatsapp` |
| `key` | text | NOT NULL | `doc.expiry.90d`, `leave.approved` |
| `subject` | text | NULLABLE | Email only |
| `body` | text | NOT NULL | Template with `{{vars}}` |
| `is_active` | boolean | NOT NULL DEFAULT true | |
| `created_at` | timestamptz | NOT NULL DEFAULT now() | |

**Unique:** `(org_id, channel, key)`
**RLS:** platform defaults readable by all authed. Org overrides scoped.

---

## Tenant Tables (scoped by `org_id`)

### `organizations`

| Column | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- |
| `id` | uuid | PK | |
| `name` | text | NOT NULL | |
| `slug` | citext | UNIQUE, NOT NULL | Subdomain key |
| `currency` | text | NOT NULL DEFAULT 'AED' | ISO-4217 |
| `phone` | text | NULLABLE | E.164 format |
| `industry` | text | NULLABLE | |
| `logo_url` | text | NULLABLE | |
| `plan_id` | uuid | NOT NULL, FK → `plans(id)` | |
| `owner_id` | uuid | NOT NULL, FK → `users(id)` | |
| `status` | text | NOT NULL DEFAULT 'active' | `active`, `suspended`, `trial`, `churned` |
| `trial_ends_at` | timestamptz | NULLABLE | |
| `created_at` | timestamptz | NOT NULL DEFAULT now() | |
| `updated_at` | timestamptz | NOT NULL DEFAULT now() | |
| `deleted_at` | timestamptz | NULLABLE | Soft delete |

**Indexes:** PK, UNIQUE(slug), `owner_id`, `plan_id`, `status`, `(deleted_at) WHERE deleted_at IS NULL`
**RLS:** members read; admin/owner update; superadmin all
**Trigger:** `on_organization_created` → owner becomes `org_admin` membership + default leave types + default document types

---

### `departments`

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | uuid | PK |
| `org_id` | uuid | NOT NULL, FK |
| `name` | text | NOT NULL |
| `code` | text | NULLABLE |
| `parent_id` | uuid | NULLABLE, FK → `departments(id)` — hierarchy |
| `created_at`, `updated_at` | timestamptz | |

**Unique:** `(org_id, name)`
**RLS:** members read; admin write

---

### `designations`

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | uuid | PK |
| `org_id` | uuid | NOT NULL, FK |
| `title` | text | NOT NULL |
| `level` | integer | NULLABLE |
| `created_at`, `updated_at` | timestamptz | |

**Unique:** `(org_id, title)`
**RLS:** members read; admin write

---

### `employees`

The core entity. Every other tenant table hangs off this.

| Column | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- |
| `id` | uuid | PK | |
| `org_id` | uuid | NOT NULL, FK | |
| `user_id` | uuid | NULLABLE, FK → `users(id)` | Linked portal login |
| `employee_code` | text | NOT NULL | `EMP-001` — used for dual login |
| `first_name` | text | NOT NULL | |
| `last_name` | text | NOT NULL | |
| `email` | citext | NOT NULL | |
| `phone` | text | NULLABLE | E.164 |
| `dob` | date | NULLABLE | Used as default password |
| `gender` | text | NULLABLE | `male`, `female`, `other` |
| `nationality` | text | NULLABLE | |
| `marital_status` | text | NULLABLE | |
| `department_id` | uuid | NULLABLE, FK → `departments(id)` | |
| `designation_id` | uuid | NULLABLE, FK → `designations(id)` | |
| `reporting_manager_id` | uuid | NULLABLE, FK → `employees(id)` | |
| `joining_date` | date | NOT NULL | |
| `employment_type` | text | NOT NULL DEFAULT 'full_time' | `full_time`, `part_time`, `contract` |
| `basic_salary` | numeric(12,2) | NOT NULL DEFAULT 0 | |
| `bank_account` | text | NULLABLE | |
| `iban` | text | NULLABLE | |
| `status` | text | NOT NULL DEFAULT 'active' | `active`, `probation`, `on_leave`, `terminated` |
| `created_at`, `updated_at` | timestamptz | |

**Unique:** `(org_id, employee_code)`, `(org_id, email)`
**Indexes:** `(org_id, status)`, `(org_id, department_id)`, `(org_id, employee_code)` for login
**RLS:**
- Members: read all in org
- Staff: read all in org, write own
- Admin: full CRUD
- Viewer: read own row only (`id` matches JWT `employee_id` claim)

---

### `leave_types`

Per-org configurable.

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | uuid | PK |
| `org_id` | uuid | NOT NULL, FK |
| `name` | text | NOT NULL |
| `code` | text | NOT NULL |
| `days_per_year` | numeric(4,1) | NOT NULL DEFAULT 0 |
| `is_paid` | boolean | NOT NULL DEFAULT true |
| `requires_approval` | boolean | NOT NULL DEFAULT true |
| `is_active` | boolean | NOT NULL DEFAULT true |
| `created_at`, `updated_at` | timestamptz | |

**Unique:** `(org_id, code)`
**RLS:** members read; admin write
**Seeded on org create:** Annual, Sick, Maternity, Paternity, Unpaid

---

### `leave_balances`

One row per employee per leave type per year.

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | uuid | PK |
| `org_id` | uuid | NOT NULL, FK |
| `employee_id` | uuid | NOT NULL, FK |
| `leave_type_id` | uuid | NOT NULL, FK |
| `year` | integer | NOT NULL |
| `allocated` | numeric(4,1) | NOT NULL DEFAULT 0 |
| `used` | numeric(4,1) | NOT NULL DEFAULT 0 |
| `carried_over` | numeric(4,1) | NOT NULL DEFAULT 0 |
| `created_at`, `updated_at` | timestamptz | |

**Unique:** `(org_id, employee_id, leave_type_id, year)`
**RLS:** employee reads own; admin reads all in org, writes

---

### `leave_requests`

| Column | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- |
| `id` | uuid | PK | |
| `org_id` | uuid | NOT NULL, FK | |
| `employee_id` | uuid | NOT NULL, FK | |
| `leave_type_id` | uuid | NOT NULL, FK | |
| `start_date` | date | NOT NULL | |
| `end_date` | date | NOT NULL | |
| `total_days` | numeric(4,1) | NOT NULL | Excludes holidays |
| `reason` | text | NULLABLE | |
| `attachment_url` | text | NULLABLE | |
| `status` | text | NOT NULL DEFAULT 'pending' | `pending`, `approved`, `rejected`, `cancelled` |
| `approved_by` | uuid | NULLABLE, FK → `users(id)` | |
| `approved_at` | timestamptz | NULLABLE | |
| `rejection_reason` | text | NULLABLE | |
| `created_at`, `updated_at` | timestamptz | |

**Indexes:** `(org_id, status)`, `(org_id, employee_id, start_date DESC)`
**RLS:** employee sees own; staff sees team; admin sees all; viewer sees own
**Trigger:** `on_leave_approved` → decrement `leave_balances.used`, update calendar

---

### `holidays`

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | uuid | PK |
| `org_id` | uuid | NOT NULL, FK |
| `name` | text | NOT NULL |
| `date` | date | NOT NULL |
| `is_recurring` | boolean | NOT NULL DEFAULT false |
| `created_at` | timestamptz | NOT NULL DEFAULT now() |

**Unique:** `(org_id, date, name)`
**RLS:** members read; admin write

---

### `document_types`

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | uuid | PK |
| `org_id` | uuid | NOT NULL, FK |
| `name` | text | NOT NULL |
| `code` | text | NOT NULL |
| `requires_expiry` | boolean | NOT NULL DEFAULT true |
| `alert_days` | integer[] | NOT NULL DEFAULT '{90,60,30}' |
| `retention_days` | integer | NULLABLE |
| `is_active` | boolean | NOT NULL DEFAULT true |
| `created_at`, `updated_at` | timestamptz | |

**Unique:** `(org_id, code)`
**RLS:** members read; admin write
**Seeded on org create:** Passport, Visa, Emirates ID, Labor Card, Contract, Degree

---

### `documents`

| Column | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- |
| `id` | uuid | PK | |
| `org_id` | uuid | NOT NULL, FK | |
| `employee_id` | uuid | NOT NULL, FK | |
| `document_type_id` | uuid | NOT NULL, FK | |
| `document_number` | text | NULLABLE | Passport / visa number |
| `issue_date` | date | NULLABLE | |
| `expiry_date` | date | NULLABLE | |
| `file_path` | text | NOT NULL | `{org_id}/{employee_id}/{doc_id}.{ext}` |
| `file_size` | bigint | NOT NULL | Bytes |
| `mime_type` | text | NOT NULL | |
| `alert_90_sent` | boolean | NOT NULL DEFAULT false | |
| `alert_60_sent` | boolean | NOT NULL DEFAULT false | |
| `alert_30_sent` | boolean | NOT NULL DEFAULT false | |
| `uploaded_by` | uuid | NOT NULL, FK → `users(id)` | |
| `created_at`, `updated_at` | timestamptz | |

**Indexes:** `(org_id, employee_id)`, `(org_id, expiry_date)`, `(org_id, document_type_id)`
**RLS:**
- Admin/staff: full CRUD within org
- Employee: read own only
- Viewer: read own only
- Storage: signed URLs via Supabase Storage RLS on path prefix

---

### `loans`

| Column | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- |
| `id` | uuid | PK | |
| `org_id` | uuid | NOT NULL, FK | |
| `employee_id` | uuid | NOT NULL, FK | |
| `principal_amount` | numeric(12,2) | NOT NULL | |
| `monthly_installment` | numeric(12,2) | NOT NULL | |
| `repaid_amount` | numeric(12,2) | NOT NULL DEFAULT 0 | |
| `start_month` | date | NOT NULL | First EMI month |
| `term_months` | integer | NOT NULL | |
| `status` | text | NOT NULL DEFAULT 'pending' | `pending`, `active`, `paid_off`, `rejected` |
| `reason` | text | NULLABLE | |
| `approved_by` | uuid | NULLABLE, FK → `users(id)` | |
| `approved_at` | timestamptz | NULLABLE | |
| `created_at`, `updated_at` | timestamptz | |

**RLS:** admin/staff full within org; employee read own; viewer read own

---

### `announcements`

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | uuid | PK |
| `org_id` | uuid | NOT NULL, FK |
| `title` | text | NOT NULL |
| `body` | text | NOT NULL |
| `priority` | text | NOT NULL DEFAULT 'normal' | `normal`, `high`, `urgent` |
| `publish_at` | timestamptz | NOT NULL DEFAULT now() |
| `expires_at` | timestamptz | NULLABLE |
| `attachment_url` | text | NULLABLE |
| `created_by` | uuid | NOT NULL, FK → `users(id)` |
| `created_at`, `updated_at` | timestamptz | |

**Indexes:** `(org_id, publish_at DESC)`, `(org_id, priority)`
**RLS:** members read; admin/staff write

---

## Bridge Tables (cross-cutting)

### `subscriptions`

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | uuid | PK |
| `org_id` | uuid | NOT NULL, FK |
| `plan_id` | uuid | NOT NULL, FK → `plans(id)` |
| `status` | text | NOT NULL | `active`, `trialing`, `past_due`, `canceled` |
| `currency` | text | NOT NULL | |
| `amount` | numeric(10,2) | NOT NULL |
| `current_period_start` | timestamptz | NOT NULL |
| `current_period_end` | timestamptz | NOT NULL |
| `trial_ends_at` | timestamptz | NULLABLE |
| `gateway` | text | NULLABLE | `stripe`, `paypal`, `manual` |
| `gateway_subscription_id` | text | NULLABLE |
| `created_at`, `updated_at` | timestamptz | |

**RLS:** org admin read; superadmin full

---

### `invoices`

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | uuid | PK |
| `org_id` | uuid | NOT NULL, FK |
| `invoice_number` | text | UNIQUE, NOT NULL |
| `amount` | numeric(10,2) | NOT NULL |
| `tax_amount` | numeric(10,2) | NOT NULL DEFAULT 0 |
| `currency` | text | NOT NULL |
| `status` | text | NOT NULL | `draft`, `open`, `paid`, `void` |
| `gateway` | text | NULLABLE |
| `gateway_invoice_id` | text | NULLABLE |
| `issued_at` | timestamptz | NOT NULL DEFAULT now() |
| `paid_at` | timestamptz | NULLABLE |
| `created_at`, `updated_at` | timestamptz | |

**RLS:** org admin read own; superadmin full

---

### `support_tickets`

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | uuid | PK |
| `org_id` | uuid | NULLABLE, FK | NULL = platform-only |
| `user_id` | uuid | NOT NULL, FK → `users(id)` |
| `subject` | text | NOT NULL |
| `body` | text | NOT NULL |
| `category` | text | NOT NULL | `billing`, `technical`, `hr_feature`, `bug` |
| `priority` | text | NOT NULL DEFAULT 'medium' | `low`, `medium`, `high`, `urgent` |
| `status` | text | NOT NULL DEFAULT 'open' | `open`, `in_progress`, `resolved`, `closed` |
| `assigned_to` | uuid | NULLABLE, FK → `platform_users(id)` |
| `created_at`, `updated_at` | timestamptz | |

**RLS:** org members read own; superadmin full

---

## Migration Timeline

| # | File | What |
| :--- | :--- | :--- |
| 001–007 | (already applied) | Base tenancy, RLS, attachments, session variables |
| 008 | `008_plans.sql` | `plans`, seed 3 tiers |
| 009 | `009_departments_designations.sql` | `departments`, `designations` |
| 010 | `010_employees.sql` | `employees` |
| 011 | `011_leave_types_balances.sql` | `leave_types`, `leave_balances`, `holidays` |
| 012 | `012_leave_requests.sql` | `leave_requests` + approval trigger |
| 013 | `013_document_types_documents.sql` | `document_types`, `documents` |
| 014 | `014_loans.sql` | `loans` |
| 015 | `015_announcements.sql` | `announcements` |
| 016 | `016_subscriptions_invoices.sql` | Billing bridge |
| 017 | `017_support_tickets.sql` | Support |
| 018 | `018_notification_templates.sql` | Templates |
| 019 | `019_platform_users_settings.sql` | Superadmin scope |
| 020 | `020_org_creation_trigger.sql` | Seed defaults on new org |

---

## RLS Policy Matrix

| Table | Select | Insert | Update | Delete |
| :--- | :--- | :--- | :--- | :--- |
| `plans` | all authed (active) | superadmin | superadmin | superadmin |
| `platform_users` | superadmin, self | superadmin | superadmin | superadmin |
| `platform_settings` | superadmin, anon (public keys) | superadmin | superadmin | superadmin |
| `notification_templates` | org members + platform defaults | admin, superadmin | admin, superadmin | admin, superadmin |
| `organizations` | members, superadmin | self-owner | admin, superadmin | — (soft) |
| `departments` | org members | admin | admin | admin |
| `designations` | org members | admin | admin | admin |
| `employees` | org members (viewer: self) | admin, staff | admin, staff(self), viewer(self only) | admin |
| `leave_types` | org members | admin | admin | admin |
| `leave_balances` | admin, self | admin | admin | admin |
| `leave_requests` | admin, staff(team), self | self, admin | admin, approver | self (cancel) |
| `holidays` | org members | admin | admin | admin |
| `document_types` | org members | admin | admin | admin |
| `documents` | admin, staff, self | admin, staff | admin, staff | admin |
| `loans` | admin, staff, self | admin, staff, self | admin, approver | admin |
| `announcements` | org members | admin, staff | admin, staff | admin |
| `subscriptions` | admin, superadmin | superadmin | superadmin | superadmin |
| `invoices` | admin, superadmin | superadmin | superadmin | superadmin |
| `support_tickets` | submitter, admin, superadmin | authed | submitter, admin, superadmin | superadmin |

PO = project owner. Enforced in migration `006_rls_policies.sql` + per-table policies in 008–020.

---

## Data Retention

| Table | Retention | Archive |
| :--- | :--- | :--- |
| `users` | Until account deletion | Cascade |
| `organizations` | 30 days after soft delete | Hard delete + cascade |
| `employees` | Until terminated + 90 days | Anonymize or hard delete |
| `documents` (files) | Per doc type `retention_days` | Cold storage → delete |
| `audit_log` | 12 months hot | Partition by month → S3 |
| `invoices` | 7 years (financial) | Never delete |
| `support_tickets` | 24 months | Archive |

---

## PII Inventory

| Table | Column | Classification |
| :--- | :--- | :--- |
| `users` | `email`, `full_name` | PII |
| `employees` | all except `id`, `org_id`, timestamps | PII |
| `employees` | `bank_account`, `iban` | Sensitive financial |
| `documents` | file contents | PII (ID documents) |
| `audit_log` | `ip_address`, `user_agent` | PII (metadata) |
