# Feature Parity Matrix

| Feature / Capability | Legacy App Status | Replatform Status | Notes / Enhancements |
| :--- | :---: | :---: | :--- |
| **Multi-Step Org Registration** | ✅ Implemented | ✅ Implemented | Streamlined with Zod validation and instant subdomain check |
| **Tenant Login & Session Management** | ✅ Implemented | ✅ Implemented | NextAuth v5 + Fastify JWT verification, httpOnly cookie session |
| **Executive Dashboard & Compliance Score** | ✅ Implemented | ✅ Implemented | Dynamic Recharts visual analytics and compliance health |
| **Employee Directory & Profile CRUD** | ✅ Implemented | ✅ Implemented | Fast pagination, sorting, search, and bulk export |
| **Bulk CSV Import & Excel Export** | ✅ Implemented | ✅ Implemented | Server-side validation with row-by-row error preview |
| **Leave Management & Approval Lifecycle** | ✅ Implemented | ✅ Implemented | Automated entitlement balance decrement and calendar view |
| **Holidays & Leave Calendar** | ✅ Implemented | ✅ Implemented | Full interactive visual calendar with department filtering |
| **Employee Loans & Salary Advances** | ✅ Implemented | ✅ Implemented | Installment tracking with deduction status against payroll |
| **Document Vault & Expiry Alerts** | ✅ Implemented | ✅ Implemented | Self-hosted VPS filesystem storage + automated 30/60/90-day background alerts |
| **Company Announcements & Bulletins** | ✅ Implemented | ✅ Implemented | Priority banner tagging and instant dashboard delivery |
| **Department & Job Title Masters** | ✅ Implemented | ✅ Implemented | Hierarchical department and position taxonomy |
| **Role-Based Permissions (RBAC)** | ✅ Implemented | ✅ Implemented | Granular Postgres RLS policies and frontend gate guards |
| **Reporting Engine & Multi-Format Exports** | ✅ Implemented | ✅ Implemented | PDF, Excel, and CSV export with custom date ranges |
| **Subscription & Plan Limits** | ✅ Implemented | ✅ Implemented | Server-side tier limit enforcement (`canDo(orgId, action)`) |
