import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), "../.env.local") });
config({ path: resolve(process.cwd(), ".env") });

const PORT = Number(process.env["BACKEND_PORT"] || process.env["PORT"] || 5000);
const HOST = process.env["BACKEND_HOST"] || "0.0.0.0";
const CORS_ORIGIN = process.env["CORS_ORIGIN"] || "http://localhost:4000";

async function bootstrap(): Promise<void> {
  const app = Fastify({
    logger: true,
  });

  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, {
    origin: [CORS_ORIGIN, "http://localhost:4000"],
    credentials: true,
  });

  app.get("/health", async () => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "glix-backend-api",
      port: PORT,
    };
  });

  app.get("/api/v1", async () => {
    return {
      name: "Glix HR Multi-Tenant API",
      version: "v1",
      endpoints: {
        health: "/health",
        organizations: "/api/v1/organizations",
        employees: "/api/v1/employees",
        leaves: "/api/v1/leaves",
        documents: "/api/v1/documents",
      },
    };
  });

  try {
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`🚀 Backend server ready on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap().catch((err: unknown) => {
  console.error("Bootstrap error:", err);
  process.exit(1);
});
