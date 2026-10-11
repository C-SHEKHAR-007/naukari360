import { test, expect } from "@playwright/test";

test.describe("Public User Features (V2)", () => {
  test("UserNav shows Sign In button when unauthenticated", async ({ page }) => {
    await page.goto("/");

    // Icon-only button in the header's UserNav, identified by its accessible name
    const signInButton = page.locator("header").getByRole("button", { name: "Sign in" });
    await expect(signInButton).toBeVisible();
  });

  test("Jobs For You feed is hidden when unauthenticated", async ({ page }) => {
    await page.goto("/");

    // The "Jobs For You" header shouldn't be present if not logged in
    const personalizedHeader = page.locator('h2:has-text("Jobs For You")');
    await expect(personalizedHeader).not.toBeVisible();
  });

  test("redirects to login when accessing /profile without auth", async ({ page }) => {
    await page.goto("/profile");
    // NextAuth's auth() guard redirects to the configured signIn page (/admin/login)
    await page.waitForURL(/\/admin\/login/);
    expect(page.url()).toContain("/admin/login");
  });

  test("shows a sign-in prompt on /bookmarks without auth", async ({ page }) => {
    await page.goto("/bookmarks");
    await expect(page.getByRole("heading", { name: "Save your favorite jobs" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in with Google" })).toBeVisible();
  });
});
