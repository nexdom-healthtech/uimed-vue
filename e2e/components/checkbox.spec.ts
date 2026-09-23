import { test, expect, type Page } from "@playwright/test";
import { gotoPage } from "@e2e/utils.ts";

test.describe("checkbox", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/checkbox");
  });

  test.describe("playground", () => {
    test("updates label text when playground-label changes", async ({ page }) => {
      const text = "Marcar aqui";
      await page.getByTestId("checkbox-playground-label").locator("input").fill(text);

      const previewCheckbox = getPreviewCheckbox(page);
      await expect(previewCheckbox).toContainText(text);
    });

    test("disables when playground-disabled is toggled", async ({ page }) => {
      const previewCheckbox = getPreviewCheckbox(page);
      await expect(previewCheckbox.locator("input")).toBeEnabled();

      await page.getByTestId("checkbox-playground-disabled").locator("input").click();
      await expect(previewCheckbox.locator("input")).toBeDisabled();
    });

    test("prevents changes when playground-readonly is toggled", async ({ page }) => {
      const previewCheckbox = getPreviewCheckbox(page);
      const input = previewCheckbox.locator("input");

      await page.getByTestId("checkbox-playground-readonly").locator("input").click();
      await expect(input).toHaveJSProperty("checked", false);

      await input.click({ force: true });
      await expect(input).toHaveJSProperty("checked", false);
    });

    test("matches the accessible snapshot of the preview checkbox in its default state", async ({
      page,
    }) => {
      const previewCheckbox = getPreviewCheckbox(page);
      await expect(previewCheckbox).toMatchAriaSnapshot();
    });
  });

  test.describe("events demo", () => {
    test("toggles the value and increments the update counter", async ({ page }) => {
      const updateCheckbox = page.getByTestId("checkbox-demo-update");
      const counter = page.getByTestId("checkbox-demo-update-count");

      await expect(counter).toContainText("0 alteração(ões)");

      await updateCheckbox.locator("input").click();
      await updateCheckbox.locator("input").click();

      await expect(counter).toContainText("2 alteração(ões)");
    });

    test("matches the accessible snapshot of the update demo", async ({ page }) => {
      const demo = page.getByTestId("demo-update-event");

      await expect(demo).toMatchAriaSnapshot();
    });
  });

  test.describe("custom values demo", () => {
    test("displays default state with checked checkbox and Ativado label", async ({ page }) => {
      const customValuesCheckbox = getCustomValuesCheckbox(page);

      await expect(customValuesCheckbox).toContainText("Ativado");
      await expect(customValuesCheckbox.locator("input")).toHaveJSProperty("checked", true);
    });

    test("toggles between Ativado and Desativado", async ({ page }) => {
      const customValuesCheckbox = getCustomValuesCheckbox(page);
      const input = customValuesCheckbox.locator("input");

      await input.click();
      await expect(customValuesCheckbox).toContainText("Desativado");
      await expect(input).toHaveJSProperty("checked", false);

      await input.click();
      await expect(customValuesCheckbox).toContainText("Ativado");
      await expect(input).toHaveJSProperty("checked", true);
    });

    test("matches the accessible snapshot of the custom values demo", async ({ page }) => {
      const customValuesCheckbox = getCustomValuesCheckbox(page);

      await expect(customValuesCheckbox).toMatchAriaSnapshot();
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

function getPreviewCheckbox(page: Page) {
  return page.getByTestId("checkbox-preview");
}

function getCustomValuesCheckbox(page: Page) {
  return page.getByTestId("custom-values-checkbox");
}
