import { test, expect, type Page } from "@playwright/test";
import { gotoPage } from "@e2e/utils.ts";

const submitDuration = 1500;

test.describe("form", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: new Date() });
    await gotoPage(page, "guide/components/form");
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

  test.describe("loading submit demo", () => {
    test("ignores new submissions while submitting", async ({ page }) => {
      const { counterText, submitButton, firstNameField, lastNameField } =
        locateDemoLoadingSubmitElements(page);
      const loader = submitButton.locator(".v-btn__loader");
      const lastNameInput = lastNameField.locator("input");

      await expect(counterText).toContainText("Pessoa - 0 envio(s)");

      await firstNameField.locator("input").fill("Took");
      await lastNameInput.fill("Peregrin");

      await pauseClock(page);
      await lastNameInput.press("Enter");

      await expect(loader).toBeAttached();
      await expect(submitButton).toBeDisabled();
      await expect(counterText).toContainText("Pessoa - 1 envio(s)");

      await lastNameInput.press("Enter");
      await lastNameInput.press("Enter");
      await lastNameInput.press("Enter");

      await expect(counterText).toContainText("Pessoa - 1 envio(s)");
      await expect(lastNameInput).toBeFocused();

      await page.clock.fastForward(submitDuration);

      await expect(loader).not.toBeAttached();
      await expect(submitButton).toBeEnabled();

      await lastNameInput.press("Enter");
      await expect(counterText).toContainText("Pessoa - 2 envio(s)");
    });

    test("matches the accessible snapshot of the loading submit demo while submitting", async ({
      page,
    }) => {
      const { submitButton, firstNameField, lastNameField } = locateDemoLoadingSubmitElements(page);
      const lastNameInput = lastNameField.locator("input");

      await firstNameField.locator("input").fill("Took");
      await lastNameInput.fill("Peregrin");

      await pauseClock(page);
      await lastNameInput.press("Enter");
      await expect(submitButton.locator(".v-btn__loader")).toBeAttached();

      const demo = page.getByTestId("demo-loading-submit");
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
  const counterText = page.getByTestId("frm-demo-submit-count");
  const submitButton = page.getByTestId("frm-demo-submit");
  const firstNameField = page.getByTestId("first-name-field-demo-submit");
  const lastNameField = page.getByTestId("last-name-field-demo-submit");

  return { counterText, submitButton, firstNameField, lastNameField };
}

function locateDemoLoadingSubmitElements(page: Page) {
  const counterText = page.getByTestId("frm-demo-loading-submit-count");
  const submitButton = page.getByTestId("frm-demo-loading-submit");
  const firstNameField = page.getByTestId("first-name-field-demo-loading-submit");
  const lastNameField = page.getByTestId("last-name-field-demo-loading-submit");

  return { counterText, submitButton, firstNameField, lastNameField };
}

/** Keeps the demo submission running until the test fast-forwards the clock. */
async function pauseClock(page: Page) {
  await page.clock.pauseAt(new Date(Date.now() + 1000));
}
