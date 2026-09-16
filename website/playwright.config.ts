import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 15_000,
  fullyParallel: true,
  retries: process.env["CI"] ? 2 : 0,
  reporter: process.env["CI"] ? "github" : "list",
  webServer: [
    {
      command: "bun run dev",
      url: "http://localhost:5173",
      reuseExistingServer: !process.env["CI"],
      timeout: 120_000,
    },
    {
      command: "VITE_RSVP_ENABLED=false bun run dev --port 5174",
      url: "http://localhost:5174",
      reuseExistingServer: !process.env["CI"],
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: "enabled",
      use: { baseURL: "http://localhost:5173" },
      testMatch: /home\.spec\.ts$/,
    },
    {
      name: "disabled",
      use: { baseURL: "http://localhost:5174" },
      testMatch: /disabled\.spec\.ts$/,
    },
  ],
});
