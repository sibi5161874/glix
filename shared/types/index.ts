/**
 * Shared domain types.
 * Grows as the schema is defined (Step 7).
 */

export type UUID = string;
export type ISODateString = string;

// ── Roles ────────────────────────────────────
export type ProjectRole = "project_owner";
export type OrgRole = "org_admin" | "org_staff" | "org_viewer";
export type Role = ProjectRole | OrgRole;

// ── Tenancy ──────────────────────────────────
export interface OrgScoped {
  orgId: UUID;
}

// ── API envelope ─────────────────────────────
export interface ApiError {
  error: string;
  code: string;
  details?: unknown;
}

export interface ApiSuccess<T> {
  data: T;
}
