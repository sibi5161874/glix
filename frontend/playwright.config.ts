import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env["CI"];

/**
 * Assumes the backend (port 5000) and a migrated+seeded Postgres are already
 * running — same precondition as the backend's integration tests
 * (backend-constitution.md §13). This config only drives the frontend; it
 * does not start the backend or touch the database.
 *
 * In CI, this builds and runs a production server (`next build && next
 * start`) rather than `next dev`. Dev mode compiles each route on first
 * visit — a cold route took 15-20s the first time against a freshly started
 * dev server (the same phenomenon Phase 1's notes called out for
 * /superadmin/dashboard: "first load is slow — ~28s cold Next.js route
 * compile, not a bug") — which blew straight past a `toHaveURL` assertion
 * and produced a flaky *first-run-only* failure. A production server has no
 * per-route compile tax, so it doesn't have this failure mode at all.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: 1,
  timeout: 45_000,
  reporter: isCI ? "github" : "list",
  use: {
    baseURL: "http://localhost:4000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: isCI ? "pnpm build && pnpm start" : "pnpm dev",
    url: "http://localhost:4000",
    reuseExistingServer: !isCI,
    // `next build` alone has taken 70-115s locally; 120s left too little
    // headroom and timed out at least once.
    timeout: 240_000,
  },
});
