import { gotoPage } from "@e2e/utils.ts";
import { test, expect, type Page } from "@playwright/test";

const buttons = [
  { type: "positive", testId: "btn-positive", message: "Mensagem positiva." },
  { type: "informative", testId: "btn-informative", message: "Mensagem informativa." },
  { type: "caution", testId: "btn-caution", message: "Mensagem de atenção." },
  { type: "danger", testId: "btn-danger", message: "Mensagem de perigo." },
];

test.describe("use-toast", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: new Date() });
    await gotoPage(page, "guide/composables/use-toast");
  });

  test.describe("use", () => {
    buttons.forEach(({ type, testId, message }) => {
      test(`shows a ${type} toast when ${type} button is clicked`, async ({ page }) => {
        const toastButton = page.getByTestId(testId);
        await toastButton.click();

        const toasts = getOverlayContainer(page);
        await expect(toasts).toBeVisible();
        await expect(toasts).toContainText(message);
      });
    });
  });

  test.describe("accessibility", () => {
    // Holds the toasts' timeout, so they don't close while the assertions run. Each step runs the
    // clock just enough to finish the toasts' transitions. It pauses a second ahead of the page's
    // clock, since pausing at the test runner's time fails when the page's clock is already past it
    test.beforeEach(async ({ page }) => {
      const now = await page.evaluate(() => Date.now());
      await page.clock.pauseAt(now + 1000);
    });

    test("hides the timer bars of queued toasts and keeps their messages announced", async ({
      page,
    }) => {
      const toasts = getOverlayContainer(page);

      for (const [index, { testId }] of buttons.entries()) {
        await page.getByTestId(testId).click();
        await page.clock.runFor(500);

        // Up to 3 toasts stay visible, and each new one replaces the oldest
        const visibleToasts = buttons.slice(Math.max(0, index - 2), index + 1);
        await expectDecorativeTimerBars(page, visibleToasts.length);

        for (const { message } of visibleToasts) {
          await expect(toasts.getByRole("status").filter({ hasText: message })).toHaveText(message);
        }
      }
    });

    test("hides the timer bar recreated when the pointer leaves the toast", async ({ page }) => {
      await page.getByTestId("btn-positive").click();
      await page.clock.runFor(500);
      await expectDecorativeTimerBars(page, 1);

      const overlay = await getOverlay(page);
      await overlay.hover();
      await expect(getTimerBars(page)).toHaveCount(0);

      await page.mouse.move(0, 0);
      await page.clock.runFor(500);
      await expectDecorativeTimerBars(page, 1);
      await expect(getOverlayContainer(page).getByRole("status")).toHaveText("Mensagem positiva.");
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshots", async ({ page }) => {
      for (const { testId } of buttons) {
        const toastButton = page.getByTestId(testId);
        await toastButton.click();

        const overlay = await getOverlay(page);
        await overlay.hover();

        const toastsContainer = getOverlayContainer(page);

        await expect(toastsContainer).toMatchAriaSnapshot();
        await expect(page).toHaveScreenshot();
      }
    });
  });
});

async function getOverlay(page: Page) {
  const containers = page.locator(".v-overlay [role='status']");
  const container = containers.last();
  await container.waitFor({ state: "visible" });

  return container;
}

function getTimerBars(page: Page) {
  return getOverlayContainer(page).locator(
    ".v-snackbar--active .v-snackbar__timer [role='progressbar']",
  );
}

async function expectDecorativeTimerBars(page: Page, count: number) {
  const timerBars = getTimerBars(page);
  await expect(timerBars).toHaveCount(count);

  for (const timerBar of await timerBars.all()) {
    await expect(timerBar).toBeVisible();
    await expect(timerBar).toHaveAttribute("aria-hidden", "true");
  }

  const toasts = getOverlayContainer(page);
  await expect(toasts.getByRole("progressbar")).toHaveCount(0);
}

function getOverlayContainer(page: Page) {
  const container = page.locator(".v-overlay-container");
  return container;
}
