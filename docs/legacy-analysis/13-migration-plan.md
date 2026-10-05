# Data Migration Plan & Schema Mapping

---

## Source Architecture
- **Type:** MySQL (Laravel Eloquent ORM)
- **Access:** Database Dump / JSON REST API / CSV Batch Export
- **Tenancy:** Soft isolation via `org_id` column without DB-level RLS

---

## Target Architecture
- **Type:** PostgreSQL 16 (self-hosted PostgreSQL 16 + VPS filesystem)
- **Tenancy:** Strict Row-Level Security (`org_id = public.current_org_id()`, backed by Fastify-set session variable `app.org_id`) on 100% of tables
- **Storage:** VPS filesystem under `UPLOAD_DIR`, metadata + authorization tracked in the `attachments` table, served via authenticated backend routes (no public buckets)

---

## Field-by-Field Mapping Matrix

### 1. Organizations & Workspaces
| Legacy Table | Legacy Field | Target Table | Target Field | Transform / Rule | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenants` / `orgs` | `id` | `organizations` | `id` | `UUIDv5(namespace, legacy_id)` | Deterministic UUID generation |
| `tenants` | `name` | `organizations` | `name` | Trim whitespace | Company legal name |
| `tenants` | `subdomain` / `slug` | `organizations` | `slug` | `LOWER(slug)` | Subdomain routing key |
| `tenants` | `currency` | `organizations` | `currency` | Default to `'AED'` if NULL | ISO-4217 Currency Code |
| `tenants` | `phone` | `organizations` | `phone` | Normalize E.164 (`+971...`) | Organization main phone |
| `tenants` | `industry` | `organizations` | `industry` | Text sanitization | Business category |
| `tenants` | `plan` | `organizations` | `plan_id` | Map: `free`→`free`, `pro`→`pro` | Subscription tier |
| `tenants` | `created_at` | `organizations` | `created_at` | Preserve timestamp (`TIMESTAMPTZ`) | Audit trail |

### 2. Employee Master Records
| Legacy Table | Legacy Field | Target Table | Target Field | Transform / Rule | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `employees` | `id` | `employees` | `id` | `UUIDv5(namespace, legacy_id)` | Primary Key |
| `employees` | `tenant_id` | `employees` | `org_id` | Foreign Key → `organizations.id` | Tenant isolation scope |
| `employees` | `emp_code` | `employees` | `employee_code` | Uppercase (e.g. `EMP-001`) | Unique per organization |
| `employees` | `first_name` | `employees` | `first_name` | Trim whitespace | First Name |
| `employees` | `last_name` | `employees` | `last_name` | Trim whitespace | Last Name |
| `employees` | `email` | `employees` | `email` | `LOWER(TRIM(email))` | Work / Personal email |
| `employees` | `phone` | `employees` | `phone` | Normalize E.164 format | Contact number |
| `employees` | `dept_id` | `employees` | `department_id` | FK mapping → `departments.id` | Department |
| `employees` | `desig_id` | `employees` | `designation_id` | FK mapping → `designations.id` | Job position |
| `employees` | `join_date` | `employees` | `joining_date` | `DATE` format (`YYYY-MM-DD`) | Date of joining |
| `employees` | `basic_salary` | `employees` | `salary_basic` | `CAST(... AS NUMERIC(12,2))` | Monthly base salary |
| `employees` | `status` | `employees` | `status` | Map: `1`→`active`, `0`→`terminated` | Status enum |

### 3. Leave Requests & Balances
| Legacy Table | Legacy Field | Target Table | Target Field | Transform / Rule | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `leave_applications`| `id` | `leave_requests` | `id` | `UUIDv5(namespace, legacy_id)` | Request ID |
| `leave_applications`| `tenant_id` | `leave_requests` | `org_id` | FK → `organizations.id` | Tenant isolation scope |
| `leave_applications`| `employee_id`| `leave_requests` | `employee_id` | FK → `employees.id` | Applicant |
| `leave_applications`| `type_id` | `leave_requests` | `leave_type_id` | FK → `leave_types.id` | Annual / Sick / Emergency |
| `leave_applications`| `start_date` | `leave_requests` | `start_date` | `DATE` format | From date |
| `leave_applications`| `end_date` | `leave_requests` | `end_date` | `DATE` format | To date |
| `leave_applications`| `total_days` | `leave_requests` | `days_count` | `NUMERIC(4,1)` | Total days |
| `leave_applications`| `status` | `leave_requests` | `status` | Map: `pending`, `approved`, `rejected` | Workflow status |

### 4. Documents & Compliance Vault
| Legacy Table | Legacy Field | Target Table | Target Field | Transform / Rule | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `employee_docs` | `id` | `documents` | `id` | `UUIDv5(namespace, legacy_id)` | Document ID |
| `employee_docs` | `tenant_id` | `documents` | `org_id` | FK → `organizations.id` | Tenant isolation scope |
| `employee_docs` | `employee_id` | `documents` | `employee_id` | FK → `employees.id` | Target employee |
| `employee_docs` | `category_id` | `documents` | `document_type_id` | FK → `document_types.id` | Passport / Visa / Emirates ID |
| `employee_docs` | `doc_number` | `documents` | `document_number` | Trim uppercase | ID / Policy / Visa number |
| `employee_docs` | `expiry_date` | `documents` | `expiry_date` | `DATE` format | Expiration date |
| `employee_docs` | `file_path` | `documents` | `file_path` | Copy into `UPLOAD_DIR/{org_id}/{employee_id}/` on the VPS filesystem | Backend-authenticated download, no public URL |

---

## Data Cleaning & Transformation Rules
1. **Deduplication:** Check for duplicate email addresses within the same `org_id`.
2. **Phone Normalization:** Convert all mobile numbers to standardized E.164 (`+971 50 xxx xxxx`).
3. **Enum Normalization:** Map disparate status codes (`0`, `1`, `'active'`, `'inactive'`) into strict PostgreSQL enums (`'active'`, `'probation'`, `'terminated'`, `'on_leave'`).
4. **Dates:** Parse and normalize legacy timestamps into ISO 8601 UTC `TIMESTAMPTZ`.

---

## Execution Checklist & Rollback Strategy

### Pre-Migration
- [ ] Freeze writes on legacy production portal.
- [ ] Take full MySQL database snapshot & legacy file-storage backup.
- [ ] Run dry-run migration script against a test self-hosted PostgreSQL 16 instance.
- [ ] Verify zero foreign key violations and verify RLS tenant isolation.

### Cutover
- [ ] Execute production migration script against the self-hosted PostgreSQL 16 instance.
- [ ] Execute `verify-tenant-isolation.ts` automated assertion suite.
- [ ] Point application DNS to Next.js + Fastify instances.
- [ ] Verify live logins and authenticated document download routes.

### Rollback Plan
- [ ] Revert DNS entries to legacy server if blocking issues are detected within 2-hour observation window.
