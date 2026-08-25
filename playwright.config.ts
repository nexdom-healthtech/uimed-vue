import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: !process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  expect: {
    toMatchAriaSnapshot: {
      pathTemplate: "{testDir}/{testFileDir}/__snapshots__/{testFileName}/{arg}{ext}",
    },
  },
  use: {
    baseURL: "http://localhost:4173/uimed-vue/",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: process.env.CI ? "off" : "on",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "vpr docs",
    url: "http://localhost:4173/uimed-vue/",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
