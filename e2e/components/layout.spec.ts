import { gotoPage } from "@e2e/utils.ts";
import { test, expect } from "@playwright/test";

test.describe("layout", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/layout");
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});
