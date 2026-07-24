import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const SCREENSHOT_DIR = path.join(process.cwd(), "test-results", "platform-stabilization", "01-home");

function ensureScreenshotDir() {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function capture(page: Page, name: string) {
  ensureScreenshotDir();
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, name),
    fullPage: true,
  });
}

test.use({
  viewport: { width: 1440, height: 900 },
  trace: "retain-on-failure",
  video: "retain-on-failure",
  screenshot: "only-on-failure",
});

test.describe("STAB-01 Home dashboard", () => {
  test("loads Home on first access and keeps primary navigation usable", async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const failedRequests: string[] = [];
    const criticalHttpErrors: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("requestfailed", (request) => {
      failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? ""}`);
    });
    page.on("response", (response) => {
      if (response.status() >= 400 && /\/api\/v1\//.test(response.url())) {
        criticalHttpErrors.push(`${response.status()} ${response.request().method()} ${response.url()}`);
      }
    });

    await page.goto("http://localhost:5174/", { waitUntil: "domcontentloaded" });
    await capture(page, "01-home-loading.png");

    await expect(page.getByText("WaterQual Sebou")).toBeVisible({ timeout: 120_000 });
    await expect(page.getByText("Le Home opérationnel n’a pas pu être chargé.")).not.toBeVisible();
    await expect(page.getByRole("heading", { name: "Carte métier - Vue bassin" })).toBeVisible();
    await expect(page.getByText("Confiance données")).toBeVisible();
    await capture(page, "02-home-success.png");

    await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => undefined);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByText("WaterQual Sebou")).toBeVisible({ timeout: 30_000 });
    await capture(page, "03-home-reload.png");

    await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => undefined);
    failedRequests.length = 0;
    await page.getByRole("link", { name: /Ouvrir la carte métier complète/i }).first().click();
    await expect(page).toHaveURL(/\/dashboard-carto-metier/);

    const blockingConsoleErrors = consoleErrors.filter(
      (entry) => !/favicon|ResizeObserver|WebGL warning/i.test(entry)
    );
    const blockingFailedRequests = failedRequests.filter(
      (entry) => !/favicon|basemaps\.cartocdn\.com/i.test(entry)
    );

    expect(blockingConsoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(blockingFailedRequests).toEqual([]);
    expect(criticalHttpErrors).toEqual([]);
  });
});
