# Roles & Permissions Access Matrix

This document defines the Role-Based Access Control (RBAC) permissions across user personas in the application.

---

## Discovered Roles

1. **Super Administrator (`super_admin`):** Platform owner with multi-tenant oversight, billing plans, tenant lifecycle management, and system configuration.
2. **Organization Administrator (`org_admin`):** Full management access within their specific organization (`org_id`).
3. **HR / Operations Staff (`org_staff`):** Employee management, leave reviews, document compliance tracking.
4. **Employee / Viewer (`org_viewer`):** Self-service portal to submit leave requests, view announcements, and download own documents.

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
