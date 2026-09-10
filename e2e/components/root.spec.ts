import { gotoPage } from "@e2e/utils.ts";
import { test, expect } from "@playwright/test";

test.describe("root", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/root");
  });

  test.describe("props demo", () => {
    test("matches the accessible snapshot of the app bar demo", async ({ page }) => {
      const demo = page.getByTestId("demo-root-app-bar");

      await expect(demo).toMatchAriaSnapshot();
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});
