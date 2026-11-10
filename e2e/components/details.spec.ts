import { test, expect, type Page } from "@playwright/test";
import {
  expectLoadingAnnouncement,
  expectNoA11yViolations,
  expectScreenshot,
  gotoPage,
  selectOption,
  skipOutsideScreenshotBrowser,
} from "@e2e/utils.ts";

test.describe("details", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/details");
  });

  test.describe("demos", () => {
    test("starts with every item collapsed and expands one when its title is clicked", async ({
      page,
    }) => {
      const item = page.getByTestId("demo-details-item-personal");
      const header = item.getByRole("button", { name: "Dados pessoais" });
      const content = item.getByText("Nome, data de nascimento e documentos");

      for (const title of ["Dados pessoais", "Endereço", "Contato"]) {
        await expect(getItemsDemo(page).getByRole("button", { name: title })).toHaveAttribute(
          "aria-expanded",
          "false",
        );
      }
      await expect(content).toBeHidden();

      await header.click();
      await expect(header).toHaveAttribute("aria-expanded", "true");
      await expect(content).toBeVisible();
    });

    test("collapses an item when its title is clicked again", async ({ page }) => {
      const item = page.getByTestId("demo-details-item-personal");
      const header = item.getByRole("button", { name: "Dados pessoais" });
      const content = item.getByText("Nome, data de nascimento e documentos");

      await header.click();
      await expect(content).toBeVisible();

      await header.click();
      await expect(header).toHaveAttribute("aria-expanded", "false");
      await expect(content).toBeHidden();
    });

    test("keeps only one item expanded at a time", async ({ page }) => {
      const personal = page.getByTestId("demo-details-item-personal");
      const address = page.getByTestId("demo-details-item-address");

      await personal.getByRole("button", { name: "Dados pessoais" }).click();
      await expect(personal.getByText("Nome, data de nascimento e documentos")).toBeVisible();

      await address.getByRole("button", { name: "Endereço" }).click();

      await expect(address.getByText("Rua, número, bairro e CEP")).toBeVisible();
      await expect(personal.getByRole("button", { name: "Dados pessoais" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
      await expect(personal.getByText("Nome, data de nascimento e documentos")).toBeHidden();
    });

    test("renders the loading skeleton in the loading demo", async ({ page }) => {
      const bones = page.locator(".vp-doc .v-skeleton-loader__bone");
      await expect(bones.first()).toBeVisible();
      await expectLoadingAnnouncement(page.locator(".vp-doc .v-skeleton-loader"), 1);
    });

    test("matches the accessible snapshot of the items demo", async ({ page }) => {
      await expect(getItemsDemo(page)).toMatchAriaSnapshot();
    });
  });

  test.describe("playground", () => {
    test("updates the variant of every item when playground-variant changes", async ({ page }) => {
      const preview = getPreviewDetails(page);
      const items = preview.locator(".v-expansion-panel");
      await expect(items).toHaveCount(2);
      await expect(preview).not.toContainClass("v-expansion-panels--flat");
      await expect(items.nth(0)).not.toContainClass("border");

      await selectOption(page, "details-playground-variant", "secondary");
      await expect(preview).toContainClass("v-expansion-panels--flat");
      await expect(items.nth(0)).toContainClass("border");
      await expect(items.nth(1)).toContainClass("border");
    });

    test("shows a skeleton loader when playground-loading is toggled", async ({ page }) => {
      const preview = getPreviewDetails(page);
      const previewArea = page.locator(".playground-preview");

      await expect(preview).toBeVisible();
      await expect(previewArea.locator(".v-skeleton-loader__bone")).toHaveCount(0);

      await page.getByTestId("details-playground-loading").locator("input").click();

      await expect(preview).toBeHidden();
      await expect(previewArea.locator(".v-skeleton-loader__bone").first()).toBeVisible();
      await expect(previewArea.getByRole("alert", { name: "Carregando..." })).toBeVisible();
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

      await expect(getPreviewItem(page).getByText(text)).toBeVisible();
    });

    test("matches the accessible snapshot of the preview in its default state", async ({
      page,
    }) => {
      await expect(getPreviewDetails(page)).toMatchAriaSnapshot();
    });

    test("matches the accessible snapshot of the preview when expanded", async ({ page }) => {
      await getPreviewHeader(page).click();
      await expect(getPreviewItem(page).getByText(/Teste o componente Details/)).toBeVisible();
      await expect(getPreviewDetails(page)).toMatchAriaSnapshot();
    });
  });

  test.describe("accessibility", () => {
    test("has no violations", async ({ page }) => {
      await expectNoA11yViolations(page);
    });

    test("has no violations with an item expanded", async ({ page }) => {
      await page
        .getByTestId("demo-details-item-personal")
        .getByRole("button", { name: "Dados pessoais" })
        .click();
      await expect(
        page.getByTestId("demo-details-item-personal").getByText("Nome, data de nascimento"),
      ).toBeVisible();

      await expectNoA11yViolations(page);
    });
  });

  test.describe("UI consistency", () => {
    skipOutsideScreenshotBrowser();

    test("matches last screenshot", async ({ page }) => {
      await expectScreenshot(page, { fullPage: true });
    });
  });
});

function getItemsDemo(page: Page) {
  return page.getByTestId("demo-details-items");
}

function getPreviewDetails(page: Page) {
  return page.getByTestId("details-preview");
}

function getPreviewItem(page: Page) {
  return page.getByTestId("details-preview-item");
}

function getPreviewHeader(page: Page) {
  return getPreviewItem(page).getByRole("button");
}
