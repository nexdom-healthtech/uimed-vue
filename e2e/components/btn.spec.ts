import { test, expect, type Page } from "@playwright/test";

test.describe("btn", () => {
  test.beforeEach(async ({ page }) => {
    await gotoBtnGuide(page);
  });

  test.describe("playground", () => {
    test("updates variant when playground-variant changes", async ({ page }) => {
      const previewButton = getPreviewButton(page);
      await expect(previewButton).toHaveClass(/v-btn--variant-elevated/);

      await selectOption(page, "btn-playground-variant", "ghost");
      await expect(previewButton).toHaveClass(/v-btn--variant-outlined/);
    });

    test("updates label text when playground-label changes", async ({ page }) => {
      await page.getByTestId("btn-playground-label").locator("input").fill("Confirmar");

      const previewButton = getPreviewButton(page);
      await expect(previewButton).toContainText("Confirmar");
    });

    test("updates color when playground-color changes", async ({ page }) => {
      const previewButton = getPreviewButton(page);
      await expect(previewButton).toHaveClass(/bg-primary/);

      await selectOption(page, "btn-playground-color", "danger");
      await expect(previewButton).toHaveClass(/bg-error/);
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
    test("increments the click counter and blocks clicks while disabled", async ({ page }) => {
      await page.goto("guide/components/btn");

      const counterText = page.getByTestId("btn-demo-click-count");
      const clickButton = page.getByTestId("btn-demo-click");

      await expect(counterText).toContainText("0 clique(s)");

      await clickButton.click();
      await clickButton.click();

      await expect(counterText).toContainText("2 clique(s)");
    });

    test("matches the accessible snapshot of the click demo", async ({ page }) => {
      await page.goto("guide/components/btn");

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

async function gotoBtnGuide(page: Page) {
  await page.goto("guide/components/btn");
  await page.locator("h1").waitFor({ state: "visible" });
}

function getPreviewButton(page: Page) {
  return page.getByTestId("btn-preview");
}

async function selectOption(page: Page, testId: string, option: string) {
  await page.getByTestId(testId).locator("input").click({ force: true });
  await page.getByRole("option", { name: option, exact: true }).click();
}
