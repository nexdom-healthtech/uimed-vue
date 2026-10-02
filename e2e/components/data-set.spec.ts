import { test, expect, type Locator, type Page } from "@playwright/test";
import { gotoPage, selectOption } from "@e2e/utils.ts";

test.describe("data-set", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/data-set");
  });

  test.describe("demos", () => {
    test("renders each item as a card through the default slot", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-items");
      const card = page.getByTestId("demo-data-set-items-2");

      await expect(dataSet.getByTestId(/^demo-data-set-items-\d$/)).toHaveCount(3);
      await expect(card).toContainText("Bruno Lima");
      await expect(card).toContainText("Plano Prata");
      await expect(dataSet.getByRole("navigation")).toHaveCount(0);
    });

    test("announces the records as a list to assistive technologies", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-items");
      const listItems = dataSet.getByRole("list").getByRole("listitem");

      await expect(dataSet.getByRole("list")).toHaveCount(1);
      await expect(listItems).toHaveCount(3);
      await expect(listItems.nth(1)).toContainText("Bruno Lima");
    });

    test("uses a native list without bullets for the records", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-items");
      const list = dataSet.locator("ul");
      const listItems = list.locator(":scope > li");

      await expect(list).toHaveCount(1);
      await expect(listItems).toHaveCount(3);
      await expect(dataSet.locator('[role="list"], [role="listitem"]')).toHaveCount(0);
      await expect(list).toHaveCSS("padding-left", "0px");
      await expect(list).toHaveCSS("margin-top", "0px");
      for (const listItem of await listItems.all()) {
        await expect(listItem).toHaveCSS("display", "block");
      }
    });

    test("stretches each card to the height of its list item", async ({ page }) => {
      const listItems = page.getByTestId("demo-data-set-fields").locator("ul > li");
      await expect(listItems).toHaveCount(4);

      for (const listItem of await listItems.all()) {
        const [itemBox, cardBox] = await Promise.all([
          listItem.boundingBox(),
          listItem.getByTestId(/^demo-data-set-fields-item-\d$/).boundingBox(),
        ]);
        expect(cardBox?.height).toBe(itemBox?.height);
      }
    });

    test("shows fewer than 3 cards per row when they wouldn't be 240px wide", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-items");
      const cards = dataSet.getByTestId(/^demo-data-set-items-\d$/);

      await expect(cards).toHaveCount(3);
      expect((await dataSet.boundingBox())?.width).toBeLessThan(3 * 240);
      expect(await countCardsInFirstRow(cards)).toBe(2);
      await expectCardsAtLeast240pxWide(cards);
    });

    test("shows the given number of cards per row", async ({ page }) => {
      const cards = page.getByTestId("demo-data-set-columns-item");

      await expect(cards).toHaveCount(4);
      expect(await countCardsInFirstRow(cards)).toBe(2);
      await expectCardsAtLeast240pxWide(cards);
    });

    test("stacks the cards on extra small screens", async ({ page }) => {
      await page.setViewportSize({ width: 400, height: 800 });
      const cards = page.getByTestId("demo-data-set-items").getByTestId(/^demo-data-set-items-\d$/);

      await expect(cards).toHaveCount(3);
      expect(await countCardsInFirstRow(cards)).toBe(1);
    });

    test("lines up the cards of the same row", async ({ page }) => {
      const cards = page.getByTestId("demo-data-set-item-card");

      await expect(cards).toHaveCount(2);
      const [first, second] = await Promise.all([
        cards.nth(0).boundingBox(),
        cards.nth(1).boundingBox(),
      ]);
      expect(first?.y).toBe(second?.y);
      expect(first?.height).toBe(second?.height);
    });

    test("splits the items into pages", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-pagination");
      const pagination = dataSet.getByRole("navigation");

      await expect(page.getByTestId("demo-data-set-pagination-item")).toHaveCount(6);
      await expect(pagination.getByRole("button", { name: /página \d/i })).toHaveCount(3);
      await expect(page.getByTestId("demo-data-set-pagination-page")).toHaveText("Página atual: 1");
    });

    test("goes to the next page", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-pagination");

      await dataSet.getByRole("button", { name: "Próxima página" }).click();

      await expect(dataSet.getByText("Gabriela Reis")).toBeVisible();
      await expect(dataSet.getByText("Ana Souza")).toHaveCount(0);
      await expect(page.getByTestId("demo-data-set-pagination-page")).toHaveText("Página atual: 2");
    });

    test("goes to the last page", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-pagination");

      await dataSet.getByRole("button", { name: "Ir à página 3" }).click();

      const cards = page.getByTestId("demo-data-set-pagination-item");
      await expect(cards).toHaveCount(3);
      await expect(cards.nth(2)).toContainText("Olívia Cardoso");
      await expect(page.getByTestId("demo-data-set-pagination-page")).toHaveText("Página atual: 3");
    });

    test("filters the items by the search text", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-search");

      await dataSet.getByRole("textbox", { name: "Pesquisar" }).fill("CAR");

      const cards = page.getByTestId("demo-data-set-search-item");
      await expect(cards).toHaveCount(1);
      await expect(cards.first()).toContainText("Carla Dias");
      await expect(dataSet.getByRole("navigation")).toHaveCount(0);
      await expect(page.getByTestId("demo-data-set-search-text")).toHaveText("Pesquisa: CAR");
    });

    test("only searches the given keys and shows the empty state", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-search");

      await dataSet.getByRole("textbox", { name: "Pesquisar" }).fill("Ouro");

      await expect(page.getByTestId("demo-data-set-search-item")).toHaveCount(0);
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

    test("renders the title and the subtitle of each card", async ({ page }) => {
      const cards = page.getByTestId("demo-data-set-item-card");

      await expect(cards).toHaveCount(2);
      await expect(cards.nth(0)).toHaveText(/1\. Ana Souza\s*São Paulo - SP/);
      await expect(cards.nth(1)).toHaveText(/2\. Bruno Lima\s*Belo Horizonte - MG/);
    });

    test("renders the fields of each card in a vertical table", async ({ page }) => {
      const table = page.getByTestId("demo-data-set-fields-table-2");

      await expect(page.getByTestId("demo-data-set-fields").getByRole("table")).toHaveCount(4);
      await expect(page.getByTestId("demo-data-set-fields-item-2")).toContainText("Bruno Lima");
      await expect(table.getByRole("rowheader")).toHaveText(["Plano", "Idade", "Carteirinha"]);
      await expect(table.getByRole("cell")).toHaveText(["Prata", "52 anos", "0001 9876 5432"]);
    });

    test("matches the accessible snapshot of the fields demo", async ({ page }) => {
      await expect(page.getByTestId("demo-data-set-fields")).toMatchAriaSnapshot();
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
      await expect(previewArea.getByRole("alert", { name: "Carregando..." })).toBeVisible();
    });

    test("updates the empty message when playground-no-data-text changes", async ({ page }) => {
      const preview = getPreview(page);
      const text = "Nenhum paciente encontrado.";

      await preview.getByRole("textbox", { name: "Pesquisar" }).fill("Zeca");
      await expect(preview.getByText("Nenhum registro encontrado.")).toBeVisible();

      await page.getByTestId("data-set-playground-no-data-text").locator("input").fill(text);
      await expect(preview.getByText(text)).toBeVisible();
    });

    test("keeps the cards at least 240px wide in the narrow preview", async ({ page }) => {
      const cards = getPreviewCards(page);
      await expect(cards).toHaveCount(3);
      expect((await getPreview(page).boundingBox())?.width).toBeLessThan(2 * 240);
      expect(await countCardsInFirstRow(cards)).toBe(1);

      await selectOption(page, "data-set-playground-columns", "4");
      await expect(page.getByTestId("data-set-playground-columns")).toContainText("4");
      expect(await countCardsInFirstRow(cards)).toBe(1);
      await expectCardsAtLeast240pxWide(cards);
    });

    test("updates the items per page when playground-items-per-page changes", async ({ page }) => {
      const preview = getPreview(page);
      const cards = getPreviewCards(page);
      await expect(cards).toHaveCount(3);

      await selectOption(page, "data-set-playground-items-per-page", "5");
      await expect(cards).toHaveCount(5);
      await expect(preview.getByRole("button", { name: /página \d/i })).toHaveCount(2);
    });

    test("shows every page button in the narrow preview", async ({ page }) => {
      const pagination = getPreview(page).getByRole("navigation");
      const pageButtons = pagination.getByRole("button", { name: /página \d/i });

      await expect(pageButtons).toHaveCount(3);
      await expect(pagination).not.toContainText("...");

      await pagination.getByRole("button", { name: "Ir à página 2" }).click();
      await expect(pageButtons).toHaveCount(3);
      await expect(pagination).not.toContainText("...");
    });

    test("hides the page controls when every item fits in one page", async ({ page }) => {
      const preview = getPreview(page);
      await expect(preview.getByRole("navigation")).toBeVisible();

      await selectOption(page, "data-set-playground-items-per-page", "10");
      await expect(getPreviewCards(page)).toHaveCount(8);
      await expect(preview.getByRole("navigation")).toHaveCount(0);
    });

    test("matches the accessible snapshot of the preview in its default state", async ({
      page,
    }) => {
      const preview = getPreview(page);
      await expect(preview.getByRole("textbox", { name: "Pesquisar" })).toBeVisible();
      await expect(getPreviewCards(page)).toHaveCount(3);
      await expect(preview).toMatchAriaSnapshot();
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

function getPreviewCards(page: Page) {
  return page.getByTestId("data-set-preview-item");
}

/**
 * Counts how many cards share the row of the first one, by their position on
 * the screen.
 */
async function countCardsInFirstRow(cards: Locator): Promise<number> {
  const boxes = await Promise.all((await cards.all()).map((card) => card.boundingBox()));
  const firstRowTop = boxes[0]?.y;
  return boxes.filter((box) => box?.y === firstRowTop).length;
}

/**
 * Checks that none of the cards got narrower than the minimum card width.
 */
async function expectCardsAtLeast240pxWide(cards: Locator) {
  for (const card of await cards.all()) {
    expect((await card.boundingBox())?.width).toBeGreaterThanOrEqual(240);
  }
}
