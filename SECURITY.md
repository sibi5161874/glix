# Security Policy

## Multi-Tenant Security Model

This application enforces strict tenant isolation using **PostgreSQL Row-Level Security (RLS)** at the database layer.

### 1. Mandatory Tenant Scoping
- Every table containing tenant data **must** include an `org_id` column indexed with a foreign key to `organizations(id)`.
- Every tenant query enforces `org_id = current_org_id()` (backed by PostgreSQL session setting `app.org_id`).
- Fastify middleware / plugins set session variables (`app.user_id`, `app.org_id`, `app.role`, `app.employee_id`, `app.is_platform_admin`) inside a transaction context (`withTenant`) before executing queries.
- Bypassing RLS or querying tenant data without tenant context is strictly forbidden.

### 2. Superuser & Privilege Constraints
- The `SUPERUSER` postgres role is strictly reserved for migrations, automated test setups, and system maintenance.
- Application connections run under a restricted database user role.
- Database credentials must never be exposed to the client/frontend bundle.

### 3. File Attachments Security
- Document attachments are stored on the local/VPS filesystem under the directory defined by `UPLOAD_DIR`.
- All attachment metadata and authorization is tracked in `public.attachments` protected by tenant-scoped RLS.
- File downloads and streams are authenticated via backend API routes that verify organization membership.

### 4. Reporting Vulnerabilities
If you discover a security vulnerability, please send an advisory directly to `security@yourcompany.com` rather than opening a public issue.
