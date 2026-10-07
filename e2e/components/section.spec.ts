import { test, expect, type Locator, type Page } from "@playwright/test";
import { gotoPage, selectOption } from "@e2e/utils.ts";

test.describe("section", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/section");
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

    for (const [prop, dimension] of [
      ["fullWidth", "width"],
      ["fullHeight", "height"],
    ] as const) {
      test(`fills the preview's ${dimension} when playground-${prop} is toggled`, async ({
        page,
      }) => {
        const previewCard = getPreviewCard(page);
        // The default content wraps across the whole preview, so a short one leaves room to fill
        await page.getByTestId("content-set-playground-content").locator("input").fill("Curto");
        await expect(previewCard).toContainText("Curto");
        expect(await getFillRatio(previewCard, dimension)).toBeLessThan(0.99);

        await page.getByTestId(`content-set-playground-${prop}`).locator("input").click();
        await expect.poll(() => getFillRatio(previewCard, dimension)).toBeCloseTo(1, 2);
      });
    }

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

    test("centers the preview card when playground-textAlign changes to center", async ({
      page,
    }) => {
      const previewCard = getPreviewCard(page);
      await expect(previewCard).toHaveCSS("text-align", "start");
      await expect(previewCard.locator(".v-card-actions")).toHaveCSS("justify-content", "flex-end");

      await selectOption(page, "content-set-playground-textAlign", "center");
      await expect(previewCard).toHaveCSS("text-align", "center");
      await expect(previewCard.locator(".v-card-actions")).toHaveCSS("justify-content", "center");
      await expectCentered(previewCard);
    });

    test("aligns the preview card to the end when playground-textAlign changes to end", async ({
      page,
    }) => {
      const previewCard = getPreviewCard(page);
      await selectOption(page, "content-set-playground-textAlign", "end");
      await expect(previewCard).toHaveCSS("text-align", "end");
      await expect(previewCard.locator(".v-card-actions")).toHaveCSS("justify-content", "flex-end");
    });

    test("shows a skeleton loader when playground-loading is toggled", async ({ page }) => {
      const previewCard = getPreviewCard(page);
      const previewArea = page.locator(".playground-preview");

      await expect(previewCard).toBeVisible();
      await expect(previewArea.locator(".v-skeleton-loader__bone")).toHaveCount(0);

      await page.getByTestId("content-set-playground-loading").locator("input").click();

      await expect(previewCard).toBeHidden();
      await expect(previewArea.locator(".v-skeleton-loader__bone").first()).toBeVisible();
      await expect(previewArea.getByRole("alert", { name: "Carregando..." })).toBeVisible();
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

    test("renders the SectionContent component demo", async ({ page }) => {
      const vpdoc = page.locator(".vp-doc");
      await expect(
        vpdoc.getByText("Conteúdo estruturado com o componente SectionContent").first(),
      ).toBeVisible();
    });
  });

  test.describe("alignment demos", () => {
    test("aligns the text to the start and keeps the actions at the end by default", async ({
      page,
    }) => {
      const card = page.getByTestId("section-align-start");
      await expect(card).toHaveCSS("text-align", "start");
      await expectAlignedTo(card, "start");
    });

    test("centers the title, subtitle, content and actions", async ({ page }) => {
      const card = page.getByTestId("section-align-center");
      await expect(card).toHaveCSS("text-align", "center");
      await expect(card.locator(".v-card-actions")).toHaveCSS("justify-content", "center");
      await expectCentered(card);

      const dialogPromise = page.waitForEvent("dialog");
      await card.getByRole("button", { name: "Voltar para o Início" }).click();
      expect((await dialogPromise).message()).toBe("Voltar para o Início clicado");
    });

    test("aligns the title, subtitle, content and actions to the end", async ({ page }) => {
      const card = page.getByTestId("section-align-end");
      await expect(card).toHaveCSS("text-align", "end");
      await expect(card.locator(".v-card-actions")).toHaveCSS("justify-content", "flex-end");
      await expectAlignedTo(card, "end");
    });

    test("keeps a nested section aligned to the start inside a centered one", async ({ page }) => {
      const outer = page.getByTestId("section-align-outer");
      const inner = page.getByTestId("section-align-inner");
      await expect(outer).toHaveCSS("text-align", "center");
      await expect(inner).toHaveCSS("text-align", "start");

      const outerTitle = await getTextGaps(outer, outer.locator(".v-card-title").first());
      expect(Math.abs(outerTitle.start - outerTitle.end)).toBeLessThanOrEqual(2);

      const innerTitle = await getTextGaps(inner, inner.locator(".v-card-title"));
      const innerContent = await getTextGaps(inner, inner.locator(".v-card-text"));
      expect(innerTitle.start).toBeLessThan(innerTitle.end);
      expect(innerContent.start).toBeLessThan(innerContent.end);
      expect(innerTitle.start).toBeLessThanOrEqual(24);
      expect(innerContent.start).toBeLessThanOrEqual(24);
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

// How much of its parent's content box (without the padding) the card takes in a dimension
function getFillRatio(card: Locator, dimension: "width" | "height") {
  return card.evaluate((element, dimension) => {
    const parent = element.parentElement as HTMLElement;
    const style = getComputedStyle(parent);
    const [client, paddingStart, paddingEnd] =
      dimension === "width"
        ? [parent.clientWidth, style.paddingLeft, style.paddingRight]
        : [parent.clientHeight, style.paddingTop, style.paddingBottom];

    const available = client - parseFloat(paddingStart) - parseFloat(paddingEnd);
    return element.getBoundingClientRect()[dimension] / available;
  }, dimension);
}

type Gaps = { start: number; end: number };

async function getBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("Element is not visible");
  return box;
}

/** Gaps between the card's edges and the rendered text of `element`. */
async function getTextGaps(card: Locator, element: Locator): Promise<Gaps> {
  const cardBox = await getBox(card);
  const textBox = await element.evaluate((node) => {
    const range = document.createRange();
    range.selectNodeContents(node);
    const { left, right } = range.getBoundingClientRect();
    return { left, right };
  });
  return {
    start: textBox.left - cardBox.x,
    end: cardBox.x + cardBox.width - textBox.right,
  };
}

/** Gaps between the card's edges and its group of action buttons. */
async function getActionsGaps(card: Locator): Promise<Gaps> {
  const cardBox = await getBox(card);
  const buttons = card.locator(".v-card-actions .v-btn");
  const first = await getBox(buttons.first());
  const last = await getBox(buttons.last());
  return {
    start: first.x - cardBox.x,
    end: cardBox.x + cardBox.width - (last.x + last.width),
  };
}

function getAlignedParts(card: Locator) {
  return [
    card.locator(".v-card-title"),
    card.locator(".v-card-subtitle"),
    card.locator(".v-card-text").first(),
  ];
}

async function expectCentered(card: Locator) {
  for (const part of getAlignedParts(card)) {
    const gaps = await getTextGaps(card, part);
    expect(Math.abs(gaps.start - gaps.end)).toBeLessThanOrEqual(2);
  }
  const actions = await getActionsGaps(card);
  expect(Math.abs(actions.start - actions.end)).toBeLessThanOrEqual(2);
}

/**
 * Expects the text next to `side` and, since the actions stay at the end in
 * both cases, the actions next to the end.
 */
async function expectAlignedTo(card: Locator, side: "start" | "end") {
  const other = side === "start" ? "end" : "start";
  for (const part of getAlignedParts(card)) {
    const gaps = await getTextGaps(card, part);
    expect(gaps[side]).toBeLessThan(gaps[other]);
    expect(gaps[side]).toBeLessThanOrEqual(24);
  }
  const actions = await getActionsGaps(card);
  expect(actions.end).toBeLessThan(actions.start);
  expect(actions.end).toBeLessThanOrEqual(24);
}
