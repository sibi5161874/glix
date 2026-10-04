import { getPublicEnv } from "./env";

const env = getPublicEnv();

/**
 * App-level runtime config.
 * Secrets NEVER live here — they stay in env.ts.
 */
export const appConfig = {
  name: "Glix Connect",
  appUrl: env.NEXT_PUBLIC_APP_URL,
  apiUrl: env.NEXT_PUBLIC_API_URL,
  env: process.env["NODE_ENV"] ?? "development",
  isDev: process.env["NODE_ENV"] === "development",
  isTest: process.env["NODE_ENV"] === "test",
  isProd: process.env["NODE_ENV"] === "production",
  version: "0.1.0",
} as const;

export type AppConfig = typeof appConfig;
