const fs = require("node:fs");
const path = require("node:path");
const { expect, test } = require("@playwright/test");

const root = path.resolve(__dirname, "../..");
const artifactDir = path.join(root, "qa-proof-artifacts");
const screenshotsDir = path.join(artifactDir, "screenshots");
const resultsPath = path.join(artifactDir, "check-results.json");

const screens = [
  {
    id: "home",
    label: "홈",
    path: "/",
    heading: /PR을 올리면 화면 확인 proof가 댓글로 남습니다/,
    extraTestId: null
  },
  {
    id: "pricing",
    label: "가격/비교",
    path: "/pricing.html",
    heading: /^가격\/비교$/,
    extraTestId: "comparison-table"
  },
  {
    id: "settings",
    label: "설정",
    path: "/settings.html",
    heading: /^설정$/,
    extraTestId: "settings-checklist"
  }
];

const viewports = [
  { id: "desktop", label: "desktop", width: 1365, height: 768 },
  { id: "mobile", label: "mobile", width: 390, height: 844 }
];

const checks = [];

test.describe.configure({ mode: "serial" });

test.beforeAll(() => {
  fs.mkdirSync(screenshotsDir, { recursive: true });
});

for (const screen of screens) {
  for (const viewport of viewports) {
    test(`${screen.label} ${viewport.label} screenshot proof`, async ({ page }) => {
      const browserErrors = [];
      const screenshot = `qa-proof-artifacts/screenshots/${screen.id}-${viewport.id}.png`;
      const check = {
        screen: screen.label,
        viewport: viewport.label,
        status: "failed",
        screenshot,
        url: screen.path
      };

      page.on("console", (message) => {
        if (message.type() === "error") {
          browserErrors.push(message.text());
        }
      });

      try {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        const response = await page.goto(screen.path, { waitUntil: "networkidle" });
        expect(response && response.status()).toBeLessThan(400);

        await expect(page.getByRole("heading", { name: screen.heading })).toBeVisible();
        await expect(page.getByTestId("proof-summary")).toBeVisible();

        if (screen.extraTestId) {
          await expect(page.getByTestId(screen.extraTestId)).toBeVisible();
        }

        expect(browserErrors).toEqual([]);
        await page.screenshot({ fullPage: true, path: path.join(root, screenshot) });

        check.status = "passed";
      } catch (error) {
        check.error = String(error && error.message ? error.message : error).split("\n")[0];
        try {
          await page.screenshot({ fullPage: true, path: path.join(root, screenshot) });
        } catch {
          check.screenshot = "";
        }
        throw error;
      } finally {
        checks.push(check);
      }
    });
  }
}

test.afterAll(() => {
  fs.mkdirSync(artifactDir, { recursive: true });
  fs.writeFileSync(
    resultsPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        checks
      },
      null,
      2
    )
  );
});
