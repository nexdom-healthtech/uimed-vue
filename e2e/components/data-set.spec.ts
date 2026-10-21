import { test, expect, type Locator, type Page } from "@playwright/test";
import {
  expectLoadingAnnouncement,
  expectNoA11yViolations,
  expectOutlinedButton,
  gotoPage,
  selectOption,
  themeTextRgb,
} from "@e2e/utils.ts";

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

    test("keeps the search field at the end of the bar, as wide as a card", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-search");
      const [dataSetBox, fieldBox] = await Promise.all([
        dataSet.boundingBox(),
        getSearchField(dataSet).boundingBox(),
      ]);

      expect(fieldBox?.width).toBe(240);
      expect(dataSetBox?.width).toBeGreaterThan(2 * 240);
      expect(getRight(fieldBox)).toBeCloseTo(getRight(dataSetBox), 0);
    });

    test("renders the list actions at the start of the bar, on the line of the search field", async ({
      page,
    }) => {
      const dataSet = page.getByTestId("demo-data-set-list-actions");
      const buttons = getListActionButtons(dataSet);
      await expect(buttons).toHaveText(["Novo paciente", "Exportar"]);

      const [dataSetBox, newBox, exportBox, fieldBox] = await Promise.all([
        dataSet.boundingBox(),
        buttons.nth(0).boundingBox(),
        buttons.nth(1).boundingBox(),
        getSearchField(dataSet).boundingBox(),
      ]);
      expect(newBox?.x).toBeCloseTo(dataSetBox?.x ?? 0, 0);
      expect(exportBox?.x).toBeGreaterThan(getRight(newBox));
      expect(fieldBox?.x).toBeGreaterThan(getRight(exportBox));
      expect(getRight(fieldBox)).toBeCloseTo(getRight(dataSetBox), 0);
      // The field's text and icon sit below its middle, above its underline, so the buttons line
      // up with the underline: centered on the field's box, they look higher than the field
      for (const box of [newBox, exportBox]) {
        expect(getBottom(box)).toBeCloseTo(getBottom(fieldBox), 0);
      }
    });

    test("starts the half of the search field at the middle of the bar", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-list-actions");
      const [dataSetBox, exportBox, searchHalfBox] = await Promise.all([
        dataSet.boundingBox(),
        getListActionButtons(dataSet).nth(1).boundingBox(),
        getSearchHalf(dataSet).boundingBox(),
      ]);
      const gap = 24;
      const middle = (dataSetBox?.x ?? 0) + ((dataSetBox?.width ?? 0) + gap) / 2;

      expect(getRight(exportBox)).toBeLessThan(middle - gap);
      expect(searchHalfBox?.x).toBeCloseTo(middle, 0);
      expect(getRight(searchHalfBox)).toBeCloseTo(getRight(dataSetBox), 0);
    });

    test("keeps the list actions out of the list of records", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-list-actions");

      await expect(dataSet.getByRole("list").getByRole("listitem")).toHaveCount(4);
      await expect(dataSet.getByRole("list").getByRole("button")).toHaveCount(0);
    });

    test("spaces the bar from the cards as the cards are spaced from each other", async ({
      page,
    }) => {
      const dataSet = page.getByTestId("demo-data-set-list-actions");
      const cards = page.getByTestId("demo-data-set-list-actions-item");
      const [fieldBox, firstCard, thirdCard] = await Promise.all([
        getSearchField(dataSet).boundingBox(),
        cards.nth(0).boundingBox(),
        cards.nth(2).boundingBox(),
      ]);
      const cardsGap = (thirdCard?.y ?? 0) - getBottom(firstCard);

      expect(cardsGap).toBeGreaterThan(0);
      expect((firstCard?.y ?? 0) - getBottom(fieldBox)).toBeCloseTo(cardsGap, 0);
    });

    test("outlines the list actions by default", async ({ page }) => {
      const buttons = getListActionButtons(page.getByTestId("demo-data-set-list-actions"));
      await expectOutlinedButton(buttons.nth(0), themeTextRgb.primary);
      await expectOutlinedButton(buttons.nth(1), themeTextRgb.primary);
    });

    test("calls the clicked list action", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-list-actions");
      const lastAction = page.getByTestId("demo-data-set-list-actions-last");
      await expect(lastAction).toHaveText("Última ação: nenhuma");

      await dataSet.getByRole("button", { name: "Exportar" }).click();
      await expect(lastAction).toHaveText("Última ação: Exportar");

      await dataSet.getByRole("button", { name: "Novo paciente" }).click();
      await expect(lastAction).toHaveText("Última ação: Novo paciente");
    });

    test("keeps the list actions with the search field", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-list-actions");

      await dataSet.getByRole("textbox", { name: "Pesquisar" }).fill("Zeca");

      await expect(page.getByTestId("demo-data-set-list-actions-item")).toHaveCount(0);
      await expect(dataSet.getByText("Nenhum registro encontrado.")).toBeVisible();
      await expect(getListActionButtons(dataSet)).toHaveText(["Novo paciente", "Exportar"]);
    });

    test("keeps the focus on the search field while the search stops and starts matching records", async ({
      page,
    }) => {
      const dataSet = page.getByTestId("demo-data-set-list-actions");
      const textbox = dataSet.getByRole("textbox", { name: "Pesquisar" });
      const cards = page.getByTestId("demo-data-set-list-actions-item");

      await textbox.focus();
      await page.keyboard.type("Xy");
      await expect(cards).toHaveCount(0);
      await expect(textbox).toBeFocused();

      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.type("Ana");
      await expect(cards).toHaveCount(1);
      await expect(textbox).toBeFocused();
      await expect(textbox).toHaveValue("Ana");
    });

    test("reaches the list actions before the search field with the keyboard", async ({ page }) => {
      const dataSet = page.getByTestId("demo-data-set-list-actions");
      const buttons = getListActionButtons(dataSet);

      await buttons.nth(0).focus();
      await page.keyboard.press("Tab");
      await expect(buttons.nth(1)).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(dataSet.getByRole("textbox", { name: "Pesquisar" })).toBeFocused();

      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Enter");
      await expect(page.getByTestId("demo-data-set-list-actions-last")).toHaveText(
        "Última ação: Exportar",
      );
    });

    test("stacks the list actions and the search field on extra small screens", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 400, height: 800 });
      const dataSet = page.getByTestId("demo-data-set-list-actions");
      const buttons = getListActionButtons(dataSet);
      await expect(buttons).toHaveCount(2);

      const boxes = await Promise.all([
        buttons.nth(0).boundingBox(),
        buttons.nth(1).boundingBox(),
        getSearchField(dataSet).boundingBox(),
      ]);
      const dataSetBox = await dataSet.boundingBox();
      for (const box of boxes) {
        expect(box?.x).toBeCloseTo(dataSetBox?.x ?? 0, 0);
        expect(box?.width).toBeCloseTo(dataSetBox?.width ?? 0, 0);
      }
      expect(boxes[1]?.y).toBeGreaterThan(getBottom(boxes[0]));
      expect(boxes[2]?.y).toBeGreaterThan(getBottom(boxes[1]));
    });

    test("renders the custom empty message", async ({ page }) => {
      await expect(page.getByTestId("demo-data-set-no-data")).toHaveText(
        "Nenhum paciente agendado para hoje.",
      );
    });

    test("renders the loading skeleton in the loading demo", async ({ page }) => {
      await expect(page.getByTestId("demo-data-set-loading")).toHaveCount(0);
      await expect(page.locator(".vp-doc .v-skeleton-loader__bone").first()).toBeVisible();
      await expectLoadingAnnouncement(page.locator(".vp-doc .v-skeleton-loader"), 1);
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

    test("renders the actions of each record in its card", async ({ page }) => {
      const listItems = page.getByTestId("demo-data-set-actions").getByRole("listitem");

      await expect(listItems).toHaveCount(2);
      for (const listItem of await listItems.all()) {
        await expect(listItem.getByRole("button")).toHaveText(["Editar", "Excluir"]);
      }
      await expect(page.getByTestId("demo-data-set-actions-last")).toHaveText(
        "Última ação: nenhuma",
      );
    });

    test("outlines the secondary actions in their colors", async ({ page }) => {
      const firstCard = page.getByTestId("demo-data-set-actions-item-1");

      await expectOutlinedButton(
        firstCard.getByRole("button", { name: "Editar" }),
        themeTextRgb.primary,
      );
      await expectOutlinedButton(
        firstCard.getByRole("button", { name: "Excluir" }),
        themeTextRgb.danger,
      );
    });

    test("calls the clicked action with its own record", async ({ page }) => {
      const lastAction = page.getByTestId("demo-data-set-actions-last");
      const firstCard = page.getByTestId("demo-data-set-actions-item-1");
      const secondCard = page.getByTestId("demo-data-set-actions-item-2");

      await secondCard.getByRole("button", { name: "Editar" }).click();
      await expect(lastAction).toHaveText("Última ação: Editar Bruno Lima");

      await firstCard.getByRole("button", { name: "Excluir" }).click();
      await expect(lastAction).toHaveText("Última ação: Excluir Ana Souza");

      await firstCard.getByRole("button", { name: "Editar" }).click();
      await expect(lastAction).toHaveText("Última ação: Editar Ana Souza");
    });

    test("lines up the actions at the bottom of the cards of the same row", async ({ page }) => {
      const cards = [
        page.getByTestId("demo-data-set-actions-item-1"),
        page.getByTestId("demo-data-set-actions-item-2"),
      ];
      const [firstTable, secondTable] = await Promise.all(
        cards.map((card) => card.getByRole("table").boundingBox()),
      );
      expect(firstTable?.height).toBeGreaterThan(secondTable?.height ?? Infinity);

      const [firstCard, secondCard, firstButton, secondButton] = await Promise.all([
        ...cards.map((card) => card.boundingBox()),
        ...cards.map((card) => card.getByRole("button", { name: "Excluir" }).boundingBox()),
      ]);
      expect(firstCard?.y).toBe(secondCard?.y);
      expect(firstButton?.y).toBe(secondButton?.y);
      for (const [card, button] of [
        [firstCard, firstButton],
        [secondCard, secondButton],
      ]) {
        const cardBottom = (card?.y ?? 0) + (card?.height ?? 0);
        const buttonBottom = (button?.y ?? 0) + (button?.height ?? 0);
        expect(cardBottom - buttonBottom).toBeGreaterThan(0);
        expect(cardBottom - buttonBottom).toBeLessThanOrEqual(16);
      }
    });

    test("matches the accessible snapshot of the list actions demo", async ({ page }) => {
      await expect(page.getByTestId("demo-data-set-list-actions")).toMatchAriaSnapshot();
    });

    test("matches the accessible snapshot of the actions demo", async ({ page }) => {
      await expect(page.getByTestId("demo-data-set-actions")).toMatchAriaSnapshot();
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

    test("shows the list actions when playground-actions is toggled", async ({ page }) => {
      const preview = getPreview(page);
      await expect(preview.getByRole("textbox", { name: "Pesquisar" })).toBeVisible();
      await expect(preview.getByRole("button", { name: "Novo paciente" })).toHaveCount(0);

      await page.getByTestId("data-set-playground-actions").locator("input").click();
      await expect(preview.getByRole("button", { name: "Novo paciente" })).toBeVisible();
      await expectOutlinedButton(
        preview.getByRole("button", { name: "Novo paciente" }),
        themeTextRgb.primary,
      );

      await page.getByTestId("data-set-playground-searchable").locator("input").click();
      await expect(preview.getByRole("textbox", { name: "Pesquisar" })).toHaveCount(0);
      await expect(preview.getByRole("button", { name: "Novo paciente" })).toBeVisible();

      await page.getByTestId("data-set-playground-actions").locator("input").click();
      await expect(preview.getByRole("button", { name: "Novo paciente" })).toHaveCount(0);
    });

    test("puts the list actions and the search field on lines of their own when two cards don't fit", async ({
      page,
    }) => {
      const preview = getPreview(page);
      await page.getByTestId("data-set-playground-actions").locator("input").click();
      const button = preview.getByRole("button", { name: "Novo paciente" });
      await expect(button).toBeVisible();

      const [previewBox, buttonBox, fieldBox, cardBox] = await Promise.all([
        preview.boundingBox(),
        button.boundingBox(),
        getSearchField(preview).boundingBox(),
        getPreviewCards(page).first().boundingBox(),
      ]);
      expect(previewBox?.width).toBeLessThan(2 * 240 + 24);
      expect(cardBox?.width).toBeCloseTo(previewBox?.width ?? 0, 0);
      expect(buttonBox?.x).toBeCloseTo(previewBox?.x ?? 0, 0);
      expect(fieldBox?.y).toBeGreaterThan(getBottom(buttonBox));
      expect(fieldBox?.width).toBe(240);
      expect(getRight(fieldBox)).toBeCloseTo(getRight(previewBox), 0);
    });

    test("hides the list actions while loading", async ({ page }) => {
      const previewArea = page.locator(".playground-preview");
      await page.getByTestId("data-set-playground-actions").locator("input").click();
      await expect(previewArea.getByRole("button", { name: "Novo paciente" })).toBeVisible();

      await page.getByTestId("data-set-playground-loading").locator("input").click();
      await expect(previewArea.getByRole("button", { name: "Novo paciente" })).toHaveCount(0);
      await expect(previewArea.getByRole("alert", { name: "Carregando..." })).toBeVisible();
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

  test.describe("accessibility", () => {
    test("has no violations", async ({ page }) => {
      await expectNoA11yViolations(page);
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
 * Gets the buttons of the list actions of the demo, by their names, so neither
 * the page controls nor the clear icon of the search field are picked.
 */
function getListActionButtons(dataSet: Locator) {
  return dataSet.getByRole("button", { name: /^(Novo paciente|Exportar)$/ });
}

/**
 * Gets the whole search field (its outline, label and icons), instead of its
 * inner text box, since the alignment checks measure the field as it's seen. No
 * role covers the whole field, so it's found by its class.
 */
function getSearchField(dataSet: Locator) {
  return dataSet.locator(".v-text-field");
}

/**
 * Gets the column of the bar that holds the search field: the second column
 * around the field, since the first one only wraps it to its own width. No role
 * covers a column, so it's found by its class.
 */
function getSearchHalf(dataSet: Locator) {
  return getSearchField(dataSet).locator("xpath=ancestor::div[contains(@class, 'v-col')][2]");
}

type Box = Awaited<ReturnType<Locator["boundingBox"]>>;

function getRight(box: Box) {
  return (box?.x ?? 0) + (box?.width ?? 0);
}

function getBottom(box: Box) {
  return (box?.y ?? 0) + (box?.height ?? 0);
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
