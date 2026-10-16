import { test, expect, type Locator, type Page, type Route } from "@playwright/test";
import { expectNoA11yViolations, gotoPage, selectOption } from "@e2e/utils.ts";

test.describe("img", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/img");
  });

  test.describe("demos", () => {
    test("hides the images from assistive technologies", async ({ page }) => {
      const images = page.locator(".vp-doc .v-img");
      for (const image of await images.all()) {
        await loadImage(image);
        await expect(image.locator("img")).toHaveAttribute("alt", "");
        await expect(image).not.toHaveAttribute("role");
        await expect(image).not.toHaveAttribute("aria-label");
      }

      await expect(images).toHaveCount(9);
      await expect(page.locator(".vp-doc").getByRole("img")).toHaveCount(0);
    });

    test("keeps the reserved space empty when the image fails to load", async ({ page }) => {
      await page.route("**/favicon.svg", (route) => route.abort());
      await page.reload();

      const demo = page.getByTestId("demo-img-size");
      await demo.scrollIntoViewIfNeeded();

      await expect(demo.locator("img")).toBeAttached();
      await expect(demo.locator("img")).toBeHidden();
      await expectSize(demo, 187, 239);
    });

    test("reserves the space set by width and height before the image loads", async ({ page }) => {
      const demo = page.getByTestId("demo-img-size");
      const pending = await holdImage(page, "**/favicon.svg");

      await demo.scrollIntoViewIfNeeded();
      await expect(demo.locator("img")).toBeAttached();
      await expect(demo.locator("img")).toBeHidden();
      await expectSize(demo, 187, 239);

      await releaseImages(pending);
      await expect(demo.locator("img")).toBeVisible();
      await expectSize(demo, 187, 239);
    });

    test("sizes the image relative to its column with a percentage width", async ({ page }) => {
      const demo = page.getByTestId("demo-img-relative-size");
      const pending = await holdImage(page, "**/avatar.jpg");

      await demo.scrollIntoViewIfNeeded();
      await expect(demo.locator("img")).toBeHidden();
      const columnWidth = await getColumnContentWidth(demo);
      await expectSize(demo, columnWidth / 2, (columnWidth / 2) * (4 / 3));

      await releaseImages(pending);
      await expect(demo.locator("img")).toBeVisible();
      await expectSize(demo, columnWidth / 2, (columnWidth / 2) * (4 / 3));

      await page.setViewportSize({ width: 800, height: 720 });
      const resizedColumnWidth = await getColumnContentWidth(demo);
      expect(resizedColumnWidth).not.toBe(columnWidth);
      await expectSize(demo, resizedColumnWidth / 2, (resizedColumnWidth / 2) * (4 / 3));
    });

    test("reserves the space set by the aspect ratio before the image loads", async ({ page }) => {
      const fullWidth = page.getByTestId("demo-img-aspect-ratio");
      const fixedWidth = page.getByTestId("demo-img-aspect-ratio-width");
      const pending = await holdImage(page, "**/avatar.jpg");

      await fullWidth.scrollIntoViewIfNeeded();
      await expect(fullWidth.locator("img")).toBeHidden();
      await expect(fixedWidth.locator("img")).toBeHidden();

      const columnWidth = await getColumnContentWidth(fullWidth);
      await expectSize(fullWidth, columnWidth, (columnWidth * 4) / 3);
      await expectSize(fixedWidth, 120, 160);

      await releaseImages(pending);
      await expect(fullWidth.locator("img")).toBeVisible();
      await expect(fixedWidth.locator("img")).toBeVisible();
      await expectSize(fullWidth, columnWidth, (columnWidth * 4) / 3);
      await expectSize(fixedWidth, 120, 160);
    });

    test("shows the whole image by default and crops it with cover", async ({ page }) => {
      const contain = page.getByTestId("demo-img-contain");
      const cover = page.getByTestId("demo-img-cover");
      await loadImage(contain);
      await loadImage(cover);

      await expect(contain.locator("img")).toHaveCSS("object-fit", "contain");
      await expect(cover.locator("img")).toHaveCSS("object-fit", "cover");
      await expectSize(contain, 240, 160);
      await expectSize(cover, 240, 160);
    });

    test("loads an image only when it's about to become visible, unless it's eager", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 300 });
      await page.reload();

      const lazy = page.getByTestId("demo-img-lazy");
      const eager = page.getByTestId("demo-img-eager");

      await expect(lazy).not.toBeInViewport();
      await expect(eager).not.toBeInViewport();
      await expect.poll(() => isImageLoaded(eager)).toBe(true);
      await expect(lazy.locator("img")).toHaveCount(0);

      await lazy.scrollIntoViewIfNeeded();
      await expect.poll(() => isImageLoaded(lazy)).toBe(true);
      await expect(lazy.locator("img")).toBeVisible();
    });
  });

  test.describe("playground", () => {
    test.beforeEach(async ({ page }) => {
      await loadImage(getPreview(page));
    });

    test("updates the image when playground-src changes", async ({ page }) => {
      await selectOption(page, "img-playground-src", "Foto (JPG)");

      await expect(getPreview(page).locator("img")).toHaveAttribute("src", "/uimed-vue/avatar.jpg");
      await expect.poll(() => isImageLoaded(getPreview(page))).toBe(true);
    });

    test("updates the size when playground-width and playground-height change", async ({
      page,
    }) => {
      const preview = getPreview(page);
      await expectSize(preview, 94, 120);

      await fillControl(page, "img-playground-width", "150");
      await fillControl(page, "img-playground-height", "80");
      await expectSize(preview, 150, 80);
    });

    test("accepts sizes with a unit in playground-width and playground-height", async ({
      page,
    }) => {
      const preview = getPreview(page);
      await fillControl(page, "img-playground-width", "50%");
      await fillControl(page, "img-playground-height", "10rem");

      await expectSize(preview, (await getColumnContentWidth(preview)) / 2, 160);
    });

    test("never gets wider than its column", async ({ page }) => {
      const preview = getPreview(page);
      await fillControl(page, "img-playground-width", "5000");

      await expectSize(preview, await getColumnContentWidth(preview), 120);
    });

    test("uses the aspect ratio only when there is no height", async ({ page }) => {
      const preview = getPreview(page);
      await fillControl(page, "img-playground-aspect-ratio", "2");
      await expectSize(preview, 94, 120);

      await fillControl(page, "img-playground-height", "");
      await expectSize(preview, 94, 47);
    });

    test("crops the image when playground-cover is toggled", async ({ page }) => {
      const img = getPreview(page).locator("img");
      await expect(img).toHaveCSS("object-fit", "contain");

      await page.getByTestId("img-playground-cover").locator("input").click();
      await expect(img).toHaveCSS("object-fit", "cover");
    });
  });

  test.describe("accessibility", () => {
    test("has no violations", async ({ page }) => {
      for (const img of await page.locator(".vp-doc .v-img").all()) {
        await loadImage(img);
      }

      await expectNoA11yViolations(page);
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      for (const img of await page.locator(".vp-doc .v-img").all()) {
        await loadImage(img);
      }
      await page.evaluate(() => window.scrollTo(0, 0));

      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

function getPreview(page: Page) {
  return page.getByTestId("img-preview");
}

async function fillControl(page: Page, testId: string, value: string) {
  await page.getByTestId(testId).locator("input").fill(value);
}

/**
 * Scrolls to an image, since it's only loaded when it's about to become
 * visible, and waits until it's loaded and shown.
 */
async function loadImage(image: Locator) {
  await image.scrollIntoViewIfNeeded();
  await expect.poll(() => isImageLoaded(image)).toBe(true);
  await expect(image.locator("img")).toBeVisible();
}

async function isImageLoaded(image: Locator) {
  const img = image.locator("img");
  if ((await img.count()) === 0) return false;
  return img.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0);
}

/**
 * Reloads the page holding the requests of the images matching `url` until
 * they're released, keeping them loading. Routing also disables the cache, so
 * images already loaded are requested again.
 */
async function holdImage(page: Page, url: string) {
  const pending: Route[] = [];
  await page.route(url, (route) => {
    pending.push(route);
  });
  // The held images delay the "load" event
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("h1").waitFor({ state: "visible" });
  return pending;
}

async function releaseImages(pending: Route[]) {
  await expect.poll(() => pending.length).toBeGreaterThan(0);
  await Promise.all(pending.map((route) => route.continue()));
}

async function getColumnContentWidth(image: Locator) {
  return image.evaluate((element) => {
    const column = element.parentElement!;
    const { paddingLeft, paddingRight } = getComputedStyle(column);
    return column.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
  });
}

async function expectSize(image: Locator, width: number, height: number) {
  await expect
    .poll(async () => {
      const box = (await image.boundingBox())!;
      return [Math.round(box.width), Math.round(box.height)];
    })
    .toEqual([Math.round(width), Math.round(height)]);
}
