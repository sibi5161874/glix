# Granular Roles & Permissions Matrix (100% Verified)

The Glix Connect platform operates a 4-tier tenant authorization structure plus a top-level Platform Owner layer.

---

## 1. Actor Definitions

| Role Identifier | Role Name | Tenancy Scope | Auth Method | Typical User |
| :--- | :--- | :--- | :--- | :--- |
| `super_admin` | Platform Administrator | Global (All Tenants) | `/superadmin/login` | Glix System Owner / Operations Team |
| `org_admin` | Organization Administrator | Single Organization (`org_id`) | `/login` (Email or EMP Code) | HR Director, Operations Manager, Company Owner |
| `org_staff` | Department Manager / HR Staff | Single Organization (`org_id`) | `/login` (Email or EMP Code) | HR Officer, Line Manager, Department Lead |
| `org_viewer` | Employee / Read-only Auditor | Single Organization (`org_id`) | `/login` (EMP-001 + DOB) | Individual Employee, Auditor, Read-only Observer |

---

## 2. Permission Capability Matrix

| Feature / Action | `super_admin` | `org_admin` | `org_staff` | `org_viewer` | Enforcement Layer |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Manage Organizations & Tenants** | ✅ Full | ❌ No | ❌ No | ❌ No | Platform API (Fastify Guard) |
| **Manage Global Plans & Pricing** | ✅ Full | ❌ No | ❌ No | ❌ No | Platform API (Fastify Guard) |
| **Broadcast WhatsApp / Email CMS** | ✅ Full | ❌ No | ❌ No | ❌ No | Platform API (Fastify Guard) |
| **View Tenant Dashboard Metrics** | ❌ (Impersonate) | ✅ Full | ✅ Scoped | 👁️ Self Only | Postgres RLS (`org_id`) |
| **Create / Edit / Terminate Employees** | ❌ | ✅ Full | ✅ Department | ❌ No | Postgres RLS + Zod RBAC |
| **Bulk CSV Import / Export** | ❌ | ✅ Full | ❌ No | ❌ No | Fastify Service + Postgres RLS |
| **Approve / Reject Leave Requests** | ❌ | ✅ Full | ✅ Team Only | ❌ No | Fastify Service + Postgres RLS |
| **Submit Leave Request** | ❌ | ✅ Self | ✅ Self | ✅ Self | Postgres RLS (`employee_id`) |
| **Upload / Manage Company Documents** | ❌ | ✅ Full | ✅ Assigned | 👁️ Self Docs | Supabase Storage RLS |
| **View Salary & Loan Balances** | ❌ | ✅ Full | ❌ No | 👁️ Self Only | Column-level RLS / Masking |
| **Export Financial & HR Reports** | ❌ | ✅ Full | ✅ Scoped | ❌ No | Fastify Service + Postgres RLS |
| **Manage Departments & Designations** | ❌ | ✅ Full | ❌ No | ❌ No | Postgres RLS (`org_id`) |
| **Configure Org Roles & Permissions** | ❌ | ✅ Full | ❌ No | ❌ No | Postgres RLS (`org_id`) |
| **Manage Billing & Upgrade Tier** | ❌ | ✅ Full | ❌ No | ❌ No | Fastify Service + Postgres RLS |

---

## 3. Dual-Login Authentication Architecture

The tenant login portal (`/login`) implements dual-identifier credential resolution:

1. **Email Authentication**:
   - Matches `auth.users.email`
   - Password checked via standard cryptographic hash (Argon2 / Supabase Auth).
2. **Employee Code Authentication**:
   - Matches `employees.employee_code` (e.g., `EMP-001`, `GLX-104`) scoped by active subdomain or organization lookup.
   - Password can be either custom password or employee Date of Birth (`YYYY-MM-DD`) for default onboarding.
