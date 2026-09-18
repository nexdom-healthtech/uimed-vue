import { test, expect, type Page } from "@playwright/test";
import { gotoPage, selectOption } from "@e2e/utils.ts";

test.describe("content-set", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/content-set");
    page.on("dialog", (dialog) => dialog.accept());
  });

  test.describe("playground", () => {
    test("updates variant when playground-variant changes", async ({ page }) => {
      const previewCard = getPreviewCard(page);
      await expect(previewCard).toContainClass("v-card--variant-elevated");

      await selectOption(page, "content-set-playground-variant", "secondary");
      await expect(previewCard).toContainClass("v-card--variant-outlined");
      await expect(previewCard).toMatchAriaSnapshot();
    });

    test("updates title text when playground-title changes", async ({ page }) => {
      const text = "Novo Título";
      await page.getByTestId("content-set-playground-title").locator("input").fill(text);

      const previewCard = getPreviewCard(page);
      await expect(previewCard).toContainText(text);
    });

    test("updates subtitle text when playground-subtitle changes", async ({ page }) => {
      const text = "Novo Subtítulo";
      await page.getByTestId("content-set-playground-subtitle").locator("input").fill(text);

      const previewCard = getPreviewCard(page);
      await expect(previewCard).toContainText(text);
    });

    test("applies 100% width when playground-fullWidth is toggled", async ({ page }) => {
      const previewCard = getPreviewCard(page);
      await expect(previewCard).not.toHaveJSProperty("style.width", "100%");

      await page.getByTestId("content-set-playground-fullWidth").locator("input").click();
      await expect(previewCard).toHaveJSProperty("style.width", "100%");
    });

    test("applies 100% height when playground-fullHeight is toggled", async ({ page }) => {
      const previewCard = getPreviewCard(page);
      await expect(previewCard).not.toHaveJSProperty("style.height", "100%");

      await page.getByTestId("content-set-playground-fullHeight").locator("input").click();
      await expect(previewCard).toHaveJSProperty("style.height", "100%");
    });

    test("renders actions and reacts to clicks", async ({ page }) => {
      const previewCard = getPreviewCard(page);
      const saveAction = previewCard.getByRole("button", { name: "Salvar" });
      const cancelAction = previewCard.getByRole("button", { name: "Cancelar" });

      await expect(saveAction).toBeVisible();
      await expect(cancelAction).toBeVisible();

      const saveDialogPromise = page.waitForEvent("dialog");

      await saveAction.click();

      const saveDialog = await saveDialogPromise;
      expect(saveDialog).toBeTruthy();
      expect(saveDialog.type()).toBe("alert");
      expect(saveDialog.message()).toBe("Salvar clicado");

      const cancelDialogPromise = page.waitForEvent("dialog");

      await cancelAction.click();

      const cancelDialog = await cancelDialogPromise;
      expect(cancelDialog).toBeTruthy();
      expect(cancelDialog.type()).toBe("alert");
      expect(cancelDialog.message()).toBe("Cancelar clicado");
    });

    test("shows a skeleton loader when playground-loading is toggled", async ({ page }) => {
      const previewCard = getPreviewCard(page);
      const previewArea = page.locator(".playground-preview");

      await expect(previewCard).toBeVisible();
      await expect(previewArea.locator(".v-skeleton-loader__bone")).toHaveCount(0);

      await page.getByTestId("content-set-playground-loading").locator("input").click();

      await expect(previewCard).toBeHidden();
      await expect(previewArea.locator(".v-skeleton-loader__bone").first()).toBeVisible();
    });

    test("hides actions when playground-action is toggled", async ({ page }) => {
      const previewCard = getPreviewCard(page);
      await expect(previewCard.locator(".v-card-actions")).toBeAttached();

      await page.getByTestId("content-set-playground-actions").locator("input").click();
      await expect(previewCard.locator(".v-card-actions")).not.toBeAttached();
    });

    test("matches the accessible snapshot of the preview card in its default state", async ({
      page,
    }) => {
      const previewCard = getPreviewCard(page);
      await expect(previewCard).toMatchAriaSnapshot();
    });
  });

  test.describe("demos", () => {
    test("renders the loading skeleton in the loading demo", async ({ page }) => {
      const bones = page.locator(".vp-doc .v-skeleton-loader__bone");
      await expect(bones.first()).toBeVisible();
    });

    test("renders the Content component demo", async ({ page }) => {
      const vpdoc = page.locator(".vp-doc");
      await expect(
        vpdoc.getByText("Conteúdo estruturado com o componente Content").first(),
      ).toBeVisible();
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

function getPreviewCard(page: Page) {
  return page.getByTestId("content-set-preview");
}
