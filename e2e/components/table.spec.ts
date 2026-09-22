import { test, expect } from "@playwright/test";
import { gotoPage } from "@e2e/utils.ts";

test.describe("table", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/table");
  });

  test.describe("default state", () => {
    test("renders table on page load", async ({ page }) => {
      const tables = page.getByRole("table");
      await expect(tables.first()).toBeVisible();
    });
  });

  test.describe("horizontal layout", () => {
    test("renders with headers in thead", async ({ page }) => {
      const demoTable = page.getByTestId("demo-table-horizontal");
      const thead = demoTable.locator("thead");
      await expect(thead).toBeVisible();
      const headers = thead.locator("th");
      await expect(headers).toHaveCount(3);
    });

    test("renders items as tbody rows", async ({ page }) => {
      const demoTable = page.getByTestId("demo-table-horizontal");
      const tbody = demoTable.locator("tbody");
      const rows = tbody.locator("tr");
      await expect(rows).toHaveCount(2);
    });
  });

  test.describe("playground", () => {
    test("toggles vertical layout when checkbox is clicked", async ({ page }) => {
      const verticalCheckbox = page.getByTestId("table-playground-vertical");

      // Click to enable vertical
      await verticalCheckbox.locator("input").click();

      // After clicking, layout should change (vertical renders multiple tables)
      // Wait a bit for update
      await page.waitForTimeout(100);
      const tables = page.getByRole("table");
      const tableCount = await tables.count();
      expect(tableCount).toBeGreaterThan(1);
    });

    test("toggles loading state when checkbox is clicked", async ({ page }) => {
      const loadingCheckbox = page.getByTestId("table-playground-loading");
      const previewTable = page.getByTestId("table-playground-preview");

      // Initially table should be visible (not loading)
      await expect(previewTable).toBeVisible();

      // Click to enable loading
      await loadingCheckbox.locator("input").click();

      // Wait for state to update
      await page.waitForTimeout(100);

      // Click to disable loading again
      await loadingCheckbox.locator("input").click();

      // Table should still be visible
      await expect(previewTable).toBeVisible();
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});
