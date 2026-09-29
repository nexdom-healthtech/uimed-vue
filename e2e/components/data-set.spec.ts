import { test, expect, type Page } from "@playwright/test";
import { gotoPage, selectOption } from "@e2e/utils.ts";

test.describe("data-set", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/data-set");
  });

  test.describe("demos", () => {
    test("renders each item through the default slot", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-items");
      const items = dataSet.getByRole("listitem");

      await expect(items).toHaveCount(3);
      await expect(items.nth(0)).toHaveText(/Ana Souza\s*Plano Ouro/);
      await expect(page.getByTestId("demo-data-set-items-2")).toContainText("Bruno Lima");
      await expect(dataSet.getByRole("navigation")).toHaveCount(0);
    });

    test("splits the items into pages", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-pagination");
      const pagination = dataSet.getByRole("navigation");

      await expect(dataSet.getByRole("list").first().getByRole("listitem")).toHaveCount(5);
      await expect(pagination.getByRole("button", { name: /page \d/i })).toHaveCount(3);
      await expect(page.getByTestId("demo-data-set-pagination-page")).toHaveText("Página atual: 1");
    });

    test("goes to the next page", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-pagination");

      await dataSet.getByRole("button", { name: "Next page" }).click();

      await expect(dataSet.getByText("Felipe Costa")).toBeVisible();
      await expect(dataSet.getByText("Ana Souza")).toHaveCount(0);
      await expect(page.getByTestId("demo-data-set-pagination-page")).toHaveText("Página atual: 2");
    });

    test("goes to the last page", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-pagination");

      await dataSet.getByRole("button", { name: "Go to page 3" }).click();

      const items = dataSet.getByRole("list").first().getByRole("listitem");
      await expect(items).toHaveCount(2);
      await expect(items.nth(1)).toContainText("Lucas Barros");
      await expect(page.getByTestId("demo-data-set-pagination-page")).toHaveText("Página atual: 3");
    });

    test("filters the items by the search text", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-search");

      await dataSet.getByRole("textbox", { name: "Pesquisar" }).fill("CAR");

      const items = dataSet.getByRole("list").first().getByRole("listitem");
      await expect(items).toHaveCount(1);
      await expect(items.first()).toContainText("Carla Dias");
      await expect(dataSet.getByRole("navigation")).toHaveCount(0);
      await expect(page.getByTestId("demo-data-set-search-text")).toHaveText("Pesquisa: CAR");
    });

    test("only searches the given keys and shows the empty state", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-search");

      await dataSet.getByRole("textbox", { name: "Pesquisar" }).fill("Ouro");

      await expect(dataSet.getByRole("listitem")).toHaveCount(0);
      await expect(dataSet.getByText("Nenhum registro encontrado.")).toBeVisible();
    });

    test("renders the custom empty message", async ({ page }) => {
      await expect(page.getByTestId("demo-data-set-no-data")).toHaveText(
        "Nenhum paciente agendado para hoje.",
      );
    });

    test("renders the loading skeleton in the loading demo", async ({ page }) => {
      await expect(page.getByTestId("demo-data-set-loading")).toHaveCount(0);
      await expect(page.locator(".vp-doc .v-skeleton-loader__bone").first()).toBeVisible();
    });

    test("renders the title from the item title slot", async ({ page }) => {
      const items = page.getByTestId("demo-data-set-item").getByRole("listitem");

      await expect(items).toHaveCount(2);
      await expect(items.nth(0)).toContainText("1. Ana Souza");
      await expect(items.nth(1)).toContainText("2. Bruno Lima");
    });

    test("matches the accessible snapshot of the pagination demo", async ({ page }) => {
      await expect(page.getByTestId("demo-data-set-pagination")).toMatchAriaSnapshot();
    });
  });

  test.describe("playground", () => {
    test("hides the search field when playground-searchable is toggled", async ({ page }) => {
      const preview = getPreview(page);
      await expect(preview.getByRole("textbox", { name: "Pesquisar" })).toBeVisible();

      await page.getByTestId("data-set-playground-searchable").locator("input").click();
      await expect(preview.getByRole("textbox", { name: "Pesquisar" })).toHaveCount(0);
    });

    test("shows a skeleton loader when playground-loading is toggled", async ({ page }) => {
      const preview = getPreview(page);
      const previewArea = page.locator(".playground-preview");

      await expect(preview).toBeVisible();
      await expect(previewArea.locator(".v-skeleton-loader__bone")).toHaveCount(0);

      await page.getByTestId("data-set-playground-loading").locator("input").click();

      await expect(preview).toBeHidden();
      await expect(previewArea.locator(".v-skeleton-loader__bone").first()).toBeVisible();
    });

    test("updates the empty message when playground-no-data-text changes", async ({ page }) => {
      const preview = getPreview(page);
      const text = "Nenhum paciente encontrado.";

      await preview.getByRole("textbox", { name: "Pesquisar" }).fill("Zeca");
      await expect(preview.getByText("Nenhum registro encontrado.")).toBeVisible();

      await page.getByTestId("data-set-playground-no-data-text").locator("input").fill(text);
      await expect(preview.getByText(text)).toBeVisible();
    });

    test("updates the items per page when playground-items-per-page changes", async ({ page }) => {
      const preview = getPreview(page);
      const items = preview.getByRole("list").first().getByRole("listitem");
      await expect(items).toHaveCount(3);

      await selectOption(page, "data-set-playground-items-per-page", "5");
      await expect(items).toHaveCount(5);
      await expect(preview.getByRole("button", { name: /page \d/i })).toHaveCount(2);
    });

    test("shows every page button in the narrow preview", async ({ page }) => {
      const pagination = getPreview(page).getByRole("navigation");
      const pageButtons = pagination.getByRole("button", { name: /page \d/i });

      await expect(pageButtons).toHaveCount(3);
      await expect(pagination).not.toContainText("...");

      await pagination.getByRole("button", { name: "Go to page 2" }).click();
      await expect(pageButtons).toHaveCount(3);
      await expect(pagination).not.toContainText("...");
    });

    test("hides the page controls when every item fits in one page", async ({ page }) => {
      const preview = getPreview(page);
      await expect(preview.getByRole("navigation")).toBeVisible();

      await selectOption(page, "data-set-playground-items-per-page", "10");
      await expect(preview.getByRole("list").first().getByRole("listitem")).toHaveCount(8);
      await expect(preview.getByRole("navigation")).toHaveCount(0);
    });

    test("matches the accessible snapshot of the preview items in their default state", async ({
      page,
    }) => {
      const preview = getPreview(page);
      await expect(preview.getByRole("textbox", { name: "Pesquisar" })).toBeVisible();
      await expect(preview.getByRole("list").first()).toMatchAriaSnapshot();
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

function getPreview(page: Page) {
  return page.getByTestId("data-set-preview");
}
