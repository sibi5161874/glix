import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      // Mirrors tsconfig.json's "@/*" path — Next.js itself resolves this via
      // its own webpack/SWC config, but plain Vitest doesn't read tsconfig
      // paths without a plugin, so it's declared here too.
      "@": resolve(__dirname, "./src"),
    },
  },
});
