/**
 * Multi-currency config — derived from register wizard options.
 * 9 currencies supported. Default: AED (per crawl).
 */

export const currencies = [
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", locale: "en-AE" },
  { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US" },
  { code: "EUR", symbol: "€", name: "Euro", locale: "en-IE" },
  { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", locale: "en-SA" },
  { code: "QAR", symbol: "﷼", name: "Qatari Riyal", locale: "en-QA" },
  { code: "OMR", symbol: "﷼", name: "Omani Rial", locale: "en-OM" },
  { code: "BHD", symbol: ".د.ب", name: "Bahraini Dinar", locale: "en-BH" },
] as const;

export type CurrencyCode = (typeof currencies)[number]["code"];

export const defaultCurrency: CurrencyCode = "AED";

export function formatCurrency(amount: number, code: CurrencyCode = defaultCurrency): string {
  const c = currencies.find((x) => x.code === code);
  if (!c) return amount.toString();
  return new Intl.NumberFormat(c.locale, {
    style: "currency",
    currency: c.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getCurrency(code: CurrencyCode) {
  return currencies.find((c) => c.code === code) ?? currencies[0];
}
