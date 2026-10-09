import { gotoPage } from "@e2e/utils.ts";
import { iconToVuetifyIcon } from "@/consts/icons.ts";
import { test, expect, type Locator, type Page } from "@playwright/test";

// The names the components accept, in the order the page lists them
const icons = Object.keys(iconToVuetifyIcon);

test.describe("icons", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/icons");
  });

  test("lists every icon name in the table", async ({ page }) => {
    const names = await getTable(page).locator("tbody code").allTextContents();

    expect(names.toSorted()).toEqual(icons.toSorted());
  });

  test.describe("demo", () => {
    test.beforeEach(async ({ page }) => {
      await getNavigationButton(page).click();
      await expect(getNavigationMenu(page)).toContainClass("v-navigation-drawer--active");
    });

    test("lists every icon, named after it, in the navigation menu", async ({ page }) => {
      await expect(getItems(page)).toHaveText(icons);
    });

    test("renders each icon before its name, hidden from screen readers", async ({ page }) => {
      await page.evaluate(() => document.fonts.ready);
      const items = await getItems(page).all();
      expect(items).toHaveLength(icons.length);

      for (const [index, item] of items.entries()) {
        const icon = item.locator(".v-list-item__prepend .v-icon");
        const vuetifyIcon = Object.values(iconToVuetifyIcon)[index];

        await expect(icon).toContainClass(vuetifyIcon);
        await expect(icon).toHaveAttribute("aria-hidden", "true");
        expect(await getGlyph(icon)).toEqual({
          content: expect.not.stringMatching(/^(none|normal|"")$/),
          fontFamily: expect.stringContaining("Material Design Icons"),
        });
      }
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await getNavigationButton(page).click();
      await expect(getNavigationMenu(page)).toContainClass("v-navigation-drawer--active");

      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

function getTable(page: Page) {
  return page.locator(".vp-doc table");
}

function getNavigationButton(page: Page) {
  return page.getByTestId("demo-icons-app-bar-navigation");
}

function getNavigationMenu(page: Page) {
  return page.getByTestId("demo-icons-navigation-menu");
}

function getItems(page: Page) {
  return getNavigationMenu(page).locator(".v-list-item");
}

/**
 * The glyph the icon font draws for the icon: its class sets the `::before` content, which is
 * missing when the class isn't in the icon font's stylesheet
 */
function getGlyph(icon: Locator) {
  return icon.evaluate((element) => {
    const { content, fontFamily } = getComputedStyle(element, "::before");
    return { content, fontFamily };
  });
}
