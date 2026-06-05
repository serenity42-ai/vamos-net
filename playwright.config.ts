import { defineConfig } from "@playwright/test";

/**
 * BASE_URL precedence:
 *  - CI passes BASE_URL=http://localhost:3000 and Playwright starts a real
 *    Next.js server with the production build (set via the webServer block
 *    below). This makes CI actually test the PR's build, not whatever is
 *    currently live on Vercel.
 *  - Local dev/manual runs can override BASE_URL to point at any deployed
 *    preview/prod URL. The webServer block won't be triggered unless
 *    BASE_URL is unset or already points at localhost.
 */
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)/i.test(BASE_URL);

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: BASE_URL,
    headless: true,
    screenshot: "only-on-failure",
  },
  // Only spawn the server when we're targeting localhost. Pointing
  // Playwright at a remote URL (preview/prod) skips this entirely.
  webServer: isLocal
    ? {
        command: "npx next start -p 3000",
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
