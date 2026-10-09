import { expectNoA11yViolations, gotoPage, pauseClock } from "@e2e/utils.ts";
import { test, expect, type Page } from "@playwright/test";

const actionDuration = 1500;

test.describe("use-confirm", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: new Date() });
    await gotoPage(page, "guide/composables/use-confirm");
  });

  test.describe("confirmation", () => {
    test("opens as an alert dialog, focused on the cancel action", async ({ page }) => {
      await page.getByTestId("btn-confirm").click();

      const dialog = getDialog(page);
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAccessibleName("Salvar alterações");
      await expect(dialog).toHaveAccessibleDescription(
        "Deseja salvar as alterações feitas no cadastro?",
      );
      await expect(dialog.getByRole("button")).toHaveText(["Cancelar", "Confirmar"]);
      await expect(dialog.getByRole("button", { name: "Cancelar" })).toBeFocused();
    });

    test("blocks the dialog while the action runs, then resolves its value", async ({ page }) => {
      const opener = page.getByTestId("btn-confirm");
      await opener.click();

      const dialog = getDialog(page);
      const cancel = dialog.getByRole("button", { name: "Cancelar" });
      const confirm = dialog.getByRole("button", { name: "Confirmar" });
      await expect(cancel).toBeFocused();
      await pauseClock(page);
      await confirm.click();

      await expect(confirm.locator(".v-btn__loader")).toBeAttached();
      await expect(cancel).toBeDisabled();
      await expect(opener.locator(".v-btn__loader")).toBeAttached();

      await page.keyboard.press("Escape");
      await page.mouse.click(5, 5);
      await expect(dialog).toBeVisible();

      await page.clock.fastForward(actionDuration);
      await page.clock.resume();

      await expect(dialog).toBeHidden();
      await expect(opener.locator(".v-btn__loader")).not.toBeAttached();
      await expect(page.getByTestId("confirm-result")).toHaveText("Resultado: Alterações salvas");
      await expect(opener).toBeFocused();
    });

    test("resolves false without running the action when cancelled", async ({ page }) => {
      const opener = page.getByTestId("btn-confirm");
      await opener.click();

      const dialog = getDialog(page);
      await dialog.getByRole("button", { name: "Cancelar" }).click();

      await expect(dialog).toBeHidden();
      await expect(opener.locator(".v-btn__loader")).not.toBeAttached();
      await expect(page.getByTestId("confirm-result")).toHaveText("Resultado: false");
    });

    test("resolves false when closed by Esc", async ({ page }) => {
      await page.getByTestId("btn-confirm").click();

      const dialog = getDialog(page);
      await expect(dialog.getByRole("button", { name: "Cancelar" })).toBeFocused();
      await page.keyboard.press("Escape");

      await expect(dialog).toBeHidden();
      await expect(page.getByTestId("confirm-result")).toHaveText("Resultado: false");
    });

    test("opens again once closed by Esc", async ({ page }) => {
      const opener = page.getByTestId("btn-confirm");
      await opener.click();

      const dialog = getDialog(page);
      await expect(dialog.getByRole("button", { name: "Cancelar" })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(opener).toBeFocused();

      await page.getByTestId("btn-destructive").click();

      await expect(dialog).toHaveAccessibleName("Excluir paciente");
      await expect(dialog.getByRole("button", { name: "Manter" })).toBeFocused();
      await dialog.getByRole("button", { name: "Excluir" }).click();
      await page.clock.fastForward(actionDuration);
      await expect(dialog).toBeHidden();
      await expect(page.getByTestId("confirm-result")).toHaveText("Resultado: Paciente excluído");
    });

    test("resolves false when closed by a click outside it", async ({ page }) => {
      await page.getByTestId("btn-confirm").click();

      const dialog = getDialog(page);
      await expect(dialog.getByRole("button", { name: "Cancelar" })).toBeFocused();
      await page.mouse.click(5, 5);

      await expect(dialog).toBeHidden();
      await expect(page.getByTestId("confirm-result")).toHaveText("Resultado: false");
    });
  });

  test.describe("destructive action", () => {
    test("displays the custom texts and resolves the action value", async ({ page }) => {
      await page.getByTestId("btn-destructive").click();

      const dialog = getDialog(page);
      await expect(dialog).toHaveAccessibleName("Excluir paciente");
      await expect(dialog.getByRole("button")).toHaveText(["Manter", "Excluir"]);

      await dialog.getByRole("button", { name: "Excluir" }).click();
      await page.clock.fastForward(actionDuration);

      await expect(dialog).toBeHidden();
      await expect(page.getByTestId("confirm-result")).toHaveText("Resultado: Paciente excluído");
    });
  });

  test.describe("failing action", () => {
    test("closes the dialog, shows a danger toast and resolves false", async ({ page }) => {
      await page.getByTestId("btn-failure").click();

      const dialog = getDialog(page);
      await dialog.getByRole("button", { name: "Confirmar" }).click();
      await page.clock.fastForward(actionDuration);

      await expect(dialog).toBeHidden();
      await expect(page.getByRole("status")).toContainText("Não foi possível excluir o paciente.");
      await expect(page.getByTestId("confirm-result")).toHaveText("Resultado: false");
    });
  });

  test.describe("accessibility", () => {
    test("has no violations with the confirmation open", async ({ page }) => {
      await page.getByTestId("btn-destructive").click();
      await expect(getDialog(page).getByRole("button", { name: "Manter" })).toBeFocused();

      await expectNoA11yViolations(page);
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshots", async ({ page }) => {
      await page.getByTestId("btn-destructive").click();

      const dialog = getDialog(page);
      await expect(dialog.getByRole("button", { name: "Manter" })).toBeFocused();

      await expect(dialog).toMatchAriaSnapshot();
      await expect(page).toHaveScreenshot();

      await pauseClock(page);
      await dialog.getByRole("button", { name: "Excluir" }).click();
      await expect(dialog.getByRole("button", { name: "Manter" })).toBeDisabled();

      await expect(dialog).toMatchAriaSnapshot();
      await expect(page).toHaveScreenshot();
    });
  });
});

function getDialog(page: Page) {
  return page.getByRole("alertdialog");
}
