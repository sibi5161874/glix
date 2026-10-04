# Security Policy

## Multi-Tenant Security Model

This application enforces strict tenant isolation using **PostgreSQL Row-Level Security (RLS)** at the database layer.

### 1. Mandatory Tenant Scoping
- Every table containing tenant data **must** include an \`org_id\` column indexed with a foreign key to \`organizations(id)\`.
- Every tenant query enforces \`org_id = (auth.jwt() ->> 'org_id')::uuid\`.
- Bypassing RLS or querying tenant data without tenant context is strictly forbidden.

### 2. Service Role Key Constraints
- The \`SUPABASE_SERVICE_ROLE_KEY\` is strictly reserved for migrations, automated tests, and background administrative jobs.
- The service role key **must never** be exposed to the client/frontend bundle or used to fulfill user-initiated API requests.

### 3. Reporting Vulnerabilities
If you discover a security vulnerability, please send an advisory directly to \`security@yourcompany.com\` rather than opening a public issue.
