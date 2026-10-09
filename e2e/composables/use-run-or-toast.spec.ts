import { expectNoA11yViolations, gotoPage, pauseClock } from "@e2e/utils.ts";
import { test, expect, type Page } from "@playwright/test";

const testId = "btn-danger";
const message = "Ops! Algo deu errado.";

test.describe("use-run-or-toast", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: new Date() });
    await gotoPage(page, "guide/composables/use-run-or-toast");
  });

  test.describe("use", () => {
    test(`shows a danger toast when danger button is clicked`, async ({ page }) => {
      const toastButton = page.getByTestId(testId);
      await expect(toastButton.locator(".v-btn__loader")).not.toBeAttached();

      await toastButton.click();
      await expect(toastButton.locator(".v-btn__loader")).toBeAttached();

      await page.clock.fastForward(1500);

      const toasts = getOverlayContainer(page);
      await expect(toasts).toBeVisible();
      await expect(toasts).toContainText(message);
    });
  });

  test.describe("accessibility", () => {
    test("has no violations with the toast open", async ({ page }) => {
      await page.getByTestId(testId).click();
      await page.clock.fastForward(1500);
      await expect(getOverlayContainer(page)).toContainText(message);

      await expectNoA11yViolations(page);
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshots", async ({ page }) => {
      const toastButton = page.getByTestId(testId);
      await toastButton.click();

      await pauseClock(page);

      await expect(toastButton).toMatchAriaSnapshot();
      await expect(page).toHaveScreenshot();

      await page.clock.runFor(1500);

      const toastsContainer = getOverlayContainer(page);

      await expect(toastsContainer).toMatchAriaSnapshot();
      await expect(page).toHaveScreenshot();
    });
  });
});

function getOverlayContainer(page: Page) {
  const container = page.locator(".v-overlay-container");
  return container;
}
