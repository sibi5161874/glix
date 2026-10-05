# Modernized User Flows & Architecture

This document describes the modern Next.js + Fastify + self-hosted PostgreSQL user flows for the replatformed system.

---

## 1. Unified Tenant & Employee Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Employee / Admin
    participant UI as Next.js App (NextAuth v5)
    participant API as Fastify API
    participant DB as Postgres (RLS)

    User->>UI: Enters login credentials
    UI->>API: POST /auth/login (email+password OR employee_code+DOB)
    API->>DB: Verify credentials (withTenant / lookup)
    DB-->>API: User + membership + role
    API-->>UI: Sign JWT { sub, orgId, role, employeeId, isPlatformAdmin }
    UI->>UI: Store session in secure httpOnly cookie
    UI->>API: Request tenant data with Authorization: Bearer <jwt>
    API->>API: Verify JWT, set session vars (app.org_id, app.role, ...)
    API->>DB: Query within withTenant transaction
    DB->>DB: Enforce RLS: org_id = public.current_org_id()
    DB-->>API: Return tenant-isolated dataset
    API-->>UI: 200 OK { data }
```

---

## 2. Secure Document Upload & Download Flow

```mermaid
sequenceDiagram
    autonumber
    actor HR as HR Admin
    participant UI as Next.js Frontend
    participant API as Fastify API
    participant FS as VPS Filesystem (UPLOAD_DIR)
    participant DB as Postgres DB

    HR->>UI: Selects document file (Passport / Visa) & metadata
    UI->>API: POST /v1/documents (multipart, Zod validated)
    API->>API: Verify JWT, check role + tier limits
    API->>FS: Write file to UPLOAD_DIR/{org_id}/{employee_id}/{doc_id}.{ext}
    FS-->>API: File path + size
    API->>DB: INSERT INTO documents (org_id, employee_id, document_type_id, file_path) within withTenant
    DB-->>API: Document record created
    API-->>UI: 201 Created & trigger expiry alert schedule

    Note over UI,API: Download always goes through an authenticated<br/>backend route — no public URL, no direct client access to FS.
```
