/**
 * Plan tiers — derived from docs/legacy-analysis/04-data-shapes.md
 * (`plans` entity) + superadmin `/plans` configuration page.
 *
 * Superadmin edits these at runtime via the platform panel.
 * This file is the SEED for migration 008.
 */

export interface Tier {
  slug: string;
  name: string;
  maxEmployees: number; // 0 = unlimited
  maxStorageMb: number; // 0 = unlimited
  priceAed: number;
  priceUsd: number;
  priceSar: number;
  features: {
    bulkImport: boolean;
    customRoles: boolean;
    apiAccess: boolean;
    sso: boolean;
    customBranding: boolean;
    whatsappAlerts: boolean;
    advancedReports: boolean;
  };
  isActive: boolean;
  sortOrder: number;
}

export const tiers: Tier[] = [
  {
    slug: "free",
    name: "Starter",
    maxEmployees: 25,
    maxStorageMb: 500,
    priceAed: 0,
    priceUsd: 0,
    priceSar: 0,
    features: {
      bulkImport: false,
      customRoles: false,
      apiAccess: false,
      sso: false,
      customBranding: false,
      whatsappAlerts: false,
      advancedReports: false,
    },
    isActive: true,
    sortOrder: 1,
  },
  {
    slug: "pro",
    name: "Growth",
    maxEmployees: 250,
    maxStorageMb: 10_000,
    priceAed: 299,
    priceUsd: 81,
    priceSar: 305,
    features: {
      bulkImport: true,
      customRoles: true,
      apiAccess: false,
      sso: false,
      customBranding: true,
      whatsappAlerts: true,
      advancedReports: true,
    },
    isActive: true,
    sortOrder: 2,
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    maxEmployees: 0, // unlimited
    maxStorageMb: 0, // unlimited
    priceAed: 0, // custom quote
    priceUsd: 0,
    priceSar: 0,
    features: {
      bulkImport: true,
      customRoles: true,
      apiAccess: true,
      sso: true,
      customBranding: true,
      whatsappAlerts: true,
      advancedReports: true,
    },
    isActive: true,
    sortOrder: 3,
  },
];

export const defaultTierSlug = "free";
export const trialDays = 14;

export function getTier(slug: string): Tier | undefined {
  return tiers.find((t) => t.slug === slug);
}

/** Server-side tier limit check. Never trust client. */
export function isWithinLimit(
  tierSlug: string,
  metric: "employees" | "storageMb",
  current: number,
): boolean {
  const tier = getTier(tierSlug);
  if (!tier) return false;
  const limit = metric === "employees" ? tier.maxEmployees : tier.maxStorageMb;
  if (limit === 0) return true; // unlimited
  return current < limit;
}

export function hasFeature(tierSlug: string, feature: keyof Tier["features"]): boolean {
  return getTier(tierSlug)?.features[feature] ?? false;
}
