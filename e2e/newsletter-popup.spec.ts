import { test, expect } from "@playwright/test";

test.describe("Newsletter Popup", () => {
  test("shows newsletter popup after delay", async ({ page }) => {
    // Clear localStorage
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("newsletter_dismissed");
      localStorage.removeItem("newsletter_subscribed");
    });
    await page.reload();

    // Wait for popup to appear (15s timeout in code, but we can manipulate time)
    await page.waitForSelector("text=Stay Updated!", { timeout: 20000 });
    await expect(page.locator("text=Stay Updated!")).toBeVisible();
  });

  test("popup can be dismissed", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("newsletter_dismissed");
      localStorage.removeItem("newsletter_subscribed");
    });
    await page.reload();

    await page.waitForSelector("text=Stay Updated!", { timeout: 20000 });
    await page.click('[aria-label="Close"]');
    await expect(page.locator("text=Stay Updated!")).not.toBeVisible();
  });

  test("does not show if already dismissed", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("newsletter_dismissed", Date.now().toString());
    });
    await page.reload();
    await page.waitForTimeout(16000);
    await expect(page.locator("text=Stay Updated!")).not.toBeVisible();
  });

  test("subscribes with valid email", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("newsletter_dismissed");
      localStorage.removeItem("newsletter_subscribed");
    });
    await page.reload();

    await page.waitForSelector("text=Stay Updated!", { timeout: 20000 });
    await page.fill('input[type="email"]', `e2e-${Date.now()}@test.com`);
    await page.click("text=Subscribe Free");
    await expect(page.locator("text=Subscribed successfully")).toBeVisible({ timeout: 5000 });
  });
});
