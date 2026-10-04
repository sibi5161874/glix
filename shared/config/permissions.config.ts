/**
 * RBAC matrix — derived from docs/legacy-analysis/05-roles-matrix.md.
 * Server-side enforcement is the source of truth (RULES.md §2).
 * Client uses this ONLY for UI hints.
 */

export const roles = ["super_admin", "org_admin", "org_staff", "org_viewer"] as const;

export type Role = (typeof roles)[number];

/**
 * Permission keys are `{resource}:{action}`.
 * Resources match DB tables; actions are CRUD + specific verbs.
 */
export const permissions = {
  // ── Platform scope ──────────────────────────────
  "platform:organizations:read": ["super_admin"],
  "platform:organizations:write": ["super_admin"],
  "platform:plans:read": ["super_admin"],
  "platform:plans:write": ["super_admin"],
  "platform:users:read": ["super_admin"],
  "platform:users:write": ["super_admin"],
  "platform:subscriptions:read": ["super_admin"],
  "platform:subscriptions:write": ["super_admin"],
  "platform:invoices:read": ["super_admin"],
  "platform:invoices:write": ["super_admin"],
  "platform:support:read": ["super_admin"],
  "platform:support:write": ["super_admin"],
  "platform:settings:read": ["super_admin"],
  "platform:settings:write": ["super_admin"],
  "platform:templates:read": ["super_admin"],
  "platform:templates:write": ["super_admin"],
  "platform:cms:read": ["super_admin"],
  "platform:cms:write": ["super_admin"],

  // ── Org scope ──────────────────────────────────
  "org:read": ["org_admin", "org_staff"],
  "org:write": ["org_admin"],

  "members:read": ["org_admin"],
  "members:invite": ["org_admin"],
  "members:update": ["org_admin"],
  "members:remove": ["org_admin"],

  // ── Employees ───────────────────────────────────
  "employees:read": ["org_admin", "org_staff", "org_viewer"],
  "employees:read:self": ["org_viewer"],
  "employees:create": ["org_admin", "org_staff"],
  "employees:update": ["org_admin", "org_staff"],
  "employees:update:self": ["org_viewer"],
  "employees:delete": ["org_admin"],
  "employees:import": ["org_admin"],
  "employees:export": ["org_admin", "org_staff"],

  // ── Departments / Designations ──────────────────
  "departments:read": ["org_admin", "org_staff", "org_viewer"],
  "departments:write": ["org_admin"],
  "designations:read": ["org_admin", "org_staff", "org_viewer"],
  "designations:write": ["org_admin"],

  // ── Leave ───────────────────────────────────────
  "leaves:requests:read": ["org_admin", "org_staff", "org_viewer"],
  "leaves:requests:read:self": ["org_viewer"],
  "leaves:requests:create": ["org_admin", "org_staff", "org_viewer"],
  "leaves:requests:approve": ["org_admin", "org_staff"],
  "leaves:requests:reject": ["org_admin", "org_staff"],
  "leaves:balances:read": ["org_admin", "org_staff"],
  "leaves:balances:read:self": ["org_viewer"],
  "leaves:balances:adjust": ["org_admin"],
  "leaves:types:read": ["org_admin", "org_staff"],
  "leaves:types:write": ["org_admin"],
  "holidays:read": ["org_admin", "org_staff", "org_viewer"],
  "holidays:write": ["org_admin"],

  // ── Documents ───────────────────────────────────
  "documents:read": ["org_admin", "org_staff"],
  "documents:read:self": ["org_viewer"],
  "documents:upload": ["org_admin", "org_staff"],
  "documents:update": ["org_admin", "org_staff"],
  "documents:delete": ["org_admin"],
  "documents:types:read": ["org_admin", "org_staff"],
  "documents:types:write": ["org_admin"],

  // ── Loans ───────────────────────────────────────
  "loans:read": ["org_admin", "org_staff"],
  "loans:read:self": ["org_viewer"],
  "loans:create": ["org_admin", "org_staff"],
  "loans:approve": ["org_admin"],
  "loans:record-payment": ["org_admin"],

  // ── Announcements ───────────────────────────────
  "announcements:read": ["org_admin", "org_staff", "org_viewer"],
  "announcements:create": ["org_admin", "org_staff"],
  "announcements:update": ["org_admin", "org_staff"],
  "announcements:delete": ["org_admin"],

  // ── Reports ─────────────────────────────────────
  "reports:read": ["org_admin", "org_staff"],
  "reports:export": ["org_admin", "org_staff"],

  // ── Billing ─────────────────────────────────────
  "billing:read": ["org_admin"],
  "billing:update": ["org_admin"],

  // ── Support ─────────────────────────────────────
  "support:read": ["org_admin"],
  "support:create": ["org_admin", "org_staff", "org_viewer"],

  // ── Settings ────────────────────────────────────
  "settings:profile:read": ["org_admin", "org_staff"],
  "settings:profile:write": ["org_admin"],
  "settings:roles:read": ["org_admin"],
  "settings:roles:write": ["org_admin"],
  "settings:templates:read": ["org_admin"],
  "settings:templates:write": ["org_admin"],

  // ── Audit ───────────────────────────────────────
  "audit:read": ["org_admin"],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof permissions;

/**
 * Check if a role has a permission.
 * NOTE: client-side check is a UI hint only. Server re-checks.
 */
export function roleHasPermission(role: Role, permission: Permission): boolean {
  const allowed = permissions[permission] as readonly Role[] | undefined;
  return allowed?.includes(role) ?? false;
}

/** Superadmin bypasses all org-scoped checks. */
export function can(role: Role, permission: Permission): boolean {
  if (role === "super_admin" && !permission.startsWith("platform:")) {
    return false; // superadmin operates on platform:*, not org:*
  }
  return roleHasPermission(role, permission);
}
