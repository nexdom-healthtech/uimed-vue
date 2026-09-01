import { test, expect, type Page } from "@playwright/test";
import { gotoPage } from "@e2e/utils.ts";

test.describe("frm", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/frm");
  });

  test.describe("events demo", () => {
    test("prevents submission of empty required fields", async ({ page }) => {
      const { counterText, submitButton, firstNameField, lastNameField } =
        locateDemoSubmitElements(page);

      await expect(counterText).toContainText("0 envio(s)");

      await submitButton.click();

      await expect(counterText).toContainText("0 envio(s)");
      await expect(firstNameField).toContainText("Campo obrigatório");
      await expect(lastNameField).toContainText("Campo obrigatório");
    });

    test("increments the submit counter", async ({ page }) => {
      const { counterText, submitButton, firstNameField, lastNameField } =
        locateDemoSubmitElements(page);

      await expect(counterText).toContainText("0 envio(s)");

      await firstNameField.locator("input").fill("Took");
      await lastNameField.locator("input").fill("Peregrin");

      await submitButton.click();

      await expect(counterText).toContainText("1 envio(s)");
    });

    test("matches the accessible snapshot of the submit demo", async ({ page }) => {
      const demo = page.getByTestId("demo-submit-event");

      await expect(demo).toMatchAriaSnapshot();
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

function locateDemoSubmitElements(page: Page) {
  const counterText = page.getByTestId("btn-demo-submit-count");
  const submitButton = page.getByTestId("btn-demo-submit");
  const firstNameField = page.getByTestId("first-name-field-demo-submit");
  const lastNameField = page.getByTestId("last-name-field-demo-submit");

  return { counterText, submitButton, firstNameField, lastNameField };
}
