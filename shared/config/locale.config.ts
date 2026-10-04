/**
 * Locale + currency + formatting.
 * ────────────────────────────────
 * Change these values to switch currency, language, or date format
 * across the entire app. Nothing else should hardcode these.
 */
export const localeConfig = {
  defaultCurrency: "INR",
  currencySymbol: "₹",
  currencyPosition: "prefix" as "prefix" | "suffix",

  defaultLanguage: "en",
  supportedLanguages: ["en", "hi"] as const,

  timezone: "Asia/Kolkata",
  dateFormat: "dd/MM/yyyy",
  dateTimeFormat: "dd/MM/yyyy HH:mm",
  timeFormat: "HH:mm",
  timeFormat24h: true,

  numberLocale: "en-IN",
  firstDayOfWeek: 1 as const, // 0=Sunday, 1=Monday
} as const;

export type LocaleConfig = typeof localeConfig;
export type SupportedLanguage = (typeof localeConfig.supportedLanguages)[number];
