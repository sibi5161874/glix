# Domain Glossary

| Term | Definition |
| :--- | :--- |
| **Organization (`org_id`)** | The top-level tenant container representing a customer business workspace. |
| **Membership** | A relation mapping an application user to an organization with an assigned role. |
| **Project Owner (`project_owner`)** | Global platform super administrator with cross-tenant management privileges. |
| **Organization Admin (`org_admin`)** | Primary tenant administrator with full configuration and employee management access. |
| **Organization Staff (`org_staff`)** | Operations / HR user with employee and leave processing access. |
| **Organization Viewer (`org_viewer`)** | Self-service employee user with access only to own records and leave requests. |
| **Row-Level Security (RLS)** | PostgreSQL kernel-level access enforcement filtering rows by `org_id` using session variables (`app.org_id`). |
| **Tenant Session Variables** | PostgreSQL settings (`app.user_id`, `app.org_id`, `app.role`) initialized per transaction by Fastify `withTenant`. |
| **Document Vault** | Secure filesystem attachment storage with database metadata and automated expiry tracking. |
