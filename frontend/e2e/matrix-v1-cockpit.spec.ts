import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const SCREENSHOT_DIR = path.join(process.cwd(), "test-results", "matrix-v1-cockpit");

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

function inputValue(page: Page, value: string) {
  return page.locator(`input[value="${value}"]`).first();
}

async function waitForDeclarationCycle(page: Page) {
  const createResponse = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      /\/api\/v1\/pollution\/declarations$/.test(response.url()) &&
      response.status() === 200,
    { timeout: 120_000 }
  );
  const submitResponse = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      /\/api\/v1\/pollution\/declarations\/[^/]+\/submit$/.test(response.url()) &&
      response.status() === 200,
    { timeout: 120_000 }
  );
  const evaluateResponse = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      /\/api\/v1\/pollution\/declarations\/[^/]+\/evaluate$/.test(response.url()) &&
      response.status() === 200,
    { timeout: 120_000 }
  );

  await page.getByRole("button", { name: "Lancer l'analyse" }).click();
  const [created, submitted, evaluated] = await Promise.all([createResponse, submitResponse, evaluateResponse]);
  return { created, submitted, evaluated, evaluation: await evaluated.json() };
}

test.use({
  viewport: { width: 1440, height: 900 },
  trace: "retain-on-failure",
  video: "retain-on-failure",
  screenshot: "only-on-failure",
});

test.describe("Matrix V1 cockpit", () => {
  test("validates sufficient and insufficient exact-match scenarios", async ({ page }) => {
    test.setTimeout(180_000);
    const consoleErrors: string[] = [];
    const directPropagationRequests: string[] = [];
    const badResponses: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });
    page.on("response", (response) => {
      const status = response.status();
      if (status >= 400 && !/favicon/i.test(response.url())) {
        badResponses.push(`${status} ${response.request().method()} ${response.url()}`);
      }
    });
    page.on("request", (request) => {
      if (/\/api\/v1\/propagation\//.test(request.url()) && !/\/api\/v1\/propagation\/network\.geojson$/.test(request.url())) {
        directPropagationRequests.push(`${request.method()} ${request.url()}`);
      }
    });

    await page.goto("http://localhost:5174/dashboard-pollution?view=declaration", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Declaration de pollution" })).toBeVisible();
    await expect(page.getByLabel("Date et heure de detection")).toBeVisible();

    await page.getByRole("button", { name: "Charger scenario matrice suffisant" }).click();
    await page.getByLabel("Date et heure de detection").fill("2026-07-15T08:30");
    await expect(inputValue(page, "100")).toBeVisible();
    await expect(inputValue(page, "0.055555556")).toBeVisible();
    await expect(inputValue(page, "7.5")).toBeVisible();
    await expect(page.getByLabel("Declaration de pollution").getByText("Point declare")).toBeVisible();
    await capture(page, "matrix-v1-sufficient-before.png");

    const sufficientCycle = await waitForDeclarationCycle(page);
    expect(sufficientCycle.created.status()).toBe(200);
    expect(sufficientCycle.submitted.status()).toBe(200);
    expect(sufficientCycle.evaluated.status()).toBe(200);
    expect(sufficientCycle.evaluation.matrix_result.scenario_id).toBe("SC_QR01_C01_QS01_QI01_QO01");
    expect(sufficientCycle.evaluation.matrix_result.method_used).toBe("EXACT_MATCH");
    expect(sufficientCycle.evaluation.matrix_result.exact_match).toBe(true);
    expect(sufficientCycle.evaluation.matrix_result.C_SidiAllalTazi_mg_L).toBe(0.035751168);
    expect(sufficientCycle.evaluation.matrix_result.C_BgGarde_mg_L).toBe(0.046694335);
    expect(sufficientCycle.evaluation.status).toBe("RISQUE_FAIBLE");
    expect(sufficientCycle.evaluation.travel_time_result.reference_id).toBe("TC_STATIONS_V1");
    const sufficientTargets = sufficientCycle.evaluation.travel_time_result.targets;
    const sufficientP29 = sufficientTargets.find((target) => target.target_station_code === "1355/8");
    const sufficientGarde = sufficientTargets.find((target) => target.target_station_code === "3738/8");
    expect(sufficientTargets.map((target) => target.target_legacy_station_id)).not.toContain(52);
    expect(sufficientP29?.travel_time_h).toBeGreaterThan(78);
    expect(sufficientP29?.travel_time_h).toBeLessThan(79);
    expect(sufficientP29?.method_used).toBe("AVERAGE_VELOCITY_FALLBACK");
    expect(sufficientP29?.confidence_level).toBe("LOW");
    expect(sufficientGarde?.travel_time_h).toBe(82);
    expect(sufficientGarde?.reference_distance_km).toBe(343.5);
    expect(sufficientGarde?.method_used).toBe("TC_OBSERVED_DIRECT");
    expect(sufficientGarde?.confidence_level).toBe("MEDIUM");
    expect(sufficientGarde?.estimated_arrival_at).toContain("2026-07-18");

    await expect(page.getByText("SC_QR01_C01_QS01_QI01_QO01", { exact: true })).toBeVisible();
    await expect(page.getByText("EXACT_MATCH", { exact: true })).toBeVisible();
    await expect(page.getByText("0.036").first()).toBeVisible();
    await expect(page.getByText("0.047").first()).toBeVisible();
    await expect(page.getByText("Temps d'arrivee estime")).toBeVisible();
    await expect(page.getByText("P29 Sidi Allal Tazi").first()).toBeVisible();
    await expect(page.getByText("Amont Barrage de Garde").first()).toBeVisible();
    await expect(page.getByText("Code station : 1355/8")).toBeVisible();
    await expect(page.getByText("Code station : 3738/8")).toBeVisible();
    await expect(page.getByText("82.0 h")).toBeVisible();
    await expect(page.getByText("78.3 h")).toBeVisible();
    await expect(page.getByText("Methode : Tc observe")).toBeVisible();
    await expect(page.getByText("Methode : Vitesse moyenne")).toBeVisible();
    await expect(page.getByText("MEDIUM")).toBeVisible();
    await expect(page.getByText("LOW")).toBeVisible();
    await capture(page, "matrix-v1-sufficient-result.png");

    const sufficientReportResponse = page.waitForResponse(
      (response) =>
        response.request().method() === "GET" &&
        /\/api\/v1\/pollution\/declarations\/[^/]+\/report$/.test(response.url()) &&
        response.status() === 200,
      { timeout: 60_000 }
    );
    await page.getByRole("button", { name: "Charger le rapport" }).click();
    const sufficientReport = await sufficientReportResponse;
    const sufficientReportPayload = await sufficientReport.json();
    expect(sufficientReportPayload.report_payload.travel_time_result.reference_id).toBe("TC_STATIONS_V1");
    expect(JSON.stringify(sufficientReportPayload.report_payload.travel_time_result)).not.toContain('"target_legacy_station_id":52');
    await expect(page.getByText(/Rapport report_/).first()).toBeVisible();
    await expect(page.getByText('"travel_time_result"')).toBeVisible();
    await capture(page, "matrix-v1-report.png");

    await page.getByRole("button", { name: "Charger scenario matrice a risque" }).click();
    await expect(inputValue(page, "250")).toBeVisible();
    await expect(inputValue(page, "0.277777778")).toBeVisible();
    await capture(page, "matrix-v1-risk-before.png");

    const riskCycle = await waitForDeclarationCycle(page);
    expect(riskCycle.evaluation.matrix_result.scenario_id).toBe("SC_QR02_C04_QS01_QI01_QO01");
    expect(riskCycle.evaluation.matrix_result.method_used).toBe("EXACT_MATCH");
    expect(riskCycle.evaluation.matrix_result.exact_match).toBe(true);
    expect(riskCycle.evaluation.matrix_result.C_SidiAllalTazi_mg_L).toBe(0.420350283);
    expect(riskCycle.evaluation.matrix_result.C_BgGarde_mg_L).toBe(0.563962579);
    expect(riskCycle.evaluation.status).toBe("RECOMMANDATION_PROPOSEE");
    expect(riskCycle.evaluation.risk_result.risk_level).toBe("HIGH");
    expect(riskCycle.evaluation.recommendations).toHaveLength(3);
    expect(riskCycle.evaluation.travel_time_result.targets.map((target) => target.target_station_code)).toEqual([
      "1355/8",
      "3738/8",
    ]);

    await expect(page.getByText("SC_QR02_C04_QS01_QI01_QO01", { exact: true })).toBeVisible();
    await expect(page.getByText("INSUFFISANT", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("0.420").first()).toBeVisible();
    await expect(page.getByText("0.564").first()).toBeVisible();
    await capture(page, "matrix-v1-risk-result.png");

    await expect(page.getByText("Scenario cible : SC_QR02_C04_QS01_QI02_QO01")).toBeVisible();
    await expect(page.getByText("Scenario cible : SC_QR02_C04_QS01_QI01_QO02")).toBeVisible();
    await expect(page.getByText("Scenario cible : SC_QR02_C04_QS03_QI01_QO01")).toBeVisible();
    await capture(page, "matrix-v1-strategies.png");

    await page.getByRole("radio", { name: /Surveillance/ }).click();
    await expect(page.getByText("Assistant Declaration d'incident")).not.toBeVisible();
    await page.getByRole("radio", { name: /Déclaration d'incident/ }).click();
    await expect(page.getByText("Assistant Declaration d'incident")).toBeVisible();
    await expect(inputValue(page, "250")).toBeVisible();

    const blockingConsoleErrors = consoleErrors.filter(
      (entry) => !/favicon|ResizeObserver|WebGL warning/i.test(entry)
    );
    expect(blockingConsoleErrors).toEqual([]);
    expect(directPropagationRequests).toEqual([]);
    expect(badResponses).toEqual([]);
  });
});
