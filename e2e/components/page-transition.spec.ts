import { expectNoA11yViolations, gotoPage } from "@e2e/utils.ts";
import { test, expect, type Page } from "@playwright/test";

test.describe("page-transition", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/page-transition");
    await expect(getFirstPage(page)).toBeVisible();
    // The demo's router resolves its first route after mounting, so the first page fades in
    await expect.poll(() => getFirstPage(page).evaluate(isWrapperAtRest)).toBe(true);
  });

  test.describe("demos", () => {
    test("changes pages out-in", async ({ page }) => {
      await recordPageChanges(page);

      await page.getByRole("button", { name: "Ir para a agenda" }).click();

      await expect(getSecondPage(page)).toBeVisible();
      await expect(getFirstPage(page)).toHaveCount(0);
      expect(await getPageChanges(page)).toEqual(["removed first-page", "added second-page"]);
    });

    test("animates the change", async ({ page }) => {
      await recordPageAnimations(page);

      await page.getByRole("button", { name: "Ir para a agenda" }).click();

      await expect(getSecondPage(page)).toBeVisible();
      await expect(getFirstPage(page)).toHaveCount(0);
      await expect
        .poll(() => getPageAnimations(page))
        .toEqual(["first-page: opacity", "second-page: opacity"]);
    });

    test("changes without animation when reduced motion is requested", async ({ page }) => {
      // Requested after the page loads, as when the user changes the preference with the app open
      await page.emulateMedia({ reducedMotion: "reduce" });
      await recordPageAnimations(page);
      await recordPageChanges(page);

      await page.getByRole("button", { name: "Ir para a agenda" }).click();

      await expect(getSecondPage(page)).toBeVisible();
      await expect(getFirstPage(page)).toHaveCount(0);
      expect(await getPageChanges(page)).toEqual(["removed first-page", "added second-page"]);
      expect(await getPageAnimations(page)).toEqual([]);
    });

    test("keeps the height of a page with a full height container", async ({ page }) => {
      await page.getByRole("button", { name: "Ir para a agenda" }).click();
      await expect(getSecondPage(page)).toBeVisible();
      await expect(getFirstPage(page)).toHaveCount(0);

      // The page fills the content area of the main component, as it would without the transition
      const [pageHeight, contentHeight] = await getSecondPage(page).evaluate(
        (element: HTMLElement) => {
          const contentArea = element.parentElement!.parentElement!;
          const { paddingTop, paddingBottom } = getComputedStyle(contentArea);
          const padding = Number.parseFloat(paddingTop) + Number.parseFloat(paddingBottom);
          return [element.offsetHeight, contentArea.clientHeight - padding];
        },
      );
      expect(pageHeight).toBe(contentHeight);

      // With the whole height, the row centers the section vertically, away from the page's top
      const pageBox = (await getSecondPage(page).boundingBox())!;
      const titleBox = (await getSecondPage(page)
        .getByText("Agenda", { exact: true })
        .boundingBox())!;
      expect(titleBox.y - pageBox.y).toBeGreaterThan(pageBox.height / 4);
    });

    test("goes back and forth between the pages", async ({ page }) => {
      await page.getByRole("button", { name: "Ir para a agenda" }).click();
      await expect(getSecondPage(page)).toBeVisible();

      await page.getByRole("button", { name: "Voltar aos pacientes" }).click();

      await expect(getFirstPage(page)).toBeVisible();
      await expect(getSecondPage(page)).toHaveCount(0);
    });

    test("does not change the browser's address", async ({ page }) => {
      const pageUrl = page.url();

      await page.getByRole("button", { name: "Ir para a agenda" }).click();
      await expect(getSecondPage(page)).toBeVisible();

      expect(page.url()).toBe(pageUrl);
    });
  });

  test.describe("accessibility", () => {
    test("has no violations", async ({ page }) => {
      await expectNoA11yViolations(page);
    });

    test("has no violations after changing the page", async ({ page }) => {
      await page.getByRole("button", { name: "Ir para a agenda" }).click();
      await expect(getSecondPage(page)).toBeVisible();
      await expect(getFirstPage(page)).toHaveCount(0);
      // Halfway through the fade, the text's contrast is still below the minimum
      await expect.poll(() => getSecondPage(page).evaluate(isWrapperAtRest)).toBe(true);

      await expectNoA11yViolations(page);
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshots", async ({ page }) => {
      // The demo takes the viewport's height, so the whole page is captured
      await expect(page).toHaveScreenshot({ fullPage: true });

      await page.getByRole("button", { name: "Ir para a agenda" }).click();
      await expect(getSecondPage(page)).toBeVisible();
      await expect(getFirstPage(page)).toHaveCount(0);
      await expect.poll(() => getSecondPage(page).evaluate(isWrapperAtRest)).toBe(true);
      // Clicking scrolled the page, which would capture the docs' fixed header halfway down
      await page.evaluate(() => globalThis.scrollTo(0, 0));

      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

/**
 * Whether the element around the page finished fading in. Right after the previous page leaves,
 * the next one is still transparent for a frame, before its fade starts.
 */
function isWrapperAtRest(element: Element) {
  const wrapper = element.parentElement!;
  return wrapper.getAnimations().length === 0 && getComputedStyle(wrapper).opacity === "1";
}

function getFirstPage(page: Page) {
  return page.getByTestId("first-page");
}

function getSecondPage(page: Page) {
  return page.getByTestId("second-page");
}

/** Records, in order, the demo pages added to and removed from the document. */
async function recordPageChanges(page: Page) {
  await page.evaluate(() => {
    const changes: string[] = [];
    Object.assign(globalThis, { pageChanges: changes });

    const record = (nodes: NodeList, change: string) => {
      for (const node of nodes) {
        if (!(node instanceof HTMLElement)) continue;
        const pages = [node, ...node.querySelectorAll<HTMLElement>("[data-testid]")];
        for (const element of pages.filter((page) => page.dataset.testid?.endsWith("-page"))) {
          changes.push(`${change} ${element.dataset.testid}`);
        }
      }
    };

    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        record(mutation.removedNodes, "removed");
        record(mutation.addedNodes, "added");
      }
    }).observe(document.body, { childList: true, subtree: true });
  });
}

function getPageChanges(page: Page) {
  return page.evaluate(() => (globalThis as unknown as { pageChanges: string[] }).pageChanges);
}

/**
 * Records, on every frame, the properties animated on the demo pages or on the elements around
 * them, which is where the transition runs.
 */
async function recordPageAnimations(page: Page) {
  await page.evaluate(() => {
    const animations = new Set<string>();
    Object.assign(globalThis, { pageAnimations: animations });
    const pages = '[data-testid$="-page"]';

    const sample = () => {
      for (const animation of document.getAnimations()) {
        const target = (animation.effect as KeyframeEffect | null)?.target;
        const animated = target?.matches(pages) ? target : target?.querySelector(pages);
        if (animated instanceof HTMLElement && animation instanceof CSSTransition) {
          animations.add(`${animated.dataset.testid}: ${animation.transitionProperty}`);
        }
      }
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
}

function getPageAnimations(page: Page) {
  return page.evaluate(() =>
    [...(globalThis as unknown as { pageAnimations: Set<string> }).pageAnimations].sort(),
  );
}
