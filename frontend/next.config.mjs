import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Next.js only auto-loads .env* from its own root (frontend/), but this
// monorepo keeps one shared .env.local at the repo root (same file the
// backend reads via "../.env.local" in backend/src/index.ts).
config({ path: path.resolve(__dirname, "../.env.local") });
config({ path: path.resolve(__dirname, "../.env") });

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.resolve(__dirname, "../"),
  reactStrictMode: true,
};

export default nextConfig;
