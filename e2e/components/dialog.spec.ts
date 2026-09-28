import { gotoPage, selectOption } from "@e2e/utils.ts";
import { test, expect, type Page } from "@playwright/test";

const actionDuration = 1500;

test.describe("dialog", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: new Date() });
    await gotoPage(page, "guide/components/dialog");
  });

  test.describe("usage", () => {
    test("opens labelled by its title, focused on the first action", async ({ page }) => {
      await page.getByTestId("btn-basic").click();

      const dialog = getDialog(page);
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAccessibleName("Consulta agendada");
      await expect(dialog).toHaveAccessibleDescription("");
      await expect(dialog).toContainText("A consulta de Maria da Silva foi agendada");
      await expect(dialog.getByRole("button")).toHaveText(["Fechar"]);
      await expect(dialog.getByRole("button", { name: "Fechar" })).toBeFocused();
    });

    test("closes by its action and returns the focus to the opener", async ({ page }) => {
      const opener = page.getByTestId("btn-basic");
      await opener.click();

      const dialog = getDialog(page);
      await dialog.getByRole("button", { name: "Fechar" }).click();

      await expect(dialog).toBeHidden();
      await expect(opener).toBeFocused();
    });

    test("closes by Esc and returns the focus to the opener", async ({ page }) => {
      const opener = page.getByTestId("btn-basic");
      await opener.click();

      const dialog = getDialog(page);
      await expect(dialog.getByRole("button", { name: "Fechar" })).toBeFocused();
      await page.keyboard.press("Escape");

      await expect(dialog).toBeHidden();
      await expect(opener).toBeFocused();
    });

    test("returns the focus to the opener after a click on its text", async ({ page }) => {
      const opener = page.getByTestId("btn-basic");
      await opener.click();

      const dialog = getDialog(page);
      await expect(dialog.getByRole("button", { name: "Fechar" })).toBeFocused();
      await dialog.getByText("A consulta de Maria da Silva").click();
      await expect(dialog.getByRole("button", { name: "Fechar" })).not.toBeFocused();
      await page.keyboard.press("Escape");

      await expect(dialog).toBeHidden();
      await expect(opener).toBeFocused();
    });

    test("closes by a click outside it", async ({ page }) => {
      await page.getByTestId("btn-basic").click();

      const dialog = getDialog(page);
      await expect(dialog.getByRole("button", { name: "Fechar" })).toBeFocused();
      await page.mouse.click(5, 5);

      await expect(dialog).toBeHidden();
    });
  });

  test.describe("forms", () => {
    test("focuses the first field and keeps the focus inside the dialog", async ({ page }) => {
      await page.getByTestId("btn-form").click();

      const dialog = getDialog(page);
      const field = dialog.getByRole("textbox", { name: "Nome" });
      await expect(field).toBeFocused();

      await page.keyboard.press("Tab");
      await expect(dialog.getByRole("button", { name: "Cancelar" })).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(dialog.getByRole("button", { name: "Salvar" })).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(field).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await expect(dialog.getByRole("button", { name: "Salvar" })).toBeFocused();
    });

    test("submits the form by an action, blocking the dialog while saving", async ({ page }) => {
      const opener = page.getByTestId("btn-form");
      await opener.click();

      const dialog = getDialog(page);
      const field = dialog.getByRole("textbox", { name: "Nome" });
      const cancel = dialog.getByRole("button", { name: "Cancelar" });
      const save = dialog.getByRole("button", { name: "Salvar" });
      await expect(field).toHaveValue("Maria da Silva");
      await field.fill("João Pereira");
      await pauseClock(page);
      await save.click();

      await expect(save.locator(".v-btn__loader")).toBeAttached();
      await expect(cancel).toBeDisabled();
      await page.keyboard.press("Escape");
      await page.mouse.click(5, 5);
      await expect(dialog).toBeVisible();

      await page.clock.fastForward(actionDuration);
      await page.clock.resume();

      await expect(dialog).toBeHidden();
      await expect(page.getByTestId("form-result")).toHaveText("Nome: João Pereira");
      await expect(opener).toBeFocused();
    });

    test("doesn't submit the form while a field is invalid", async ({ page }) => {
      await page.getByTestId("btn-form").click();

      const dialog = getDialog(page);
      await dialog.getByRole("textbox", { name: "Nome" }).fill("");
      await dialog.getByRole("button", { name: "Salvar" }).click();

      await expect(dialog.getByRole("alert")).toBeVisible();
      await expect(dialog.getByRole("button", { name: "Cancelar" })).toBeEnabled();
      await expect(dialog).toBeVisible();
      await expect(page.getByTestId("form-result")).toHaveText("Nome: Maria da Silva");
    });

    test("discards the changes once cancelled, after the dialog leaves", async ({ page }) => {
      const opener = page.getByTestId("btn-form");
      await opener.click();

      const dialog = getDialog(page);
      await dialog.getByRole("textbox", { name: "Nome" }).fill("João Pereira");
      await dialog.getByRole("button", { name: "Cancelar" }).click();
      await expect(dialog).toBeHidden();

      await opener.click();
      await expect(dialog.getByRole("textbox", { name: "Nome" })).toHaveValue("Maria da Silva");
      await expect(page.getByTestId("form-result")).toHaveText("Nome: Maria da Silva");
    });
  });

  test.describe("persistent", () => {
    test("doesn't close by Esc or a click outside it, only by its action", async ({ page }) => {
      await page.getByTestId("btn-persistent").click();

      const dialog = getDialog(page);
      const accept = dialog.getByRole("button", { name: "Aceitar" });
      await expect(accept).toBeFocused();

      await page.keyboard.press("Escape");
      await page.mouse.click(5, 5);
      await expect(dialog).toBeVisible();

      await accept.click();
      await expect(dialog).toBeHidden();
    });
  });

  test.describe("sizes", () => {
    for (const [size, width] of [
      ["small", 400],
      ["medium", 560],
      ["large", 800],
    ] as const) {
      test(`limits the ${size} dialog to ${width}px`, async ({ page }) => {
        await page.getByTestId(`btn-size-${size}`).click();

        const dialog = getDialog(page);
        await expect(dialog).toHaveAccessibleName(`Tamanho ${size}`);
        // The focus moves into the dialog once it finishes entering, which scales it
        await expect(dialog.getByRole("button", { name: "Fechar" })).toBeFocused();
        const box = await dialog.locator(".v-card").boundingBox();
        expect(box?.width).toBe(width);
      });
    }
  });

  test.describe("long content", () => {
    test("scrolls only the content, keeping the title and actions visible", async ({ page }) => {
      await page.getByTestId("btn-long").click();

      const dialog = getDialog(page);
      const title = dialog.getByText("Termos de uso");
      const accept = dialog.getByRole("button", { name: "Aceitar" });
      const lastParagraph = dialog.getByTestId("long-paragraph-20");
      await expect(title).toBeInViewport();
      await expect(accept).toBeInViewport();
      await expect(lastParagraph).not.toBeInViewport();

      await lastParagraph.scrollIntoViewIfNeeded();

      await expect(lastParagraph).toBeInViewport();
      await expect(title).toBeInViewport();
      await expect(accept).toBeInViewport();
    });
  });

  test.describe("confirmations from the dialog", () => {
    test("displays the confirmation over the dialog, handling Esc on top", async ({ page }) => {
      await page.getByTestId("btn-confirm").click();

      const dialog = getDialog(page);
      const remove = dialog.getByRole("button", { name: "Excluir" });
      await remove.click();

      const confirmation = page.getByRole("alertdialog");
      await expect(confirmation).toHaveAccessibleName("Excluir prontuário");
      await expect(confirmation.getByRole("button", { name: "Cancelar" })).toBeFocused();

      await page.keyboard.press("Escape");

      await expect(confirmation).toBeHidden();
      await expect(dialog).toBeVisible();
      await expect(remove).toBeFocused();
      await expect(page.getByTestId("confirm-result")).toHaveText("Prontuário: ativo");
    });

    test("closes the dialog once the confirmed action ends", async ({ page }) => {
      const opener = page.getByTestId("btn-confirm");
      await opener.click();

      const dialog = getDialog(page);
      await dialog.getByRole("button", { name: "Excluir" }).click();

      const confirmation = page.getByRole("alertdialog");
      await confirmation.getByRole("button", { name: "Excluir" }).click();
      await page.clock.fastForward(actionDuration);

      await expect(confirmation).toBeHidden();
      await expect(dialog).toBeHidden();
      await expect(page.getByTestId("confirm-result")).toHaveText("Prontuário: excluído");
      await expect(opener).toBeFocused();
    });
  });

  test.describe("playground", () => {
    test("updates the title and content", async ({ page }) => {
      await page.getByTestId("dialog-playground-title").locator("input").fill("Novo título");
      await page.getByTestId("dialog-playground-content").locator("input").fill("Novo conteúdo");
      await page.getByTestId("dialog-playground-open").click();

      const dialog = getDialog(page);
      await expect(dialog).toHaveAccessibleName("Novo título");
      await expect(dialog).toContainText("Novo conteúdo");
    });

    test("updates the size", async ({ page }) => {
      await selectOption(page, "dialog-playground-size", "large");
      await page.getByTestId("dialog-playground-open").click();

      const dialog = getDialog(page);
      await expect(dialog.getByRole("button", { name: "Cancelar" })).toBeFocused();
      const box = await dialog.locator(".v-card").boundingBox();
      expect(box?.width).toBe(800);
    });

    test("becomes persistent", async ({ page }) => {
      await page.getByTestId("dialog-playground-persistent").locator("input").click();
      await page.getByTestId("dialog-playground-open").click();

      const dialog = getDialog(page);
      await expect(dialog.getByRole("button", { name: "Cancelar" })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(dialog).toBeVisible();

      await dialog.getByRole("button", { name: "Confirmar" }).click();
      await expect(dialog).toBeHidden();
    });

    test("hides the actions", async ({ page }) => {
      await page.getByTestId("dialog-playground-actions").locator("input").click();
      const opener = page.getByTestId("dialog-playground-open");
      await opener.click();

      const dialog = getDialog(page);
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole("button")).toHaveCount(0);
      await expect(dialog.locator(".v-card-actions")).not.toBeAttached();

      // Without focusable elements, the dialog itself gets the focus, which still returns
      await expect(dialog.locator(".v-overlay__content")).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(opener).toBeFocused();
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshots", async ({ page }) => {
      await page.getByTestId("btn-basic").click();
      const dialog = getDialog(page);
      await expect(dialog.getByRole("button", { name: "Fechar" })).toBeFocused();
      await expect(dialog).toMatchAriaSnapshot();
      await expect(page).toHaveScreenshot();
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();

      await page.getByTestId("btn-form").click();
      await expect(dialog.getByRole("textbox", { name: "Nome" })).toBeFocused();
      await expect(dialog).toMatchAriaSnapshot();
      await expect(page).toHaveScreenshot();
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();

      await page.getByTestId("btn-long").click();
      await expect(dialog.getByRole("button", { name: "Aceitar" })).toBeInViewport();
      await expect(page).toHaveScreenshot();
    });
  });
});

function getDialog(page: Page) {
  return page.getByRole("dialog");
}

/** Keeps the demo actions running until the test fast-forwards the clock. */
async function pauseClock(page: Page) {
  await page.clock.pauseAt(new Date(Date.now() + 1000));
}
