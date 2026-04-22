import { test, expect } from "@playwright/test";

// All tests preview-cookie in via middleware bypass.
test.use({
  extraHTTPHeaders: {},
});

test.beforeEach(async ({ context }) => {
  // Set preview cookie so middleware lets us past the Coming Soon gate
  // on production (vamos.net). Vercel preview URLs (*.vercel.app) bypass
  // automatically, but we set the cookie anyway for safety.
  await context.addCookies([
    {
      name: "vamos_preview",
      value: "1",
      domain: new URL(
        process.env.BASE_URL || "https://vamos-net.vercel.app"
      ).hostname,
      path: "/",
    },
  ]);
});

test.describe("Homepage", () => {
  test("loads without error", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("has VAMOS wordmark in header", async ({ page }) => {
    await page.goto("/");
    // Editorial wordmark: <div aria-label="VAMOS.NET"> containing stylized
    // 'Vamos' + red '!'. Use exact match on the div's aria-label (the outer
    // <a> uses 'Vamos.net home' which also fuzzy-matches 'VAMOS.NET').
    await expect(
      page.locator('div[aria-label="VAMOS.NET"]')
    ).toBeVisible({ timeout: 10000 });
  });

  test("shows navigation links", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("navigation").getByRole("link", { name: "Live Scores" })
    ).toBeVisible();
    await expect(
      page.getByRole("navigation").getByRole("link", { name: "Rankings" })
    ).toBeVisible();
  });

  test("no JS errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/");
    await page.waitForTimeout(3000);
    expect(errors).toHaveLength(0);
  });

  test("recent results section renders", async ({ page }) => {
    await page.goto("/");
    // Editorial heading: "Recent results." — match via partial text, case-insensitive
    await expect(
      page.getByRole("heading", { name: /recent\s+results/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("live feed eyebrow appears in ticker", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Live feed").first()).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("Scores Page", () => {
  test("loads without error", async ({ page }) => {
    const response = await page.goto("/scores");
    expect(response?.status()).toBe(200);
  });

  test("has scoreboard heading", async ({ page }) => {
    await page.goto("/scores");
    // Editorial hero: "The scoreboard."
    await expect(
      page.getByRole("heading", { name: /scoreboard/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("date navigation links work", async ({ page }) => {
    await page.goto("/scores");
    const prevLink = page.locator('a[href*="date="]').first();
    if (await prevLink.isVisible().catch(() => false)) {
      await prevLink.click();
      await page.waitForLoadState("networkidle");
      expect(page.url()).toContain("date=");
      await expect(
        page.getByRole("heading", { name: /scoreboard/i })
      ).toBeVisible();
    }
  });

  test("category filter works", async ({ page }) => {
    await page.goto("/scores");
    const menLink = page.locator('a[href*="category=men"]').first();
    if (await menLink.isVisible().catch(() => false)) {
      await menLink.click();
      await page.waitForLoadState("networkidle");
      expect(page.url()).toContain("category=men");
    }
  });

  test("no JS errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/scores");
    await page.waitForTimeout(3000);
    expect(errors).toHaveLength(0);
  });
});

test.describe("Other Pages Load", () => {
  test("rankings page loads", async ({ page }) => {
    const response = await page.goto("/rankings");
    expect(response?.status()).toBe(200);
  });

  test("players page loads", async ({ page }) => {
    const response = await page.goto("/players");
    expect(response?.status()).toBe(200);
  });

  test("tournaments page loads", async ({ page }) => {
    const response = await page.goto("/tournaments");
    expect(response?.status()).toBe(200);
  });

  test("calendar page loads", async ({ page }) => {
    const response = await page.goto("/calendar");
    expect(response?.status()).toBe(200);
  });

  test("news page loads", async ({ page }) => {
    const response = await page.goto("/news");
    expect(response?.status()).toBe(200);
  });

  test("about page loads", async ({ page }) => {
    const response = await page.goto("/about");
    expect(response?.status()).toBe(200);
  });

  test("business page loads", async ({ page }) => {
    const response = await page.goto("/business");
    expect(response?.status()).toBe(200);
  });
});

test.describe("API Routes", () => {
  test("player API returns data", async ({ request }) => {
    const response = await request.get("/api/players/264");
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.name).toBeTruthy();
  });
});
