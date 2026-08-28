import { gotoPage } from "@e2e/utils.ts";
import { test, expect } from "@playwright/test";

test.describe("root", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/root");
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});
