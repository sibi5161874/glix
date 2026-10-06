import { config } from "dotenv";
import { resolve } from "path";
import { buildApp } from "./app";

config({ path: resolve(process.cwd(), "../.env.local") });
config({ path: resolve(process.cwd(), ".env") });

const PORT = Number(process.env["BACKEND_PORT"] || process.env["PORT"] || 5000);
const HOST = process.env["BACKEND_HOST"] || "0.0.0.0";

async function bootstrap(): Promise<void> {
  const app = await buildApp();
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
