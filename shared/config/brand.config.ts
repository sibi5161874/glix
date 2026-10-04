/**
 * Brand identity — colors, name, logo.
 * ─────────────────────────────────────
 * Colors should match the CSS variables in frontend's globals.css.
 */
export const brandConfig = {
  name: "YourApp",
  shortName: "YA",
  tagline: "Employee documents & info, simplified.",
  description:
    "A multi-tenant SaaS for organizations to manage employee records and documents securely.",

  logo: "/logo.svg",
  logoDark: "/logo-dark.svg",
  favicon: "/favicon.ico",

  colors: {
    primary: "#F57C00",
    primaryForeground: "#FFFFFF",
    accent: "#1E293B",
    danger: "#DC2626",
    success: "#16A34A",
    warning: "#F59E0B",
  },

  defaultTheme: "system" as "light" | "dark" | "system",

  madeIn: "India",
  supportEmail: "support@yourapp.com",
  website: "https://yourapp.com",
} as const;

export type BrandConfig = typeof brandConfig;
