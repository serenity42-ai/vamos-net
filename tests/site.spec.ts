import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads without error", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("has VAMOS branding in header", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Vamos.net" })).toBeVisible({ timeout: 10000 });
  });

  test("shows navigation links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation").getByRole("link", { name: "Live Scores" })).toBeVisible();
    await expect(page.getByRole("navigation").getByRole("link", { name: "Rankings" })).toBeVisible();
  });

  test("no JS errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/");
    await page.waitForTimeout(3000);
    expect(errors).toHaveLength(0);
  });

  test("recent results section exists", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Recent Results").first()).toBeVisible({ timeout: 10000 });
  });

  test("match card opens modal on click", async ({ page }) => {
    await page.goto("/");
    const card = page.locator('[role="button"]').first();
    if (await card.isVisible({ timeout: 5000 }).catch(() => false)) {
      await card.click();
      // Modal overlay should appear
      await expect(page.locator(".fixed.inset-0")).toBeVisible({ timeout: 5000 });
      // Close with Escape
      await page.keyboard.press("Escape");
      await expect(page.locator(".fixed.inset-0")).not.toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe("Scores Page", () => {
  test("loads without error", async ({ page }) => {
    const response = await page.goto("/scores");
    expect(response?.status()).toBe(200);
  });

  test("has Live Scores heading", async ({ page }) => {
    await page.goto("/scores");
    await expect(page.getByRole("heading", { name: "Live Scores" })).toBeVisible({ timeout: 10000 });
  });

  test("date navigation links work", async ({ page }) => {
    await page.goto("/scores");
    // Click previous day link (the one with <)
    const prevLink = page.locator('a[href*="date="]').first();
    if (await prevLink.isVisible()) {
      await prevLink.click();
      await page.waitForLoadState("networkidle");
      expect(page.url()).toContain("date=");
      // Page should still have the heading
      await expect(page.getByRole("heading", { name: "Live Scores" })).toBeVisible();
    }
  });

  test("category filter works", async ({ page }) => {
    await page.goto("/scores");
    // Use more specific locator — the Men link inside the filter section
    const menLink = page.locator('a[href*="category=men"]').first();
    if (await menLink.isVisible()) {
      await menLink.click();
      await page.waitForLoadState("networkidle");
      expect(page.url()).toContain("category=men");
    }
  });

  test("match rows are clickable and open modal", async ({ page }) => {
    await page.goto("/scores");
    const row = page.locator('[role="button"]').first();
    if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
      await row.click();
      await expect(page.locator(".fixed.inset-0")).toBeVisible({ timeout: 5000 });
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
});

test.describe("API Routes", () => {
  test("player API returns data", async ({ request }) => {
    const response = await request.get("/api/players/264");
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.name).toBeTruthy();
  });
});
