# Modernized User Flows & Architecture

This document describes the modern Next.js + Fastify + Supabase user flows for the replatformed system.

---

## 1. Unified Tenant & Employee Authentication Flow

```mermaid
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
```

---

## 2. Secure Document Upload & Signed URL Download Flow

```mermaid
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
```
