# Module & Screen Inventory (100% Complete)

This document maps all functional modules, navigation trees, and screens across both the **Super Admin Platform** and the **Tenant Workspaces**.

---

## 1. Complete Navigation Architecture

```text
Glix Connect Replatformed Architecture
│
├── 🛡️ Super Admin Platform Control (superadmin@glix.ae)
│   ├── Dashboard & Platform Overview (/superadmin/dashboard)
│   ├── Organizations Management (/superadmin/organizations)
│   ├── Subscriptions & MRR Tracking (/superadmin/subscriptions)
│   ├── Platform Users & Staff Directory (/superadmin/users)
│   ├── Super Admin Team Hierarchy (/superadmin/team)
│   ├── Platform Roles & Capabilities (/superadmin/roles)
│   ├── Platform Invoices & Gateway History (/superadmin/invoices)
│   ├── Help Desk & Support Ticket Escalation (/superadmin/support)
│   ├── Subscription Plans & Tier Limits (/superadmin/plans)
│   ├── Landing Page FAQ Manager (/superadmin/faq)
│   ├── Customer Testimonials & Reviews (/superadmin/reviews)
│   ├── Landing Page Hero & Content CMS (/superadmin/landing)
│   ├── Terms, Privacy & Compliance Policies (/superadmin/policies)
│   ├── CRM Sales Inquiries & Leads (/superadmin/leads)
│   ├── Email Notification Templates (/superadmin/email-templates)
│   ├── WhatsApp Notification Templates (/superadmin/whatsapp-templates)
│   ├── Super Admin Account Profile (/superadmin/profile)
│   └── System Global Settings (/superadmin/settings)
│
├── 🏢 Tenant Workspace (org_admin, org_staff, org_viewer)
│   ├── Executive Dashboard (/dashboard)
│   ├── Employees Module
│   │   ├── Employee Master Directory (/employees)
│   │   ├── Onboard / Add Employee (/employees/create)
│   │   └── Bulk CSV Import & Excel Export (/employees/import-export)
│   ├── Leave Management
│   │   ├── Leave Requests & Multi-tier Approvals (/leaves/requests)
│   │   ├── Entitlement & Leave Balances (/leaves/balances)
│   │   ├── Leave Policy Types Configuration (/leaves/types)
│   │   ├── Public & Statutory Holidays (/holidays)
│   │   └── Team Attendance Calendar (/leaves/calendar)
│   ├── Payroll & Advances
│   │   └── Salary Advances & Loan Records (/payroll/loans)
│   ├── Broadcasts & Notices
│   │   └── Company Announcements (/announcements)
│   ├── Document Automation & Vault
│   │   ├── Document Categories & Expiry Rules (/documents/types)
│   │   └── Document Vault with Expiry Alarms (/documents)
│   ├── Operational Reports & Exports
│   │   ├── Analytics Hub (/reports)
│   │   ├── Employee Demographics Report (/reports/employees)
│   │   ├── Leave Utilization & Absenteeism (/reports/leaves)
│   │   ├── Compliance & Expiry Report (/reports/documents)
│   │   └── Loan & Advance Balances (/reports/loans)
│   ├── Subscription & Invoicing
│   │   └── Tier Upgrades & Multi-Currency Billing (/settings/subscription)
│   ├── Tenant Support Desk
│   │   └── Ticket Submission & Support History (/support)
│   └── Tenant Organization Settings
│       ├── Organization Branding & Currency (/settings/profile)
│       ├── Departments Structure (/departments)
│       ├── Designations & Hierarchy (/designations)
│       ├── RBAC Roles & Permissions Matrix (/settings/roles)
│       └── Custom Tenant Notification Templates (/settings/templates)
│
└── 🌐 Public & Onboarding
    ├── Marketing Landing Page (/)
    ├── Multi-Tenant & Employee Dual Login (/login)
    ├── Platform Super Admin Login (/superadmin/login)
    ├── 4-Step Organization Registration Wizard (/register)
    ├── Privacy Policy (/privacy-policy)
    ├── Terms & Conditions (/terms-conditions)
    └── Refund Policy (/refund-policy)
```

---

## 2. Master Module Summary

| Module Group | Module Name | Scope & Authority | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Super Admin** | Organization Control | Platform Owner | Create, suspend, extend trial, impersonate, and manage all tenant accounts |
| **Super Admin** | Plans & Billing | Platform Owner | Define tiers, currency rates (AED, SAR, USD, etc.), seat limits, add-on features |
| **Super Admin** | Communications | Platform Owner | Global Email & WhatsApp automated broadcast templates, system-wide alerts |
| **Super Admin** | CMS & Marketing | Platform Owner | Manage landing page copy, FAQs, customer reviews, legal policy terms |
| **Tenant Operations** | Employees Master | Org Admin / Staff | Master profile (personal, passport, visa, labor card, salary, department) |
| **Tenant Operations** | Leave Engine | All Tenant Roles | Workflow approvals, balance deduction, holiday integration, team calendar |
| **Tenant Operations** | Document Vault | Org Admin / Staff | Passport/Visa/Labor card expiry tracking with 90/60/30 day email reminders |
| **Tenant Operations** | Loans & Advances | Org Admin / Staff | Loan disbursement, monthly EMI deductions, payoff tracking |
| **Tenant Operations** | Reports & BI | Org Admin / Viewer | PDF / Excel / CSV exportable operational reports |
