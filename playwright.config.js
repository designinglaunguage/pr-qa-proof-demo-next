const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/qa-proof",
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  fullyParallel: false,
  workers: 1,
  outputDir: "qa-proof-artifacts/test-results",
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "qa-proof-artifacts/playwright-report" }]
  ],
  use: {
    baseURL: process.env.QA_PROOF_BASE_URL || "http://127.0.0.1:4173",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure"
  },
  webServer: {
    command: "npm run start -- --port 4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: "http://127.0.0.1:4173"
  }
});
