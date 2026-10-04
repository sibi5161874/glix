# Automated Notification Engines & Templates (100% Extracted)

This document contains the exact extracted email and WhatsApp notification templates, trigger lifecycle events, and placeholder parameter bindings discovered on the legacy platform.

---

## 1. System Transactional Email Templates

| Event Key | Template Name | Subject Line | Placeholders / Dynamic Tags | Trigger Lifecycle |
| :--- | :--- | :--- | :--- | :--- |
| `document_expiry` | Document Expiration Notice | `Important: Document Expiration Notice` | `{employee_name}`, `{document_type}`, `{filename}`, `{expiry_date}`, `{portal_url}` | Scheduled Cron: 90, 60, and 30 days prior to expiry |
| `leave_applied` | New Leave Request (Admin Notification) | `New Leave Request Applied - {employee_name}` | `{employee_name}`, `{leave_type}`, `{start_date}`, `{end_date}`, `{total_days}`, `{reason}`, `{portal_url}` | Immediately upon employee leave request submission |
| `leave_status` | Leave Request Decision Notification | `Leave Request Status Updated - {status}` | `{employee_name}`, `{leave_type}`, `{start_date}`, `{end_date}`, `{total_days}`, `{status}`, `{status_color}`, `{admin_notes}`, `{portal_url}` | Immediately upon manager approval or rejection |
| `onboarding_assigned` | Onboarding Checklist Assigned | `Onboarding Checklist Assigned` | `{employee_name}`, `{designation}`, `{department}`, `{joining_date}`, `{portal_url}` | When new employee record is created |
| `billing_invoice_created` | Billing Invoice Generated | `New Invoice Generated - {invoice_number}` | `{tenant_name}`, `{amount}`, `{invoice_number}`, `{status}`, `{app_name}` | Monthly subscription renewal / tier upgrade |
| `billing_invoice_paid` | Billing Invoice Paid Confirmation | `Invoice Paid Confirmation - {invoice_number}` | `{tenant_name}`, `{amount}`, `{invoice_number}`, `{app_name}` | Webhook callback on successful payment |

---

## 2. WhatsApp Business API Templates (Meta Approved)

| Event Key | Meta Template Identifier | Language | Status | Placeholders / Parameter Mapping |
| :--- | :--- | :--- | :--- | :--- |
| `document_expiry` | `document_expiry` | `en_US` | Active | `{{1}}` (employee_name), `{{2}}` (app_name), `{{3}}` (document_type), `{{4}}` (expiry_date) |
| `leave_applied` | `leave_applied` | `en_US` | Active | `{{1}}` (employee_name) |
| `leave_approved` | `leave_approved` | `en_US` | Active | `{{1}}` (employee_name), `{{2}}` (remarks) |
| `leave_rejected` | `leave_rejected` | `en_US` | Active | `{{1}}` (employee_name), `{{2}}` (remarks) |
| `onboarding_assigned` | `onboarding_assigned` | `en_US` | Active | `{{1}}` (employee_name), `{{2}}` (template_name) |
| `billing_invoice_created` | `billing_invoice_created` | `en_US` | Active | `{{1}}` (tenant_name), `{{2}}` (invoice_number), `{{3}}` (amount), `{{4}}` (status), `{{5}}` (app_name) |
| `billing_invoice_paid` | `billing_invoice_paid` | `en_US` | Active | `{{1}}` (tenant_name), `{{2}}` (amount), `{{3}}` (invoice_number), `{{4}}` (app_name) |
