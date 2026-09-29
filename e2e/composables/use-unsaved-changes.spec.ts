import { gotoPage } from "@e2e/utils.ts";
import { test, expect, type Page } from "@playwright/test";

test.describe("use-unsaved-changes", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/composables/use-unsaved-changes");
    await expect(getForm(page)).toBeVisible();
  });

  test.describe("without changes", () => {
    test("leaves without asking", async ({ page }) => {
      await expect(page.getByTestId("has-changes")).toHaveText("Alterações não salvas: não");

      await page.getByRole("button", { name: "Ir para a lista", exact: true }).click();

      await expect(getList(page)).toBeVisible();
      await expect(getDialog(page)).toHaveCount(0);
    });
  });

  test.describe("with changes", () => {
    test.beforeEach(async ({ page }) => {
      await getNameField(page).fill("Joana Souza");
      await expect(page.getByTestId("has-changes")).toHaveText("Alterações não salvas: sim");
    });

    test("asks before leaving, focused on the cancel action", async ({ page }) => {
      await page.getByRole("button", { name: "Ir para a lista", exact: true }).click();

      const dialog = getDialog(page);
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAccessibleName("Alterações não salvas");
      await expect(dialog).toHaveAccessibleDescription(
        "Existem alterações que ainda não foram salvas. Deseja sair sem salvar?",
      );
      await expect(dialog.getByRole("button")).toHaveText([
        "Continuar editando",
        "Sair sem salvar",
      ]);
      await expect(dialog.getByRole("button", { name: "Continuar editando" })).toBeFocused();
      await expect(getForm(page)).toBeVisible();
    });

    test("leaves without saving when confirmed", async ({ page }) => {
      await page.getByRole("button", { name: "Ir para a lista", exact: true }).click();
      await getDialog(page).getByRole("button", { name: "Sair sem salvar" }).click();

      await expect(getDialog(page)).toBeHidden();
      await expect(getList(page)).toBeVisible();
      await expect(getForm(page)).toHaveCount(0);

      await page.getByRole("button", { name: "Voltar ao cadastro" }).click();

      await expect(getNameField(page)).toHaveValue("Maria Silva");
      await expect(page.getByTestId("has-changes")).toHaveText("Alterações não salvas: não");
    });

    test("stays with the changes when cancelled", async ({ page }) => {
      const opener = page.getByRole("button", { name: "Ir para a lista", exact: true });
      await opener.click();
      await getDialog(page).getByRole("button", { name: "Continuar editando" }).click();

      await expectToStay(page);
      await expect(opener).toBeFocused();
    });

    test("stays with the changes when closed by Esc", async ({ page }) => {
      await page.getByRole("button", { name: "Ir para a lista", exact: true }).click();
      const dialog = getDialog(page);
      await expect(dialog.getByRole("button", { name: "Continuar editando" })).toBeFocused();

      await page.keyboard.press("Escape");

      await expectToStay(page);
    });

    test("stays with the changes when closed by a click outside it", async ({ page }) => {
      await page.getByRole("button", { name: "Ir para a lista", exact: true }).click();
      const dialog = getDialog(page);
      await expect(dialog.getByRole("button", { name: "Continuar editando" })).toBeFocused();

      await page.mouse.click(5, 5);

      await expectToStay(page);
    });

    test("asks again after the user stays", async ({ page }) => {
      const opener = page.getByRole("button", { name: "Ir para a lista", exact: true });
      await opener.click();
      await getDialog(page).getByRole("button", { name: "Continuar editando" }).click();
      await expectToStay(page);

      await opener.click();
      await getDialog(page).getByRole("button", { name: "Sair sem salvar" }).click();

      await expect(getList(page)).toBeVisible();
    });

    test("shares the answer with a navigation made while the dialog is open", async ({ page }) => {
      const opener = page.getByRole("button", { name: "Ir para a lista", exact: true });
      await opener.click();
      const dialog = getDialog(page);
      await expect(dialog.getByRole("button", { name: "Continuar editando" })).toBeFocused();

      // The dialog blocks clicks outside it, so the second navigation is dispatched from the page
      await opener.evaluate((button: HTMLElement) => button.click());

      await expect(dialog).toHaveCount(1);
      await dialog.getByRole("button", { name: "Sair sem salvar" }).click();

      await expect(getDialog(page)).toBeHidden();
      await expect(getList(page)).toBeVisible();
    });

    test("leaves without asking after saving", async ({ page }) => {
      await page.getByRole("button", { name: "Salvar", exact: true }).click();
      await expect(page.getByTestId("has-changes")).toHaveText("Alterações não salvas: não");

      await page.getByRole("button", { name: "Ir para a lista", exact: true }).click();

      await expect(getList(page)).toBeVisible();
      await expect(getDialog(page)).toHaveCount(0);
    });

    test("leaves without asking right after saving", async ({ page }) => {
      await page.getByRole("button", { name: "Salvar e ir para a lista" }).click();

      await expect(getList(page)).toBeVisible();
      await expect(getDialog(page)).toHaveCount(0);

      await page.getByRole("button", { name: "Voltar ao cadastro" }).click();

      await expect(getNameField(page)).toHaveValue("Joana Souza");
      await expect(page.getByTestId("has-changes")).toHaveText("Alterações não salvas: não");
    });

    test("asks for the browser's confirmation before unloading the page", async ({ page }) => {
      const dialog = page.waitForEvent("dialog");

      await page.close({ runBeforeUnload: true });

      const beforeUnload = await dialog;
      expect(beforeUnload.type()).toBe("beforeunload");
      await beforeUnload.dismiss();
      expect(page.isClosed()).toBe(false);
    });

    test("unloads the page without asking after saving", async ({ page }) => {
      let asked = false;
      page.on("dialog", (dialog) => {
        asked = true;
        void dialog.accept();
      });
      await page.getByRole("button", { name: "Salvar", exact: true }).click();
      await expect(page.getByTestId("has-changes")).toHaveText("Alterações não salvas: não");

      await page.close({ runBeforeUnload: true });
      await page.waitForEvent("close");

      expect(asked).toBe(false);
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshots", async ({ page }) => {
      await getNameField(page).fill("Joana Souza");
      await expect(getForm(page)).toMatchAriaSnapshot();
      await expect(getForm(page)).toHaveScreenshot();

      await page.getByRole("button", { name: "Ir para a lista", exact: true }).click();
      const dialog = getDialog(page);
      await expect(dialog.getByRole("button", { name: "Continuar editando" })).toBeFocused();

      await expect(dialog).toMatchAriaSnapshot();
      await expect(page).toHaveScreenshot();
    });
  });
});

function getDialog(page: Page) {
  return page.getByRole("alertdialog");
}

function getForm(page: Page) {
  return page.getByTestId("patient-form");
}

function getList(page: Page) {
  return page.getByTestId("patient-list");
}

function getNameField(page: Page) {
  return page.getByTestId("name-field").locator("input");
}

async function expectToStay(page: Page) {
  await expect(getDialog(page)).toBeHidden();
  await expect(getForm(page)).toBeVisible();
  await expect(getList(page)).toHaveCount(0);
  await expect(getNameField(page)).toHaveValue("Joana Souza");
  await expect(page.getByTestId("has-changes")).toHaveText("Alterações não salvas: sim");
}
