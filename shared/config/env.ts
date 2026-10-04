import { z } from "zod";

/**
 * Public env — safe to use in the browser.
 * Only NEXT_PUBLIC_* vars belong here.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:4000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
});

/**
 * Server env — NEVER import this into client code.
 * Imported only inside backend/server runtime.
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  DATABASE_URL: z.string().url().optional(),
  BACKEND_PORT: z.coerce.number().int().positive().default(4000),
  BACKEND_HOST: z.string().min(1).default("0.0.0.0"),
  CORS_ORIGIN: z.string().url().default("http://localhost:3000"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

// ── Lazy singletons — fail loudly on first use, not at import time ──
let _publicEnv: PublicEnv | null = null;
let _serverEnv: ServerEnv | null = null;

export function getPublicEnv(): PublicEnv {
  if (!_publicEnv) {
    _publicEnv = publicEnvSchema.parse({
      NEXT_PUBLIC_APP_URL: process.env["NEXT_PUBLIC_APP_URL"],
      NEXT_PUBLIC_API_URL: process.env["NEXT_PUBLIC_API_URL"],
      NEXT_PUBLIC_SUPABASE_URL: process.env["NEXT_PUBLIC_SUPABASE_URL"],
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    });
  }
  return _publicEnv;
}

export function getServerEnv(): ServerEnv {
  if (!_serverEnv) {
    _serverEnv = serverEnvSchema.parse({
      NODE_ENV: process.env["NODE_ENV"],
      SUPABASE_SERVICE_ROLE_KEY: process.env["SUPABASE_SERVICE_ROLE_KEY"],
      DATABASE_URL: process.env["DATABASE_URL"],
      BACKEND_PORT: process.env["BACKEND_PORT"],
      BACKEND_HOST: process.env["BACKEND_HOST"],
      CORS_ORIGIN: process.env["CORS_ORIGIN"],
      LOG_LEVEL: process.env["LOG_LEVEL"],
    });
  }
  return _serverEnv;
}
