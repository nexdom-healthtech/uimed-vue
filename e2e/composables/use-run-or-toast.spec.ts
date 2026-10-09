import { gotoPage, pauseClock } from "@e2e/utils.ts";
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

    test("hides the toast timer bar and keeps its message announced", async ({ page }) => {
      // Holds the toast's timeout, so it doesn't close while the assertions run. It pauses a second
      // ahead of the page's clock, since pausing at the test runner's time fails when the page's
      // clock is already past it
      const now = await page.evaluate(() => Date.now());
      await page.clock.pauseAt(now + 1000);

      await page.getByTestId(testId).click();
      await page.clock.runFor(1500);

      const toasts = getOverlayContainer(page);
      const timerBar = toasts.locator(".v-snackbar__timer [role='progressbar']");
      await expect(timerBar).toBeVisible();
      await expect(timerBar).toHaveAttribute("aria-hidden", "true");
      await expect(toasts.getByRole("progressbar")).toHaveCount(0);
      await expect(toasts.getByRole("status")).toHaveText(message);
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
