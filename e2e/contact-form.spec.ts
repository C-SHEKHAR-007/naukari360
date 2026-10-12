import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("contact page loads with form", async ({ page }) => {
    await expect(page.locator("form")).toBeVisible();
    await expect(page.getByLabel("Name *")).toBeVisible();
    await expect(page.getByLabel("Email *")).toBeVisible();
    await expect(page.getByLabel("Subject *")).toBeVisible();
    await expect(page.getByLabel("Message *")).toBeVisible();
  });

  test("form shows validation on empty submit", async ({ page }) => {
    const submitBtn = page.locator("button[type='submit']");
    await submitBtn.click();
    // Browser validation or custom validation message should appear
    const nameInput = page.locator("input[name='name']").first();
    const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test("form submits successfully with valid data", async ({ page }) => {
    await page.locator("input[name='name']").fill("Test User");
    await page.locator("input[name='email']").fill("test@example.com");
    await page.locator("select[name='type']").selectOption("general");
    await page.locator("input[name='subject']").fill("Playwright test");
    await page.locator("textarea[name='message']").fill("This is a test message from Playwright");

    await page.locator("button[type='submit']").click();

    // Wait for success
    await expect(page.locator("text=/success|thank|sent/i")).toBeVisible({ timeout: 10000 });
  });

  test("form rejects invalid email", async ({ page }) => {
    await page.locator("input[name='name']").fill("Test");
    await page.locator("input[name='email']").fill("not-an-email");
    await page.locator("textarea[name='message']").fill("Test message");
    await page.locator("button[type='submit']").click();

    // Should show browser validation or custom error
    const emailInput = page.locator("input[name='email']").first();
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });
});
