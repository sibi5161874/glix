import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import postgres from "@fastify/postgres";
import dbPlugin from "./plugins/db.plugin";
import authPlugin from "./plugins/auth.plugin";
import authRoutes from "./routes/v1/auth.routes";
import employeesRoutes from "./routes/v1/employees.routes";
import lookupsRoutes from "./routes/v1/lookups.routes";
import leaveTypesRoutes from "./routes/v1/leave-types.routes";
import holidaysRoutes from "./routes/v1/holidays.routes";
import leaveRequestsRoutes from "./routes/v1/leave-requests.routes";
import leaveBalancesRoutes from "./routes/v1/leave-balances.routes";
import documentTypesRoutes from "./routes/v1/document-types.routes";
import documentsRoutes from "./routes/v1/documents.routes";
import loansRoutes from "./routes/v1/loans.routes";
import announcementsRoutes from "./routes/v1/announcements.routes";
import { sendError } from "./utils/http";

/** Builds the Fastify app without binding a port — used by index.ts and by tests (`fastify.inject`). */
export async function buildApp(): Promise<FastifyInstance> {
  const CORS_ORIGIN = process.env["CORS_ORIGIN"] || "http://localhost:4000";
  const DATABASE_URL = process.env["DATABASE_URL"];

  const app = Fastify({ logger: process.env["NODE_ENV"] !== "test" });

  // This API never renders HTML, so a strict, locked-down CSP costs nothing —
  // `contentSecurityPolicy: false` disabled it outright rather than tuning
  // it. `default-src 'none'` + explicit per-directive opt-ins is the correct
  // default for a pure JSON/binary API (document/XLSX downloads included):
  // there's no first-party script/style/font to allow, so there's nothing to
  // add beyond helmet's base protections (frameAncestors, etc.).
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  });
  await app.register(cors, {
    origin: [CORS_ORIGIN, "http://localhost:4000"],
    credentials: true,
  });
  await app.register(multipart, { limits: { fileSize: 50 * 1024 * 1024 } });
  // Registered globally but opt-in per route (`global: false`) — only the
  // auth routes declare a `config.rateLimit` override (see auth.routes.ts).
  // Brute-force/credential-stuffing on /v1/auth/login was previously
  // unmitigated entirely.
  await app.register(rateLimit, { global: false });

  // Must be set before any routes register — Fastify binds the applicable
  // error handler onto each route's context at registration time, not
  // dynamically per-request, so routes registered before this line would
  // silently keep Fastify's default error shape instead of ours.
  app.setErrorHandler((err, req, reply) => sendError(reply, err, req));

  if (DATABASE_URL) {
    await app.register(postgres, { connectionString: DATABASE_URL });
    await app.register(dbPlugin);
  }
  await app.register(authPlugin);
  await app.register(authRoutes, { prefix: "/v1/auth" });
  await app.register(employeesRoutes, { prefix: "/v1/employees" });
  await app.register(lookupsRoutes, { prefix: "/v1" });
  await app.register(leaveTypesRoutes, { prefix: "/v1/leave-types" });
  await app.register(holidaysRoutes, { prefix: "/v1/holidays" });
  await app.register(leaveRequestsRoutes, { prefix: "/v1/leave-requests" });
  await app.register(leaveBalancesRoutes, { prefix: "/v1/leave-balances" });
  await app.register(documentTypesRoutes, { prefix: "/v1/document-types" });
  await app.register(documentsRoutes, { prefix: "/v1/documents" });
  await app.register(loansRoutes, { prefix: "/v1/loans" });
  await app.register(announcementsRoutes, { prefix: "/v1/announcements" });

  app.get("/health", async () => {
    let dbStatus = "unconfigured";
    if (DATABASE_URL && app.pg) {
      try {
        const { rows } = await app.pg.query("select now() as now");
        dbStatus = rows[0]?.now ? String(rows[0].now) : "connected";
      } catch (err) {
        dbStatus = `error: ${(err as Error).message}`;
      }
    }
    return { status: "ok", db: dbStatus, service: "glix-backend", version: "0.1.0" };
  });

  return app;
}
