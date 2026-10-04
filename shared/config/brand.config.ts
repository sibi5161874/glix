/**
 * Brand identity — colors, name, logo.
 * ─────────────────────────────────────
 * Colors match Glix Connect theme tokens.
 */
export const brandConfig = {
  name: "Glix Connect",
  shortName: "GC",
  tagline: "Multi-tenant HR operations & document automation",
  description: "Enterprise HR SaaS for the GCC — employees, leave, loans, documents, compliance.",

  logo: "/logo.svg",
  logoDark: "/logo-dark.svg",
  favicon: "/favicon.ico",

  colors: {
    primary: "#2563EB",
    primaryForeground: "#FFFFFF",
    accent: "#0F172A",
    danger: "#DC2626",
    success: "#16A34A",
    warning: "#F59E0B",
  },

  defaultTheme: "system" as "light" | "dark" | "system",

  madeIn: "UAE",
  supportEmail: "support@glix.ae",
  website: "https://connect.rmd.city",
} as const;

export type BrandConfig = typeof brandConfig;
