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

function getOverlayContainer(page: Page) {
  const container = page.locator(".v-overlay-container");
  return container;
}
