import { test, expect, type Page } from "@playwright/test";

test.describe("root", () => {
  test.beforeEach(async ({ page }) => {
    await gotoRootGuide(page);
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

async function gotoRootGuide(page: Page) {
  await page.goto("guide/components/root");
  await page.locator("h1").waitFor({ state: "visible" });
}
