# Module & Screen Inventory

This document maps all functional modules, navigation trees, and screens discovered during the exhaustive crawl.

## Navigation Hierarchy

```text
Glix Connect HR Portal
├── Public / Unauthenticated
│   ├── Landing Page (/)
│   ├── Tenant & Employee Login (/login)
│   ├── Superadmin Login Portal (/superadmin/login)
│   ├── Organization Registration Wizard (/register)
│   ├── Privacy Policy (/privacy-policy)
│   ├── Terms & Conditions (/terms-conditions)
│   └── Refund Policy (/refund-policy)
└── Authenticated Tenant Workspace
    ├── Dashboard (/dashboard)
    ├── Employees Module
    │   ├── All Employees Directory (/employees)
    │   ├── Add Employee (/employees/create)
    │   └── Import & Export Data (/employees/import-export)
    ├── Leave Management
    │   ├── Leave Requests & Approvals (/leaves/requests)
    │   ├── Leave Balances (/leaves/balances)
    │   ├── Leave Types Configuration (/leaves/types)
    │   ├── Public & Company Holidays (/holidays)
    │   └── Calendar View (/leaves/calendar)
    ├── Payroll & Loans
    │   └── Employee Loans & Advances (/payroll/loans)
    ├── Company Announcements
    │   └── Announcements & Notices (/announcements)
    ├── Document Automation & Vault
    │   ├── Document Categories & Types (/documents/types)
    │   └── Document Expiry & Repository (/documents)
    ├── Reports & Analytics
    │   ├── Reports Hub (/reports)
    │   ├── Employee Demographics Report (/reports/employees)
    │   ├── Leave Utilization Report (/reports/leaves)
    │   ├── Document Expiries Report (/reports/documents)
    │   └── Loan Summaries Report (/reports/loans)
    ├── Billing & Subscription
    │   └── Subscription Plans & Add-ons (/settings/subscription)
    ├── Support Desk
    │   └── Support Tickets & Inquiries (/support)
    └── Organization Settings
        ├── Organization Profile & Branding (/settings/profile)
        ├── Department Hierarchy (/departments)
        ├── Designations & Positions (/designations)
        ├── Roles & Permissions Matrix (/settings/roles)
        └── Notification Templates (/settings/templates)
```

## Module Summary Table

| Module | Purpose | Key Routes | Approx Screens | Primary Actions |
| :--- | :--- | :--- | :--- | :--- |
| **Auth & Onboarding** | Tenant registration, auth, sessions | `/login`, `/register`, `/superadmin/login` | 4 | Login, 4-step wizard registration, password reset |
| **Dashboard** | Executive overview & operational alerts | `/dashboard` | 1 | Metric cards, compliance score, quick shortcuts |
| **Employees** | Employee master database & profiles | `/employees`, `/employees/create`, `/employees/import-export` | 3 | Create, edit, bulk CSV import, Excel export |
| **Leave Management** | Request workflow, entitlement, holidays | `/leaves/requests`, `/leaves/balances`, `/leaves/types`, `/holidays`, `/leaves/calendar` | 5 | Apply, approve, reject, balance adjustment, calendar |
| **Loans & Advances** | Salary advance & loan repayment | `/payroll/loans` | 1 | Request loan, approve, record EMI installments |
| **Announcements** | Organization-wide broadcast notices | `/announcements` | 1 | Publish announcement, set priority, target audience |
| **Documents** | Compliance document tracking & expiry | `/documents`, `/documents/types` | 2 | Upload file, set expiry date, automated email alerts |
| **Reports** | Operational reporting & exports | `/reports/*` | 5 | Filter by dates/department, generate PDF/CSV/Excel |
| **Settings & Admin** | Organization branding, RBAC, masters | `/settings/profile`, `/departments`, `/designations`, `/settings/roles`, `/settings/templates` | 5 | Manage departments, job titles, roles, email templates |
