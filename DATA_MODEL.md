# DATA_MODEL.md

Complete schema reference. Update on **every** migration.
See [`docs/architecture/entity-relationships.mermaid`](docs/architecture/entity-relationships.mermaid).

---

## Conventions

Every tenant table MUST have:

| Column | Type | Constraint |
| :--- | :--- | :--- |
| `id` | `uuid` | PK, `default gen_random_uuid()` |
| `org_id` | `uuid` | NOT NULL, FK → `organizations(id)` ON DELETE CASCADE |
| `created_at` | `timestamptz` | NOT NULL, `default now()` |
| `updated_at` | `timestamptz` | NOT NULL, `default now()`, auto-updated by trigger |

Every FK is indexed. Every `(org_id, ...)` access path is indexed.
RLS enabled on every table. No exceptions (`RULES.md §2`).

---

## Tables (v1 — implemented)

### `users`

Mirror of `auth.users`, queryable from client. Kept in sync by trigger.

| Column | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- |
| `id` | uuid | PK, FK → `auth.users(id)` | Same as auth user id |
| `email` | citext | unique, not null | Case-insensitive |
| `full_name` | text | | From OAuth or signup |
| `avatar_url` | text | | |
| `created_at` | timestamptz | not null default now() | |
| `updated_at` | timestamptz | not null default now() | |

**Indexes:** PK, unique(email)
**RLS:** self-read; org members can read each other; project owner reads all
**Trigger:** `on_auth_user_created` → `handle_new_auth_user()`

---

### `project_owners`

Cross-tenant role. Highest privilege. Grants edit access to tiers and global config.

| Column | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- |
| `user_id` | uuid | PK, FK → `users(id)` ON DELETE CASCADE | |
| `created_at` | timestamptz | not null default now() | |

**RLS:** self-read + project-owner-read
**Write access:** `service_role` only

---

### `organizations`

A tenant. One per company.

| Column | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- |
| `id` | uuid | PK | |
| `name` | text | not null | Display name |
| `slug` | citext | unique, not null | URL-safe; used in URLs |
| `owner_id` | uuid | not null, FK → `users(id)` | Creator; auto-admin |
| `tier` | text | not null default `'free'`, check in (`free`, `pro`) | Denormalized from tier config for fast gate checks |
| `logo_url` | text | | |
| `created_at` | timestamptz | not null default now() | |
| `updated_at` | timestamptz | not null default now() | |
| `deleted_at` | timestamptz | | Soft delete; hard delete via cron after 30 days |

**Indexes:** PK, unique(slug), `owner_id`, `tier`
**RLS:** members read; admin/owner update; project owner all
**Trigger:** `on_organization_created` → `handle_new_organization()` inserts owner as `org_admin`

---

### `memberships`

User ↔ Organization with role. The authorization core.

| Column | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- |
| `id` | uuid | PK | |
| `org_id` | uuid | not null, FK → `organizations(id)` | |
| `user_id` | uuid | not null, FK → `users(id)` | |
| `role` | `org_role` | not null default `'org_staff'` | enum: `org_admin`, `org_staff`, `org_viewer` |
| `invited_by` | uuid | FK → `users(id)` | |
| `invited_at` | timestamptz | | |
| `accepted_at` | timestamptz | | null = pending invite |
| `created_at` | timestamptz | not null default now() | |
| `updated_at` | timestamptz | not null default now() | |

**Unique:** `(org_id, user_id)`
**Indexes:** `user_id`, `org_id`, `(org_id, user_id)` composite, partial `(user_id) WHERE accepted_at IS NOT NULL` (for hook)
**RLS:** members read; admin/owner write
**Used by:** JWT hook (`005_jwt_claims_hook.sql`)

**Role capabilities:**

| Action | org_admin | org_staff | org_viewer |
| :--- | :--- | :--- | :--- |
| View employees | ✅ | ✅ | ✅ |
| Create/edit employees | ✅ | ⚠️ self only | ❌ |
| Delete employees | ✅ | ❌ | ❌ |
| Upload own docs | ✅ | ✅ | ❌ |
| Upload others' docs | ✅ | ❌ | ❌ |
| Manage members | ✅ | ❌ | ❌ |
| View audit log | ✅ | ❌ | ❌ |
| Manage billing | ✅ | ❌ | ❌ |

Full matrix in `config/permissions.config.ts` (Step 7).

---

### `audit_log`

Append-only. Never updated, never deleted.

| Column | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- |
| `id` | uuid | PK | |
| `org_id` | uuid | FK → `organizations(id)` | null for global events |
| `actor_id` | uuid | FK → `users(id)` | |
| `action` | text | not null | e.g. `doc.upload`, `role.change`, `tier.edit` |
| `entity_type` | text | | e.g. `document`, `membership` |
| `entity_id` | uuid | | |
| `metadata` | jsonb | not null default `'{}'` | Diff, old/new values, context |
| `ip_address` | inet | | |
| `user_agent` | text | | |
| `created_at` | timestamptz | not null default now() | |

**Indexes:** `(org_id, created_at DESC)`, `actor_id`, `action`
**RLS:** admin/owner read; authenticated insert
**Triggers:** `audit_log_no_update`, `audit_log_no_delete` (block mutations at DB)

**Action naming:** `{entity}.{verb}` — `auth.login`, `member.invite`,
`role.change`, `doc.upload`, `doc.download`, `doc.delete`,
`tier.edit`, `org.update`, `org.delete`.

---

## Tables (planned — not yet implemented)

Ordered by expected build order. Each gets a migration + this table updated.

| Table | Purpose | Step |
| :--- | :--- | :--- |
| `employees` | Employee records | 8 |
| `document_types` | Per-org doc type definitions | 8 |
| `documents` | Document metadata (files in Storage) | 8 |
| `document_versions` | Version history | 8 |
| `document_approvals` | Approval workflow (if enabled) | TBD |
| `invitations` | Pending invites before user signup | 8 |
| `custom_field_definitions` | If custom fields enabled | TBD |
| `employee_field_values` | Custom field values | TBD |
| `subscriptions` | Tier subscriptions + billing history | 9 |
| `tier_limits` | Per-tier limit overrides (owner-editable) | 9 |
| `notifications` | In-app notifications | TBD |

---

## ER Diagram

See [`docs/architecture/entity-relationships.mermaid`](docs/architecture/entity-relationships.mermaid).

---

## RLS Policy Matrix

| Table | Select | Insert | Update | Delete |
| :--- | :--- | :--- | :--- | :--- |
| `users` | self, org-mates, PO | — (trigger) | self | — |
| `project_owners` | self, PO | — (service) | — | — |
| `organizations` | member, owner, PO | self-owner | admin, PO | — (soft) |
| `memberships` | same-org, self, PO | admin, PO | admin, PO | admin, PO |
| `audit_log` | admin, PO | authenticated | never | never |
| `storage.objects` | org-prefix | org-prefix | org-prefix | admin only |

PO = project owner. Enforced in migration `006_rls_policies.sql`.

---

## Migration Timeline

| # | File | What |
| :--- | :--- | :--- |
| 001 | `001_extensions.sql` | Extensions, `set_updated_at` trigger fn |
| 002 | `002_organizations.sql` | `users`, `organizations`, new-user trigger |
| 003 | `003_memberships.sql` | `memberships`, `org_role` enum, new-org trigger |
| 004 | `004_audit_log.sql` | `audit_log`, append-only triggers |
| 005 | `005_jwt_claims_hook.sql` | `project_owners`, JWT custom-claims function |
| 006 | `006_rls_policies.sql` | RLS enable + all policies |
| 007 | `007_storage_buckets.sql` | `org-documents` bucket + storage RLS |

Future migrations: `008_...` onward. Never edit past migrations (`RULES.md §1`).

---

## Data Retention

| Table | Retention | Archive strategy |
| :--- | :--- | :--- |
| `users` | Until user deletes account | Hard delete + cascade |
| `organizations` | 30 days after soft delete | Hard delete + cascade |
| `memberships` | Until removed | Cascade on org/user delete |
| `audit_log` | 12 months hot | Partition by month → S3 archive |
| `documents` (files) | Per doc type (see `config/document-types.config.ts`) | Cold storage after retention |

Retention is enforced by cron jobs (Step 8).

---

## PII Inventory

Columns containing PII — tracked in `SECURITY.md`:

| Table | Columns | Classification |
| :--- | :--- | :--- |
| `users` | `email`, `full_name` | PII |
| `employees` (planned) | All except `id`, `org_id`, `created_at` | PII |
| `documents` (planned) | File contents | PII (may include ID docs) |
| `audit_log` | `ip_address`, `user_agent` | PII (metadata) |

Encryption at rest: Supabase-managed. App-level column encryption
for high-sensitivity fields added if required by client (ADR).
