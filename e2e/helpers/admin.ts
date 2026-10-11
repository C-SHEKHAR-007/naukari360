import { expect, type Page } from "@playwright/test";

export async function loginAsAdmin(page: Page) {
  await page.goto("/admin/login");
  await page.fill('input[type="email"]', "admin@naukari360.in");
  await page.fill('input[type="password"]', "admin123");
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/admin(?!\/login)/);
}

/** Admin sidebar link; opens the mobile drawer first on small screens */
export async function adminNavLink(page: Page, href: string) {
  const openNav = page.getByRole("button", { name: "Open navigation" });
  const drawer = page.getByRole("dialog", { name: "Admin navigation" });
  if ((await openNav.isVisible()) && !(await drawer.isVisible())) {
    await openNav.click();
    await expect(drawer).toBeVisible();
  }
  return page.locator(`aside a[href="${href}"]:visible`);
}
