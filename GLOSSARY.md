# Domain Glossary

| Term | Definition |
| :--- | :--- |
| **Organization (\`org_id\`)** | The top-level tenant container representing a customer business workspace. |
| **Membership** | A relation mapping a Supabase Auth user to an organization with an assigned role. |
| **Project Owner (\`project_owner\`)** | Global platform super administrator with cross-tenant management privileges. |
| **Organization Admin (\`org_admin\`)** | Primary tenant administrator with full configuration and employee management access. |
| **Organization Staff (\`org_staff\`)** | Operations / HR user with employee and leave processing access. |
| **Organization Viewer (\`org_viewer\`)** | Self-service employee user with access only to own records and leave requests. |
| **Row-Level Security (RLS)** | PostgreSQL kernel-level access enforcement filtering rows by \`org_id\`. |
| **JWT Claims Hook** | PostgreSQL trigger augmenting Supabase Auth tokens with custom claims (\`org_id\`, \`role\`). |
| **Document Vault** | Encrypted S3-compatible private document store with automated 30/60/90-day expiry notifications. |
