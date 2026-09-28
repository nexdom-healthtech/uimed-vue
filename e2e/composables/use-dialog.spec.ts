import { gotoPage } from "@e2e/utils.ts";
import { test, expect, type Page } from "@playwright/test";

test.describe("use-dialog", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/composables/use-dialog");
  });

  test.describe("simple dialog", () => {
    test("opens with its title and message, focused on the close action", async ({ page }) => {
      await page.getByTestId("btn-simple").click();

      const dialog = getDialog(page);
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAccessibleName("Cadastro enviado");
      await expect(dialog).toHaveAccessibleDescription("Seu cadastro foi enviado para análise.");
      await expect(dialog.getByRole("button", { name: "Fechar" })).toBeFocused();
    });

    test("stays open after the click that opened it", async ({ page }) => {
      await page.getByTestId("btn-simple").click();

      const dialog = getDialog(page);
      await expect(dialog.getByRole("button", { name: "Fechar" })).toBeFocused();
      await expect(dialog).toBeVisible();
    });

    test("closes on the close action and returns the focus", async ({ page }) => {
      const opener = page.getByTestId("btn-simple");
      await opener.click();

      const dialog = getDialog(page);
      await dialog.getByRole("button", { name: "Fechar" }).click();

      await expect(dialog).toBeHidden();
      await expect(opener).toBeFocused();
    });

    test("keeps the focus inside the dialog", async ({ page }) => {
      await page.getByTestId("btn-simple").click();

      const close = getDialog(page).getByRole("button", { name: "Fechar" });
      await expect(close).toBeFocused();

      await page.keyboard.press("Tab");
      await expect(close).toBeFocused();
    });
  });

  test.describe("custom actions", () => {
    test("displays the actions in order and resolves the clicked one", async ({ page }) => {
      const answer = page.getByTestId("dialog-answer");
      await expect(answer).toHaveText("Resposta: nenhuma");

      await page.getByTestId("btn-actions").click();

      const dialog = getDialog(page);
      await expect(dialog.getByRole("button")).toHaveText(["Sair", "Continuar conectado"]);
      await expect(dialog.getByRole("button", { name: "Sair" })).toBeFocused();

      await dialog.getByRole("button", { name: "Continuar conectado" }).click();
      await expect(dialog).toBeHidden();
      await expect(answer).toHaveText("Resposta: continuar");

      await page.getByTestId("btn-actions").click();
      await dialog.getByRole("button", { name: "Sair" }).click();
      await expect(dialog).toBeHidden();
      await expect(answer).toHaveText("Resposta: sair");
    });
  });

  test.describe("dismissal", () => {
    test("closes on Esc and resolves undefined", async ({ page }) => {
      await answerContinue(page);

      await page.getByTestId("btn-actions").click();
      const dialog = getDialog(page);
      await expect(dialog.getByRole("button", { name: "Sair" })).toBeFocused();

      await page.keyboard.press("Escape");

      await expect(dialog).toBeHidden();
      await expect(page.getByTestId("dialog-answer")).toHaveText("Resposta: nenhuma");
    });

    test("closes on a click outside it and resolves undefined", async ({ page }) => {
      await answerContinue(page);

      await page.getByTestId("btn-actions").click();
      const dialog = getDialog(page);
      await expect(dialog.getByRole("button", { name: "Sair" })).toBeFocused();

      await page.mouse.click(5, 5);

      await expect(dialog).toBeHidden();
      await expect(page.getByTestId("dialog-answer")).toHaveText("Resposta: nenhuma");
    });
  });

  test.describe("queue", () => {
    test("displays consecutive dialogs one at a time, in order", async ({ page }) => {
      await page.getByTestId("btn-queue").click();

      const dialog = getDialog(page);
      await expect(dialog).toHaveCount(1);
      await expect(dialog).toHaveAccessibleName("Primeiro diálogo");

      await dialog.getByRole("button", { name: "Fechar" }).click();
      await expect(dialog).toHaveAccessibleName("Segundo diálogo");
      await expect(dialog.getByRole("button", { name: "Fechar" })).toBeFocused();

      await dialog.getByRole("button", { name: "Fechar" }).click();
      await expect(dialog).toBeHidden();
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshots", async ({ page }) => {
      const dialog = getDialog(page);

      for (const testId of ["btn-simple", "btn-actions"]) {
        await page.getByTestId(testId).click();
        await expect(dialog.getByRole("button").first()).toBeFocused();

        await expect(dialog).toMatchAriaSnapshot();
        await expect(page).toHaveScreenshot();

        await page.keyboard.press("Escape");
        await expect(dialog).toBeHidden();
      }
    });
  });
});

function getDialog(page: Page) {
  return page.getByRole("dialog");
}

async function answerContinue(page: Page) {
  await page.getByTestId("btn-actions").click();
  await getDialog(page).getByRole("button", { name: "Continuar conectado" }).click();
  await expect(page.getByTestId("dialog-answer")).toHaveText("Resposta: continuar");
}
