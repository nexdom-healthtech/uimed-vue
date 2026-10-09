import { AxeBuilder } from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

export async function gotoPage(page: Page, url: string) {
  await page.goto(url);
  await page.locator("h1").waitFor({ state: "visible" });
}

export async function selectOption(page: Page, testId: string, option: string) {
  await page.getByTestId(testId).locator("input:visible").click({ force: true });
  await page.getByRole("option", { name: option, exact: true }).click();
}

/**
 * Pauses the page clock slightly ahead of the page's own time. The page clock can run ahead of the
 * test runner's, so pausing at the runner's time (e.g. `new Date()`) may fail with "Cannot
 * fast-forward to the past". Timers due within the margin still run before the pause.
 */
export async function pauseClock(page: Page, marginMs = 1000) {
  const pageNow = await page.evaluate(() => Date.now());
  await page.clock.pauseAt(new Date(pageNow + marginMs));
}

/**
 * Waits for the page's animations to finish, except the ones that never end (e.g. loading
 * indicators). Vuetify animates overlays with both CSS transitions and the Web Animations API.
 */
async function waitForAnimations(page: Page) {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => undefined)),
    ),
  );
}

/**
 * Checks the page's demos and overlays (e.g. toasts and dialogs, which render outside the demos)
 * against WCAG 2.2 AA and axe's best practices, failing on any violation. The docs' own content is
 * left out, since it isn't part of the library.
 */
export async function expectNoA11yViolations(page: Page) {
  // Elements still fading in or out would be measured with partial contrast
  await waitForAnimations(page);

  // Axe can't tell the background of text covered by another element, and skips its contrast. So
  // it'd skip every button and field, whose text sits under Vuetify's decorative layers: the
  // overlay and underlay that tint them on hover, focus and press, and the fields' outline. During
  // the check, the tints are hidden and the outline goes behind the field, since it holds the
  // field's label, which hiding would take from the field's accessible name
  const decorativeLayers = await page.addStyleTag({
    content: `
      [class$="__overlay"], [class*="__overlay "], [class$="__underlay"], [class*="__underlay "] {
        display: none !important;
      }
      .v-field__outline { z-index: -1 !important; }
    `,
  });

  const { violations } = await new AxeBuilder({ page })
    .include(".demo")
    .include(".playground")
    .include(".v-overlay-container")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
    // The docs show several demos per page, inside their own `main` landmark, so these rules fail
    // on the page's layout: e.g. each `UMain` demo adds a `main` inside the docs' one, and each
    // `UDataSet` demo adds a pagination landmark with the same name
    .disableRules(["landmark-main-is-top-level", "landmark-no-duplicate-main", "landmark-unique"])
    .analyze();

  await decorativeLayers.evaluate((element) => element.parentNode?.removeChild(element));

  expect(violations).toEqual([]);
}
