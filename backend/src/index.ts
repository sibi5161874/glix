import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import postgres from "@fastify/postgres";
import { config } from "dotenv";
import { resolve } from "path";
import dbPlugin from "./plugins/db.plugin";

config({ path: resolve(process.cwd(), "../.env.local") });
config({ path: resolve(process.cwd(), ".env") });

const PORT = Number(process.env["BACKEND_PORT"] || process.env["PORT"] || 5000);
const HOST = process.env["BACKEND_HOST"] || "0.0.0.0";
const CORS_ORIGIN = process.env["CORS_ORIGIN"] || "http://localhost:4000";
const DATABASE_URL = process.env["DATABASE_URL"];

async function bootstrap(): Promise<void> {
  const app = Fastify({ logger: true });

  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, {
    origin: [CORS_ORIGIN, "http://localhost:4000"],
    credentials: true,
  });

  if (DATABASE_URL) {
    await app.register(postgres, { connectionString: DATABASE_URL });
    await app.register(dbPlugin);
  }

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

  try {
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`Backend ready on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap().catch((err: unknown) => {
  console.error("Bootstrap error:", err);
  process.exit(1);
});
