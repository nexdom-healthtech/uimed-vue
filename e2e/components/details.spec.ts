import { test, expect, type Page } from "@playwright/test";
import { gotoPage, selectOption } from "@e2e/utils.ts";

test.describe("details", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/details");
  });

  test.describe("demos", () => {
    test("starts collapsed and expands when the title is clicked", async ({ page }) => {
      const details = page.getByTestId("demo-details-title");
      const header = details.getByRole("button", { name: "Mais informações" });
      const content = details.getByText("Conteúdo exibido ao expandir");

      await expect(header).toHaveAttribute("aria-expanded", "false");
      await expect(content).toBeHidden();

      await header.click();
      await expect(header).toHaveAttribute("aria-expanded", "true");
      await expect(content).toBeVisible();
    });

    test("collapses when the title is clicked again", async ({ page }) => {
      const details = page.getByTestId("demo-details-title");
      const header = details.getByRole("button", { name: "Mais informações" });
      const content = details.getByText("Conteúdo exibido ao expandir");

      await header.click();
      await expect(content).toBeVisible();

      await header.click();
      await expect(header).toHaveAttribute("aria-expanded", "false");
      await expect(content).toBeHidden();
    });

    test("keeps each details independent from the others", async ({ page }) => {
      const first = page.getByTestId("demo-details-first");
      const second = page.getByTestId("demo-details-second");

      await first.getByRole("button", { name: "Primeiro" }).click();
      await second.getByRole("button", { name: "Segundo" }).click();

      await expect(first.getByText("Conteúdo do primeiro")).toBeVisible();
      await expect(second.getByText("Conteúdo do segundo")).toBeVisible();
    });

    test("renders the loading skeleton in the loading demo", async ({ page }) => {
      const bones = page.locator(".vp-doc .v-skeleton-loader__bone");
      await expect(bones.first()).toBeVisible();
    });
  });

  test.describe("playground", () => {
    test("updates variant when playground-variant changes", async ({ page }) => {
      const preview = getPreviewDetails(page);
      await expect(preview).not.toContainClass("v-expansion-panels--flat");
      await expect(preview.locator(".v-expansion-panel")).not.toContainClass("border");

      await selectOption(page, "details-playground-variant", "secondary");
      await expect(preview).toContainClass("v-expansion-panels--flat");
      await expect(preview.locator(".v-expansion-panel")).toContainClass("border");
    });

    test("shows a skeleton loader when playground-loading is toggled", async ({ page }) => {
      const preview = getPreviewDetails(page);
      const previewArea = page.locator(".playground-preview");

      await expect(preview).toBeVisible();
      await expect(previewArea.locator(".v-skeleton-loader__bone")).toHaveCount(0);

      await page.getByTestId("details-playground-loading").locator("input").click();

      await expect(preview).toBeHidden();
      await expect(previewArea.locator(".v-skeleton-loader__bone").first()).toBeVisible();
    });

    test("updates title text when playground-title changes", async ({ page }) => {
      const text = "Novo Título";
      await page.getByTestId("details-playground-title").locator("input").fill(text);

      await expect(getPreviewHeader(page)).toHaveText(text);
    });

    test("updates content text when playground-content changes", async ({ page }) => {
      const text = "Novo Conteúdo";
      await page.getByTestId("details-playground-content").locator("input").fill(text);
      await getPreviewHeader(page).click();

      await expect(getPreviewDetails(page).getByText(text)).toBeVisible();
    });

    test("matches the accessible snapshot of the preview in its default state", async ({
      page,
    }) => {
      await expect(getPreviewDetails(page)).toMatchAriaSnapshot();
    });

    test("matches the accessible snapshot of the preview when expanded", async ({ page }) => {
      await getPreviewHeader(page).click();
      await expect(getPreviewDetails(page).getByText(/Teste o componente Details/)).toBeVisible();
      await expect(getPreviewDetails(page)).toMatchAriaSnapshot();
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

function getPreviewDetails(page: Page) {
  return page.getByTestId("details-preview");
}

function getPreviewHeader(page: Page) {
  return getPreviewDetails(page).getByRole("button");
}
