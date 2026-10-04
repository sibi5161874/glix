import { z } from "zod";

/**
 * Public env — safe to use in the browser.
 * Only NEXT_PUBLIC_* vars belong here.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:4000"),
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:5000"),
});

/**
 * Server env — NEVER import this into client code.
 * Imported only inside backend/server runtime.
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32).optional(),
  JWT_EXPIRES_IN: z.string().default("7d"),
  BACKEND_PORT: z.coerce.number().int().positive().default(5000),
  BACKEND_HOST: z.string().min(1).default("0.0.0.0"),
  CORS_ORIGIN: z.string().url().default("http://localhost:4000"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  UPLOAD_DIR: z.string().default("./uploads"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().optional(),
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
    });
  }
  return _publicEnv;
}

export function getServerEnv(): ServerEnv {
  if (!_serverEnv) {
    _serverEnv = serverEnvSchema.parse({
      NODE_ENV: process.env["NODE_ENV"],
      DATABASE_URL: process.env["DATABASE_URL"],
      JWT_SECRET: process.env["JWT_SECRET"],
      JWT_EXPIRES_IN: process.env["JWT_EXPIRES_IN"],
      BACKEND_PORT: process.env["BACKEND_PORT"],
      BACKEND_HOST: process.env["BACKEND_HOST"],
      CORS_ORIGIN: process.env["CORS_ORIGIN"],
      LOG_LEVEL: process.env["LOG_LEVEL"],
      UPLOAD_DIR: process.env["UPLOAD_DIR"],
      GOOGLE_CLIENT_ID: process.env["GOOGLE_CLIENT_ID"],
      GOOGLE_CLIENT_SECRET: process.env["GOOGLE_CLIENT_SECRET"],
      NEXTAUTH_SECRET: process.env["NEXTAUTH_SECRET"],
      NEXTAUTH_URL: process.env["NEXTAUTH_URL"],
      RESEND_API_KEY: process.env["RESEND_API_KEY"],
    });
  }
  return _serverEnv;
}
