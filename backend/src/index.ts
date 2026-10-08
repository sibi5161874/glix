import { config } from "dotenv";
import { resolve } from "path";
import { buildApp } from "./app";

config({ path: resolve(process.cwd(), "../.env.local") });
config({ path: resolve(process.cwd(), ".env") });

const PORT = Number(process.env["BACKEND_PORT"] || process.env["PORT"] || 5000);
const HOST = process.env["BACKEND_HOST"] || "0.0.0.0";

async function bootstrap(): Promise<void> {
  const app = await buildApp();

  // Without these, an error thrown outside any request's try/catch (a
  // rejected promise never awaited, a callback-style bug) crashes the
  // process with no structured log at all — just whatever Node prints to
  // stderr. This is the process-level equivalent of sendError's
  // request-level logging (utils/http.ts): still no external error tracker
  // wired in, just the last line of defense for a log an operator can grep.
  process.on("uncaughtException", (err) => {
    app.log.fatal({ err }, "uncaughtException — exiting");
    process.exit(1);
  });
  process.on("unhandledRejection", (reason) => {
    app.log.fatal({ err: reason }, "unhandledRejection — exiting");
    process.exit(1);
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
