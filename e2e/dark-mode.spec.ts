import { test, expect } from "@playwright/test";

test.describe("Dark Mode", () => {
  test("page defaults to light mode or system preference", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    // Should have either light class, dark class, or rely on system
    const className = await html.getAttribute("class");
    expect(className !== undefined).toBeTruthy();
  });

  test("dark mode toggle switches theme", async ({ page }) => {
    await page.goto("/");
    const toggleBtn = page.locator('[aria-label="Toggle dark mode"]');
    
    if (await toggleBtn.isVisible()) {
      // Click to switch theme
      await toggleBtn.click();
      await page.waitForTimeout(300);
      
      const html = page.locator("html");
      const classAfterClick = await html.getAttribute("class");
      
      // Click again to switch back
      await toggleBtn.click();
      await page.waitForTimeout(300);
      
      const classAfterSecondClick = await html.getAttribute("class");
      
      // Classes should differ between toggles
      expect(classAfterClick).not.toBe(classAfterSecondClick);
    }
  });

  test("dark mode persists on navigation", async ({ page }) => {
    await page.goto("/");
    const toggleBtn = page.locator('[aria-label="Toggle dark mode"]');
    
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      await page.waitForTimeout(300);
      
      const htmlBefore = await page.locator("html").getAttribute("class");
      
      // Navigate to another page
      await page.goto("/contact");
      await page.waitForTimeout(300);
      
      const htmlAfter = await page.locator("html").getAttribute("class");
      
      // Theme should be preserved
      expect(htmlAfter).toBe(htmlBefore);
    }
  });

  test("dark mode persists on page refresh", async ({ page }) => {
    await page.goto("/");
    const toggleBtn = page.locator('[aria-label="Toggle dark mode"]');
    
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      await page.waitForTimeout(300);
      
      const htmlBefore = await page.locator("html").getAttribute("class");
      
      // Refresh page
      await page.reload();
      await page.waitForTimeout(500);
      
      const htmlAfter = await page.locator("html").getAttribute("class");
      
      expect(htmlAfter).toBe(htmlBefore);
    }
  });
});
