import { config } from "dotenv";
import { resolve } from "path";
import { getServerEnv } from "@app/shared/config";
import { buildApp } from "./app";

config({ path: resolve(process.cwd(), "../.env.local") });
config({ path: resolve(process.cwd(), ".env") });

// Validates the entire server env shape in one place, before anything else
// runs — a misconfigured/missing var (JWT_SECRET too short, DATABASE_URL not
// a valid URL, ...) throws one clear aggregated Zod error here instead of
// surfacing piecemeal as individual plugin crashes or, worse, a silent
// fallback to a default that's wrong for this environment.
const env = getServerEnv();

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
    await app.listen({ port: env.BACKEND_PORT, host: env.BACKEND_HOST });
    app.log.info(`Backend ready on http://localhost:${env.BACKEND_PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap().catch((err: unknown) => {
  console.error("Bootstrap error:", err);
  process.exit(1);
});
