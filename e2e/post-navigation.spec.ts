import { test, expect } from "@playwright/test";

test.describe("Job card navigation", () => {
  test("clicking a job card opens the post page", async ({ page }) => {
    await page.goto("/latest-jobs");
    const firstCard = page.locator('main a[href^="/post/"]').first();
    await expect(firstCard).toBeVisible();
    const href = await firstCard.getAttribute("href");

    await firstCard.click();
    await page.waitForURL(`**${href}`);
    await expect(page.locator("article h1")).toBeVisible();
  });

  test("navigation shows immediate feedback before the next page renders", async ({ page }) => {
    // Delay post-page data (incl. prefetches) so the in-between state is observable
    await page.route(
      (url) => url.pathname.startsWith("/post/"),
      async (route) => {
        if (route.request().headers()["rsc"]) await new Promise((r) => setTimeout(r, 2000));
        await route.continue();
      }
    );
    await page.goto("/latest-jobs");

    await page.locator('main a[href^="/post/"]').first().click();
    // Progress bar or loading skeleton must appear while the post loads
    await expect(page.locator('[role="progressbar"], [aria-busy="true"]').first()).toBeVisible({
      timeout: 1000,
    });
    await expect(page.locator("article h1")).toBeVisible();
  });

  test("syllabus page renders and shows the tracker", async ({ page }) => {
    await page.goto("/syllabus");
    const link = page.locator('main a[href^="/syllabus/"]').first();
    await expect(link).toBeVisible();
    await link.click();
    await page.waitForURL(/\/syllabus\/.+/);
    await expect(page.locator("h1")).toBeVisible();
  });
});
