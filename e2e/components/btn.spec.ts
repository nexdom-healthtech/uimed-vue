import { test, expect, type Page } from "@playwright/test";
import { gotoPage, selectOption } from "@e2e/utils.ts";

test.describe("btn", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/btn");
  });

  test.describe("playground", () => {
    test("updates variant when playground-variant changes", async ({ page }) => {
      const previewButton = getPreviewButton(page);
      await expect(previewButton).toContainClass("v-btn--variant-elevated");

      await selectOption(page, "btn-playground-variant", "ghost");
      await expect(previewButton).toContainClass("v-btn--variant-outlined");
    });

    test("updates label text when playground-label changes", async ({ page }) => {
      const text = "Confirmar";
      await page.getByTestId("btn-playground-label").locator("input").fill(text);

      const previewButton = getPreviewButton(page);
      await expect(previewButton).toContainText(text);
    });

    test("updates color when playground-color changes", async ({ page }) => {
      const previewButton = getPreviewButton(page);
      await expect(previewButton).toContainClass("bg-primary");

      await selectOption(page, "btn-playground-color", "danger");
      await expect(previewButton).toContainClass("bg-error");
    });

    test("presents loading when playground-loading is toggled", async ({ page }) => {
      const previewButton = getPreviewButton(page);
      await expect(previewButton.locator(".v-btn__loader")).not.toBeAttached();

      await page.getByTestId("btn-playground-loading").locator("input").click();
      await expect(previewButton.locator(".v-btn__loader")).toBeAttached();
    });

    test("disables when playground-disabled is toggled", async ({ page }) => {
      const previewButton = getPreviewButton(page);
      await expect(previewButton).toBeEnabled();

      await page.getByTestId("btn-playground-disabled").locator("input").click();
      await expect(previewButton).toBeDisabled();
      await expect(previewButton).toMatchAriaSnapshot();
    });

    test("matches the accessible snapshot of the preview button in its default state", async ({
      page,
    }) => {
      const previewButton = getPreviewButton(page);
      await expect(previewButton).toMatchAriaSnapshot();
    });
  });

  test.describe("events demo", () => {
    test("increments the click counter", async ({ page }) => {
      const counterText = page.getByTestId("btn-demo-click-count");
      const clickButton = page.getByTestId("btn-demo-click");

      await expect(counterText).toContainText("0 clique(s)");

      await clickButton.click();
      await clickButton.click();

      await expect(counterText).toContainText("2 clique(s)");
    });

    test("matches the accessible snapshot of the click demo", async ({ page }) => {
      const demo = page.getByTestId("demo-click-event");

      await expect(demo).toMatchAriaSnapshot();
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

function getPreviewButton(page: Page) {
  return page.getByTestId("btn-preview");
}
