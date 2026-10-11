import { test, expect } from "@playwright/test";

test.describe("Admin Settings", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto("/admin/login");
    await page.fill('input[type="email"], input[name="email"]', "admin@naukari360.in");
    await page.fill('input[type="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin(?!\/login)/);
  });

  test("can navigate to site settings", async ({ page }) => {
    await page.locator('aside a[href="/admin/site-settings"]').click();
    await page.waitForURL(/\/admin\/site-settings/);
    expect(page.url()).toContain("/admin/site-settings");
  });

  test("site settings form loads with values", async ({ page }) => {
    await page.goto("/admin/site-settings");
    const siteNameInput = page.getByLabel("Site Name", { exact: true });
    await expect(siteNameInput).toBeVisible();
    expect(await siteNameInput.inputValue()).toBeTruthy();
  });

  test("can update site name and it shows on the public site", async ({ page }, testInfo) => {
    // Changes a global setting; running it in parallel projects would race
    test.skip(testInfo.project.name !== "chromium", "Runs once, on desktop");

    const siteNameInput = page.getByLabel("Site Name", { exact: true });
    const save = async () => {
      await page.getByRole("button", { name: "Save Settings" }).click();
      await expect(page.getByText("Settings saved!")).toBeVisible();
    };

    await page.goto("/admin/site-settings");
    const original = await siteNameInput.inputValue();
    await siteNameInput.fill("Naukari360 E2E");
    await save();

    try {
      // Admin saves invalidate the cached public pages. Reload until the new name shows,
      // since other tests' requests can have a page regeneration already in flight.
      await expect
        .poll(
          async () => {
            await page.goto("/");
            return page.locator("header").textContent();
          },
          { timeout: 15000 }
        )
        .toContain("Naukari360 E2E");
    } finally {
      await page.goto("/admin/site-settings");
      await siteNameInput.fill(original);
      await save();
    }
  });
});
