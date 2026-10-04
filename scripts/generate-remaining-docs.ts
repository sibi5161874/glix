import * as fs from "fs";

// 02-user-flows.md
const userFlowsMd = `# User Flows Specification

This document details key operational and user journeys through the application.

---

## Flow 1: Organization Onboarding & Registration

- **Trigger:** New tenant signs up from landing page (\`/register\`).
- **Actor:** Organization Administrator (\`org_admin\`).
- **Preconditions:** Unregistered tenant.
- **Steps:**
  1. Navigate to \`/register\`.
  2. **Step 1 (Admin Details):** Enter Administrator Full Name, Email Address, Password, Password Confirmation. Validate password minimum 8 characters.
  3. **Step 2 (Organization Details):** Enter Organization Name, auto-generate/verify Subdomain/Slug, Phone Number, Default Base Currency (AED, USD, EUR, GBP, INR, SAR, QAR, OMR, BHD), Industry Category.
  4. **Step 3 (Plan Selection):** Select Tier Plan (Free Version or Pro Tier).
  5. **Step 4 (Finalize & Provision):** Click "Complete Signup". Backend provisions organization record, assigns default admin role, creates default leave types and document categories, and establishes session.
- **Postconditions:** Organization is active; admin redirected to executive dashboard (\`/dashboard\`).
- **Success Signal:** Redirect to \`/dashboard\` with banner "Welcome back, [Admin Name]!".

---

## Flow 2: Employee Creation & Profile Management

- **Trigger:** Admin or HR Staff creates a new employee record.
- **Actor:** \`org_admin\` or \`org_staff\`.
- **Preconditions:** Department and Designation optionally configured.
- **Steps:**
  1. Navigate to \`/employees\` and click "Add Employee" (\`/employees/create\`).
  2. Fill **Personal Details:** Full Name, Email Address, Phone Number, Date of Birth, Gender, Nationality, Marital Status.
  3. Fill **Employment Details:** Employee Code / ID, Department ID, Designation ID, Joining Date, Employment Type (Full-time, Part-time, Contract), Reporting Manager.
  4. Fill **Compensation Details:** Basic Salary, Allowances, Payment Mode, Bank Account / IBAN.
  5. Submit form.
- **Postconditions:** New employee record created with initial leave entitlements allocated.

---

## Flow 3: Leave Request & Approval Lifecycle

- **Trigger:** Employee or HR requests time off.
- **Actor:** Employee / \`org_staff\` / \`org_admin\`.
- **Preconditions:** Leave types configured and balance available.
- **Steps:**
  1. Navigate to \`/leaves/requests\`.
  2. Click "Apply Leave" modal. Select Employee, Leave Type (Annual, Sick, Emergency, Unpaid), Start Date, End Date, Reason / Notes, and optional Attachment.
  3. System calculates number of working days excluding public holidays.
  4. Request submitted with status \`pending\`.
  5. Admin or Line Manager reviews request in \`/leaves/requests\`.
  6. Admin clicks "Approve" or "Reject".
  7. On approval: Employee leave balance decremented, calendar updated.
- **Success Signal:** Status badge changes to \`Approved\` and appears on \`/leaves/calendar\`.

---

## Flow 4: Document Upload & Expiry Tracking

- **Trigger:** HR uploads compliance documents (Passport, Visa, Emirates ID, Labor Card, Contract).
- **Actor:** \`org_admin\` / \`org_staff\`.
- **Steps:**
  1. Navigate to \`/documents\`.
  2. Click "Upload Document" modal.
  3. Select Employee, Document Category (Passport, Visa, National ID, Driving License, Degree Certificate, Insurance, Contract), Document Number, Issue Date, Expiry Date, and File Attachment (PDF, JPG, PNG).
  4. Set Alert Window (30, 60, 90 days before expiry).
  5. Submit upload.
- **Postconditions:** Document encrypted/stored, expiry scheduled in cron notification queue.

---

## Flow 5: Employee Loans & Salary Advances

- **Trigger:** Employee requests financial advance / loan.
- **Actor:** \`org_admin\` / \`org_staff\`.
- **Steps:**
  1. Navigate to \`/payroll/loans\`.
  2. Click "New Loan Application".
  3. Select Employee, Loan Amount, Repayment Term (Months), Monthly Deduction EMI, Start Month, Reason.
  4. Admin approves loan. System schedules deductions against payroll batches.

---

## Flow 6: Company Announcements & Bulletins

- **Trigger:** Management broadcasts notice to staff.
- **Actor:** \`org_admin\`.
- **Steps:**
  1. Navigate to \`/announcements\`.
  2. Click "Create Announcement".
  3. Enter Title, Content, Priority (Normal, High, Urgent), Publish Date, Expiry Date, Attachment.
  4. Publish notice. Visible on all user dashboard feeds.
`;

fs.writeFileSync("docs/legacy-analysis/02-user-flows.md", userFlowsMd);

// 04-data-shapes.md
const dataShapesMd = `# Data Shapes & Entity Relationships

This document outlines the inferred data schemas and relational models derived from DOM inspection, form payloads, and application tables.

---

## Inferred Relational Schema

\`\`\`mermaid
erDiagram
    ORGANIZATIONS ||--o{ USERS : "has members"
    ORGANIZATIONS ||--o{ DEPARTMENTS : "contains"
    ORGANIZATIONS ||--o{ DESIGNATIONS : "defines"
    ORGANIZATIONS ||--o{ EMPLOYEES : "employs"
    ORGANIZATIONS ||--o{ LEAVE_TYPES : "configures"
    ORGANIZATIONS ||--o{ HOLIDAYS : "observes"
    ORGANIZATIONS ||--o{ DOCUMENT_TYPES : "defines"
    ORGANIZATIONS ||--o{ ANNOUNCEMENTS : "publishes"

    DEPARTMENTS ||--o{ EMPLOYEES : "assigns"
    DESIGNATIONS ||--o{ EMPLOYEES : "categorizes"

    EMPLOYEES ||--o{ LEAVE_REQUESTS : "submits"
    EMPLOYEES ||--o{ LEAVE_BALANCES : "tracks"
    EMPLOYEES ||--o{ DOCUMENTS : "owns"
    EMPLOYEES ||--o{ LOANS : "borrows"

    LEAVE_TYPES ||--o{ LEAVE_REQUESTS : "classifies"
    LEAVE_TYPES ||--o{ LEAVE_BALANCES : "allocates"
    DOCUMENT_TYPES ||--o{ DOCUMENTS : "categorizes"
\`\`\`

---

## Entity 1: \`organizations\`

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| \`id\` | UUID / BIGINT | PK | Primary identifier |
| \`name\` | VARCHAR(255) | NOT NULL | Company legal name |
| \`slug\` | VARCHAR(100) | UNIQUE, NOT NULL | Subdomain identifier (e.g. \`acme\`) |
| \`currency\` | VARCHAR(10) | NOT NULL, DEFAULT 'AED' | Base operational currency |
| \`phone\` | VARCHAR(50) | NULLABLE | Contact phone |
| \`industry\` | VARCHAR(100) | NULLABLE | Industry sector |
| \`plan_id\` | VARCHAR(50) | NOT NULL, DEFAULT 'free' | Active subscription plan |
| \`created_at\` | TIMESTAMPTZ | NOT NULL | Creation timestamp |

---

## Entity 2: \`employees\`

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| \`id\` | UUID / BIGINT | PK | Employee ID |
| \`org_id\` | UUID / BIGINT | FK -> \`organizations.id\` | Multi-tenant tenant key |
| \`user_id\` | UUID / BIGINT | FK -> \`users.id\`, NULLABLE | Associated portal user login |
| \`employee_code\` | VARCHAR(50) | NOT NULL | Unique employee code (e.g. \`EMP-001\`) |
| \`first_name\` | VARCHAR(100) | NOT NULL | First name |
| \`last_name\` | VARCHAR(100) | NOT NULL | Last name |
| \`email\` | VARCHAR(255) | NOT NULL | Work / personal email |
| \`phone\` | VARCHAR(50) | NULLABLE | Contact telephone |
| \`department_id\` | UUID / BIGINT | FK -> \`departments.id\` | Assigned department |
| \`designation_id\` | UUID / BIGINT | FK -> \`designations.id\` | Job title position |
| \`joining_date\` | DATE | NOT NULL | Date of joining |
| \`status\` | ENUM | \`active\`, \`probation\`, \`terminated\`, \`on_leave\` | Status |
| \`salary_basic\` | NUMERIC(12,2) | NOT NULL, DEFAULT 0 | Basic monthly salary |
| \`created_at\` | TIMESTAMPTZ | NOT NULL | Creation timestamp |

---

## Entity 3: \`leave_requests\`

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| \`id\` | UUID / BIGINT | PK | Request ID |
| \`org_id\` | UUID / BIGINT | FK -> \`organizations.id\` | Multi-tenant tenant key |
| \`employee_id\` | UUID / BIGINT | FK -> \`employees.id\` | Applicant employee |
| \`leave_type_id\` | UUID / BIGINT | FK -> \`leave_types.id\` | Annual, Sick, etc. |
| \`start_date\` | DATE | NOT NULL | Leave start date |
| \`end_date\` | DATE | NOT NULL | Leave end date |
| \`days_count\` | NUMERIC(4,1) | NOT NULL | Total computed leave days |
| \`reason\` | TEXT | NULLABLE | Reason provided |
| \`status\` | ENUM | \`pending\`, \`approved\`, \`rejected\`, \`cancelled\` | Workflow status |
| \`approved_by\` | UUID / BIGINT | FK -> \`users.id\`, NULLABLE | Approving admin |
| \`created_at\` | TIMESTAMPTZ | NOT NULL | Submission timestamp |

---

## Entity 4: \`documents\`

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| \`id\` | UUID / BIGINT | PK | Document ID |
| \`org_id\` | UUID / BIGINT | FK -> \`organizations.id\` | Multi-tenant tenant key |
| \`employee_id\` | UUID / BIGINT | FK -> \`employees.id\` | Associated employee |
| \`document_type_id\` | UUID / BIGINT | FK -> \`document_types.id\` | Category |
| \`document_number\` | VARCHAR(100) | NULLABLE | ID / Policy / Visa number |
| \`issue_date\` | DATE | NULLABLE | Date of issue |
| \`expiry_date\` | DATE | NULLABLE | Expiration date |
| \`file_url\` | TEXT | NOT NULL | Storage path / signed URL |
| \`file_size\` | BIGINT | NOT NULL | File size in bytes |
| \`created_at\` | TIMESTAMPTZ | NOT NULL | Upload timestamp |
`;

fs.writeFileSync("docs/legacy-analysis/04-data-shapes.md", dataShapesMd);

// 05-roles-matrix.md
const rolesMatrixMd = `# Roles & Permissions Access Matrix

This document defines the Role-Based Access Control (RBAC) permissions across user personas in the application.

---

## Discovered Roles

1. **Super Administrator (\`super_admin\`):** Platform owner with multi-tenant oversight, billing plans, tenant lifecycle management, and system configuration.
2. **Organization Administrator (\`org_admin\`):** Full management access within their specific organization (\`org_id\`).
3. **HR / Operations Staff (\`org_staff\`):** Employee management, leave reviews, document compliance tracking.
4. **Employee / Viewer (\`org_viewer\`):** Self-service portal to submit leave requests, view announcements, and download own documents.

---

## Access Matrix

| Module / Feature | Super Admin | Org Admin | Org Staff | Org Viewer (Employee) |
| :--- | :---: | :---: | :---: | :---: |
| **Super Admin Portal** | ✓ Full | ✗ Hidden | ✗ Hidden | ✗ Hidden |
| **Org Profile & Settings** | ✓ Full | ✓ Full | 👁 Read-only | ✗ Hidden |
| **Subscription & Plans** | ✓ Full | ✓ Full | ✗ Hidden | ✗ Hidden |
| **Department / Designations** | ✓ Full | ✓ Full | ✎ Partial | 👁 Read-only |
| **Employee Directory (View)** | ✓ Full | ✓ Full | ✓ Full | 👁 Self Only |
| **Employee Management (Create/Edit)** | ✓ Full | ✓ Full | ✓ Full | ✗ Hidden |
| **Leave Management (Approve/Reject)** | ✓ Full | ✓ Full | ✓ Full | ✗ Hidden |
| **Leave Self-Service (Apply)** | — | ✓ Full | ✓ Full | ✓ Full |
| **Document Vault (All Employees)** | ✓ Full | ✓ Full | ✓ Full | ✗ Hidden |
| **Document Vault (Own Records)** | — | ✓ Full | ✓ Full | 👁 Read-only |
| **Loans & Advances (Approve)** | ✓ Full | ✓ Full | ✎ Partial | ✗ Hidden |
| **Announcements (Publish)** | ✓ Full | ✓ Full | ✎ Partial | 👁 Read-only |
| **Reports & Export Data** | ✓ Full | ✓ Full | ✓ Full | ✗ Hidden |

Legend:
- **✓ Full:** Create, Read, Update, Delete, Export.
- **✎ Partial:** Create / Edit limited fields.
- **👁 Read-only:** View records only.
- **✗ Hidden:** Inaccessible route / UI element hidden.
- **—:** Not applicable.
`;

fs.writeFileSync("docs/legacy-analysis/05-roles-matrix.md", rolesMatrixMd);

// 06-integrations.md
const integrationsMd = `# System Integrations & External Services

| Service / Dependency | Category | Observed In | Purpose in Legacy App | Status in Modern Stack |
| :--- | :--- | :--- | :--- | :--- |
| **Supabase Postgres + RLS** | Database & Tenancy | Core Data Layer | Tenant data isolation | **Primary Target** (PostgreSQL with RLS) |
| **Supabase Storage** | Document Storage | \`/documents\` | Secure PDF & image storage | **Primary Target** (Signed URLs only) |
| **Supabase Auth** | Authentication | \`/login\`, \`/register\` | JWTs carrying \`org_id\` + \`role\` | **Primary Target** (JWT custom hook) |
| **Bootstrap 5 + Alpine.js** | Frontend UI Framework | All legacy screens | Legacy client-side templates | **Replaced** by Next.js + React 19 + Tailwind + shadcn/ui |
| **Cron Email Dispatcher** | Notification Service | \`/settings/templates\` | Expiry warnings & leave updates | **Modernized** via Fastify cron / background queues |
| **CSV / XLSX Parser** | Data Import / Export | \`/employees/import-export\` | Batch employee roster import | **Preserved** with Zod schema validation |
`;

fs.writeFileSync("docs/legacy-analysis/06-integrations.md", integrationsMd);

// 07-reports-exports.md
const reportsExportsMd = `# Reports & Export Specifications

This document catalogs all reporting views, export formats, and filter criteria available in the application.

---

## 1. Employee Demographics Report (\`/reports/employees\`)
- **Filters:** Department, Designation, Employment Status (\`active\`, \`probation\`, \`terminated\`), Joining Date Range.
- **Columns:** Employee Code, Full Name, Email, Department, Designation, Joining Date, Basic Salary, Status.
- **Export Formats:** Excel (.xlsx), CSV, Print / PDF.

## 2. Leave Utilization Report (\`/reports/leaves\`)
- **Filters:** Date Range, Leave Type, Department, Approval Status.
- **Columns:** Employee Name, Department, Leave Type, Start Date, End Date, Total Days, Approver, Status.
- **Export Formats:** Excel (.xlsx), CSV.

## 3. Document Expiries Report (\`/reports/documents\`)
- **Filters:** Expiry Horizon (30 days, 60 days, 90 days, Expired), Document Category, Department.
- **Columns:** Employee Code, Employee Name, Document Type, Document Number, Expiry Date, Remaining Days, Status Flag (\`Valid\`, \`Expiring Soon\`, \`Expired\`).
- **Export Formats:** Excel (.xlsx), PDF Summary.

## 4. Loan Summaries Report (\`/reports/loans\`)
- **Filters:** Loan Status (\`Active\`, \`Settled\`), Date Range.
- **Columns:** Employee Name, Principal Amount, Monthly EMI, Paid Amount, Outstanding Balance, Start Month, End Month.
- **Export Formats:** Excel (.xlsx), CSV.
`;

fs.writeFileSync("docs/legacy-analysis/07-reports-exports.md", reportsExportsMd);

// 08-gaps.md
const gapsMd = `# Gap Analysis: Legacy Limitations vs. Modern Target

| # | Domain | Legacy App Limitation | Modern Target Specification |
| :--- | :--- | :--- | :--- |
| **G-01** | Architecture | Monolithic server templates with full-page reloads on every navigation. | Next.js 16 App Router SPA experience with client caching & instant transitions. |
| **G-02** | Security & RLS | Tenant separation enforced solely at PHP/ORM layer. | PostgreSQL Row-Level Security (RLS) on 100% of tables with Supabase Auth JWT custom claims. |
| **G-03** | Document Storage | Local webserver disk storage without signed expiry URLs. | Private Supabase S3 Storage with signed expiring URLs (5 min validity) and virus scanning. |
| **G-04** | Form Validation | Basic client-side JavaScript alerts with unformatted errors. | React Hook Form + Zod schema validation with inline visual error feedback. |
| **G-05** | Real-time Updates | Polling or page refreshes required to see leave approval or document expiry status. | Supabase Realtime WebSocket subscriptions for immediate UI badge updates. |
| **G-06** | Mobile Experience | Desktop-first table layouts requiring horizontal scrolling. | Responsive Tailwind design system with dedicated mobile card views and swipe actions. |
`;

fs.writeFileSync("docs/legacy-analysis/08-gaps.md", gapsMd);

// 09-open-questions.md
const openQuestionsMd = `# Open Questions & Decisions Log

| # | Question | Context | Priority | Status | Recommendation |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Q-01** | Superadmin Portal Password Update | Brief specified \`superadmin@glix.ae\` with \`Connect1@345\`, which returned mismatch on \`/superadmin/login\`. | P1 | Open | Confirm new password for superadmin, or seed fresh credentials in modern Supabase migration. |
| **Q-02** | Default Leave Entitlement Rules | Are annual leave days calculated on calendar days or working days by default? | P2 | Answered | Standard UAE/GCC labor law computes 30 calendar days or 22 working days annually. |
| **Q-03** | Currency Precision & Formatting | Currency selection supports AED, USD, EUR, GBP, INR, SAR, QAR, OMR, BHD. | P2 | Resolved | Implemented via \`currency.ts\` formatting with localized currency symbols. |
`;

fs.writeFileSync("docs/legacy-analysis/09-open-questions.md", openQuestionsMd);

// 10-redesign-notes.md
const redesignNotesMd = `# Modernization & Redesign Blueprint

---

## Architectural Enhancements in the New App

1. **Next.js App Router + React 19:**
   - Replace server-rendered Blade/Bootstrap templates with client-side reactive components, instant search, and optimistic UI updates.
2. **Row-Level Security (RLS) as Single Source of Truth:**
   - Every single SQL table enforces \`org_id = (auth.jwt() ->> 'org_id')::uuid\` to ensure 100% tenant isolation at the database layer.
3. **Supabase Storage with Signed URLs:**
   - Migrate document uploads from direct file paths to S3-compatible private Supabase storage buckets with time-limited signed download URLs.
4. **Modern UI & Design System:**
   - Clean, professional dark/light theme tokens, Framer Motion micro-animations, Lucide React icons, and accessible Radix UI primitives.
5. **Type Safety & Shared Validation:**
   - Zod schemas shared between frontend forms (React Hook Form) and Fastify backend endpoints.
`;

fs.writeFileSync("docs/legacy-analysis/10-redesign-notes.md", redesignNotesMd);

// 11-parity-matrix.md
const parityMatrixMd = `# Feature Parity Matrix

| Feature / Capability | Legacy App Status | Replatform Status | Notes / Enhancements |
| :--- | :---: | :---: | :--- |
| **Multi-Step Org Registration** | ✅ Implemented | ✅ Implemented | Streamlined with Zod validation and instant subdomain check |
| **Tenant Login & Session Management** | ✅ Implemented | ✅ Implemented | Supabase Auth JWT with automatic refresh interceptors |
| **Executive Dashboard & Compliance Score** | ✅ Implemented | ✅ Implemented | Dynamic Recharts visual analytics and compliance health |
| **Employee Directory & Profile CRUD** | ✅ Implemented | ✅ Implemented | Fast pagination, sorting, search, and bulk export |
| **Bulk CSV Import & Excel Export** | ✅ Implemented | ✅ Implemented | Server-side validation with row-by-row error preview |
| **Leave Management & Approval Lifecycle** | ✅ Implemented | ✅ Implemented | Automated entitlement balance decrement and calendar view |
| **Holidays & Leave Calendar** | ✅ Implemented | ✅ Implemented | Full interactive visual calendar with department filtering |
| **Employee Loans & Salary Advances** | ✅ Implemented | ✅ Implemented | Installment tracking with deduction status against payroll |
| **Document Vault & Expiry Alerts** | ✅ Implemented | ✅ Implemented | Secure S3 storage + automated 30/60/90-day background alerts |
| **Company Announcements & Bulletins** | ✅ Implemented | ✅ Implemented | Priority banner tagging and instant dashboard delivery |
| **Department & Job Title Masters** | ✅ Implemented | ✅ Implemented | Hierarchical department and position taxonomy |
| **Role-Based Permissions (RBAC)** | ✅ Implemented | ✅ Implemented | Granular Postgres RLS policies and frontend gate guards |
| **Reporting Engine & Multi-Format Exports** | ✅ Implemented | ✅ Implemented | PDF, Excel, and CSV export with custom date ranges |
| **Subscription & Plan Limits** | ✅ Implemented | ✅ Implemented | Server-side tier limit enforcement (\`canDo(orgId, action)\`) |
`;

fs.writeFileSync("docs/legacy-analysis/11-parity-matrix.md", parityMatrixMd);

// 12-new-user-flows.md
const newUserFlowsMd = `# Modernized User Flows & Architecture

This document describes the modern Next.js + Fastify + Supabase user flows for the replatformed system.

---

## 1. Unified Tenant & Employee Authentication Flow

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor User as Employee / Admin
    participant UI as Next.js App
    participant Auth as Supabase Auth
    participant Hook as JWT Claims Hook
    participant DB as Postgres (RLS)

    User->>UI: Enters login credentials
    UI->>Auth: signInWithPassword(email, password)
    Auth->>Hook: Trigger claims hook (fetch org_id, role)
    Hook-->>Auth: Inject { org_id, role, emp_id } into JWT
    Auth-->>UI: Return Session Token (JWT)
    UI->>UI: Store session securely (localStorage helper)
    UI->>DB: Query tenant records with Bearer Token
    DB->>DB: Enforce RLS: org_id = auth.jwt()->>'org_id'
    DB-->>UI: Return tenant-isolated dataset
\`\`\`

---

## 2. Secure Document Upload & Signed URL Download Flow

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor HR as HR Admin
    participant UI as Next.js Frontend
    participant API as Fastify API
    participant Storage as Supabase Storage (Private)
    participant DB as Postgres DB

    HR->>UI: Selects document file (Passport / Visa) & metadata
    UI->>API: POST /api/documents/upload-intent (Zod validated)
    API->>API: Verify tenant role & tier limits
    API->>Storage: Generate Signed Upload URL (valid 2 min)
    Storage-->>API: Return signed upload path
    API-->>UI: Return signed upload URL
    UI->>Storage: Direct PUT binary file
    UI->>API: POST /api/documents (Confirm metadata & path)
    API->>DB: INSERT INTO documents (org_id, emp_id, type_id, file_url)
    DB-->>API: Document record created
    API-->>UI: 201 Created & trigger expiry schedule
\`\`\`
`;

fs.writeFileSync("docs/legacy-analysis/12-new-user-flows.md", newUserFlowsMd);

console.log("All legacy analysis documents written successfully!");
