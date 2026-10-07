import { test, expect, type Page } from "@playwright/test";
import { gotoPage } from "@e2e/utils.ts";

const externalUrl = "https://nexdom-healthtech.github.io/shared/";

test.describe("link", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/link");
  });

  test.describe("demos", () => {
    test("exposes each link by its text, with the href of its destination", async ({ page }) => {
      await expect(getRouteLink(page)).toHaveAttribute("href", "/esqueci-minha-senha");
      await expect(getExternalLink(page)).toHaveAttribute("href", externalUrl);
      await expect(getRouteLink(page)).not.toHaveAttribute("target");
      await expect(getExternalLink(page)).not.toHaveAttribute("target");
    });

    test("navigates to an app route without reloading the page", async ({ page }) => {
      const pageUrl = page.url();
      await page.evaluate(() => Object.assign(globalThis, { notReloaded: true }));
      await expect(getRouteLink(page)).not.toHaveAttribute("aria-current");

      await getRouteLink(page).click();

      await expect(getRouteLink(page)).toHaveAttribute("aria-current", "page");
      expect(page.url()).toBe(pageUrl);
      expect(await page.evaluate(() => "notReloaded" in globalThis)).toBe(true);
    });

    test("navigates to an http URL through the browser, in the same tab", async ({
      page,
      context,
    }) => {
      await page.route(`${externalUrl}**`, (route) =>
        route.fulfill({ contentType: "text/html", body: "<h1>Shared</h1>" }),
      );

      await getExternalLink(page).click();

      await expect(page).toHaveURL(externalUrl);
      await expect(page.getByRole("heading", { name: "Shared" })).toBeVisible();
      expect(context.pages()).toHaveLength(1);
    });

    test("receives the focus by keyboard, with a visible focus ring", async ({ page }) => {
      // The "Vue Router" link of the warning comes right before the demo
      await page.locator(".vp-doc").getByRole("link", { name: "Vue Router" }).focus();
      await page.keyboard.press("Tab");

      const link = getRouteLink(page);
      await expect(link).toBeFocused();
      await expect(link).toHaveCSS("outline-style", "auto");
      await expect(link).not.toHaveCSS("outline-width", "0px");
    });

    test("is not underlined", async ({ page }) => {
      await expect(getRouteLink(page)).toHaveCSS("text-decoration-line", "none");
      await expect(getExternalLink(page)).toHaveCSS("text-decoration-line", "none");
    });

    test("matches the accessible snapshot of the demos", async ({ page }) => {
      await expect(page.locator(".vp-doc .demo").first()).toMatchAriaSnapshot();
      await expect(page.locator(".vp-doc .demo").nth(1)).toMatchAriaSnapshot();
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });

    test("matches last screenshot of the focused link", async ({ page }) => {
      await page.locator(".vp-doc").getByRole("link", { name: "Vue Router" }).focus();
      await page.keyboard.press("Tab");
      await expect(getRouteLink(page)).toBeFocused();

      // Clipped with room around the link, since the focus ring is drawn outside it
      const box = (await getRouteLink(page).boundingBox())!;
      await expect(page).toHaveScreenshot({
        clip: { x: box.x - 8, y: box.y - 8, width: box.width + 16, height: box.height + 16 },
      });
    });
  });
});

function getRouteLink(page: Page) {
  return page.getByRole("link", { name: "Esqueceu sua senha?", exact: true });
}

function getExternalLink(page: Page) {
  return page.getByRole("link", { name: "Documentação do Shared", exact: true });
}
