import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import multipart from "@fastify/multipart";
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
import { sendError } from "./utils/http";

/** Builds the Fastify app without binding a port — used by index.ts and by tests (`fastify.inject`). */
export async function buildApp(): Promise<FastifyInstance> {
  const CORS_ORIGIN = process.env["CORS_ORIGIN"] || "http://localhost:4000";
  const DATABASE_URL = process.env["DATABASE_URL"];

  const app = Fastify({ logger: process.env["NODE_ENV"] !== "test" });

  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, {
    origin: [CORS_ORIGIN, "http://localhost:4000"],
    credentials: true,
  });
  await app.register(multipart, { limits: { fileSize: 5 * 1024 * 1024 } });

  // Must be set before any routes register — Fastify binds the applicable
  // error handler onto each route's context at registration time, not
  // dynamically per-request, so routes registered before this line would
  // silently keep Fastify's default error shape instead of ours.
  app.setErrorHandler((err, _req, reply) => sendError(reply, err));

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
