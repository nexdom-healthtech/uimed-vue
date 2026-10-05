import { expect, type Locator, type Page } from "@playwright/test";

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
 * Expects `count` skeletons, each announcing the loading with valid ARIA
 * attributes. The docs demos are rendered on the server and hydration doesn't
 * touch these attributes, so this checks the served HTML.
 */
export async function expectLoadingAnnouncement(skeletons: Locator, count: number) {
  await expect(skeletons).toHaveCount(count);

  for (const skeleton of await skeletons.all()) {
    await expect(skeleton).toHaveAttribute("aria-label", "Carregando...");
    await expect(skeleton).toHaveAttribute("aria-live", "polite");
    await expect(skeleton).not.toHaveAttribute("arialabel");
    await expect(skeleton).not.toHaveAttribute("arialive");
  }
}
