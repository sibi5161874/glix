/**
 * Global feature flags (compile + runtime gates).
 * Flip to true only when the feature is fully wired end-to-end.
 *
 * Note: per-tenant gates live in the tier system, NOT here.
 */
export const featureFlags = {
  // Core
  auditLog: true,
  multiTenant: true,

  // Off until implemented
  payments: false,
  emailInvites: false,
  customFields: false,
  approvals: false,
  sso: false,
  apiAccess: false,
  bulkImport: false,

  // UI
  darkMode: true,
  commandPalette: true,
} as const;

export type FeatureFlags = typeof featureFlags;
export type FeatureKey = keyof FeatureFlags;

export function isFeatureEnabled(key: FeatureKey): boolean {
  return featureFlags[key] === true;
}
