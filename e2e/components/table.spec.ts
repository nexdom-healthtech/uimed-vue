import { test, expect, type Page } from "@playwright/test";
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
    test("toggles header when checkbox is clicked", async ({ page }) => {
      const headerCheckbox = page.getByTestId("table-playground-header");

      const tables = getPlaygroundTables(page).locator("thead");
      await expect(tables).toHaveCount(1);

      await headerCheckbox.locator("input").click();
      await expect(tables).toHaveCount(0);
      await expect(page).toHaveScreenshot({ fullPage: true });

      await headerCheckbox.locator("input").click();
      await expect(tables).toHaveCount(1);
    });

    test("toggles vertical layout when checkbox is clicked", async ({ page }) => {
      const verticalCheckbox = page.getByTestId("table-playground-vertical");

      const tables = getPlaygroundTables(page);
      await expect(tables).toHaveCount(1);

      await verticalCheckbox.locator("input").click();
      await expect(tables).toHaveCount(2);
      await expect(page).toHaveScreenshot({ fullPage: true });
    });

    test("toggles loading state when checkbox is clicked", async ({ page }) => {
      const loadingCheckbox = page.getByTestId("table-playground-loading");
      const previewTable = getPlaygroundTables(page);

      await expect(previewTable).toBeVisible();

      await loadingCheckbox.locator("input").click();
      await expect(previewTable).not.toBeVisible();
      await expect(page).toHaveScreenshot({ fullPage: true });

      await loadingCheckbox.locator("input").click();
      await expect(previewTable).toBeVisible();
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

function getPlaygroundTables(page: Page) {
  return page.locator("[data-testid^=table-playground-preview]");
}
