/**
 * Locale + currency + formatting.
 * ────────────────────────────────
 * Change these values to switch currency, language, or date format
 * across the entire app. Nothing else should hardcode these.
 */
export const localeConfig = {
  defaultCurrency: "AED",
  currencySymbol: "AED",
  currencyPosition: "prefix" as "prefix" | "suffix",

  defaultLanguage: "en",
  supportedLanguages: ["en", "ar"] as const,

  timezone: "Asia/Dubai",
  dateFormat: "dd/MM/yyyy",
  dateTimeFormat: "dd/MM/yyyy HH:mm",
  timeFormat: "HH:mm",
  timeFormat24h: true,

  numberLocale: "en-AE",
  firstDayOfWeek: 0 as const, // 0=Sunday (Standard in UAE/GCC), 1=Monday
} as const;

export type LocaleConfig = typeof localeConfig;
export type SupportedLanguage = (typeof localeConfig.supportedLanguages)[number];
