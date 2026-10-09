import { gotoPage } from "@e2e/utils.ts";
import { iconToVuetifyIcon, icons } from "@/consts/icons.ts";
import { test, expect, type Locator, type Page } from "@playwright/test";

test.describe("icons", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/icons");
  });

  test.describe("list", () => {
    test("lists every icon, in order, with its name below the button that copies it", async ({
      page,
    }) => {
      const items = getItems(page);

      await expect(items).toHaveCount(icons.length);
      await expect(items.locator("code")).toHaveText([...icons]);
      for (const [index, icon] of icons.entries()) {
        await expect(items.nth(index).getByRole("button")).toHaveAccessibleName(
          `Copiar o nome ${icon}`,
        );
      }
      await expect(getCount(page)).toHaveText(`${icons.length} ícones`);
      await expect(getCount(page)).toHaveAttribute("aria-live", "polite");
    });

    test("draws each icon with the icon font, hidden from screen readers", async ({ page }) => {
      await page.evaluate(() => document.fonts.ready);
      const items = await getItems(page).all();
      expect(items).toHaveLength(icons.length);

      for (const [index, item] of items.entries()) {
        const icon = item.locator(".v-icon");

        await expect(icon).toContainClass(iconToVuetifyIcon[icons[index]]);
        await expect(icon).toHaveAttribute("aria-hidden", "true");
        expect(await getGlyph(icon)).toEqual({
          content: expect.not.stringMatching(/^(none|normal|"")$/),
          fontFamily: expect.stringContaining("Material Design Icons"),
        });
      }
    });

    test("shows the suggested use below each name, shared by the alternative version", async ({
      page,
    }) => {
      await expect(getItem(page, "home")).toContainText("Início");
      await expect(getItem(page, "home-alternative")).toContainText("Início");
      await expect(getItem(page, "hospital")).toContainText("Unidades, rede");
    });

    test("matches the accessible snapshot of the list", async ({ page }) => {
      await expect(getList(page)).toMatchAriaSnapshot();
    });
  });

  test.describe("search", () => {
    test("filters by name, ignoring case", async ({ page }) => {
      await getSearch(page).fill("PILL");

      await expect(getNames(page)).toHaveText(["pill"]);
      await expect(getCount(page)).toHaveText("1 ícone");
    });

    test("filters by suggested use, ignoring case and accents", async ({ page }) => {
      await getSearch(page).fill("PRONTUARIO");
      await expect(getNames(page)).toHaveText(["clipboard-text", "clipboard-text-alternative"]);
      await expect(getCount(page)).toHaveText("2 ícones");

      await getSearch(page).fill("unidádes");
      await expect(getNames(page)).toHaveText(["hospital"]);
    });

    test("ignores spaces around the search", async ({ page }) => {
      await getSearch(page).fill("  exames  ");

      await expect(getNames(page)).toHaveText(["flask", "flask-alternative"]);
    });

    test("tells when no icon is found, and lists every icon again once cleared", async ({
      page,
    }) => {
      await getSearch(page).fill("xyz");

      await expect(getCount(page)).toHaveText("Nenhum ícone encontrado.");
      await expect(getList(page)).not.toBeAttached();

      await page
        .getByTestId("icons-search")
        .getByRole("button", { name: /limpar/i })
        .click();

      await expect(getSearch(page)).toHaveValue("");
      await expect(getItems(page)).toHaveCount(icons.length);
      await expect(getCount(page)).toHaveText(`${icons.length} ícones`);
    });
  });

  test.describe("copy", () => {
    test.describe("when the browser allows writing to the clipboard", () => {
      test.use({ permissions: ["clipboard-read", "clipboard-write"] });

      test("copies the name of the clicked icon and confirms it", async ({ page }) => {
        await getCopyButton(page, "home-alternative").click();

        await expect
          .poll(() => page.evaluate(() => navigator.clipboard.readText()))
          .toBe("home-alternative");
        await expect(getToast(page, "success")).toHaveText(/Nome "home-alternative" copiado\./);
      });

      test("copies by keyboard", async ({ page }) => {
        await getCopyButton(page, "pill").focus();
        await page.keyboard.press("Enter");

        await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("pill");
        await expect(getToast(page, "success")).toHaveText(/Nome "pill" copiado\./);
      });
    });

    test.describe("when the clipboard rejects the copy", () => {
      test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
          Object.defineProperty(navigator, "clipboard", {
            value: { writeText: () => Promise.reject(new Error("Write permission denied.")) },
          });
        });
        await page.reload();
      });

      test("asks to select the name instead", async ({ page }) => {
        await getCopyButton(page, "home").click();

        await expect(getToast(page, "error")).toHaveText(
          /Não foi possível copiar\. Selecione o nome "home" abaixo do ícone\./,
        );
      });
    });

    test.describe("when the browser has no clipboard", () => {
      test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
          Object.defineProperty(navigator, "clipboard", { value: undefined });
        });
        await page.reload();
      });

      test("asks to select the name instead", async ({ page }) => {
        await getCopyButton(page, "cog").click();

        await expect(getToast(page, "error")).toHaveText(
          /Não foi possível copiar\. Selecione o nome "cog" abaixo do ícone\./,
        );
      });
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

function getSearch(page: Page) {
  return page.getByRole("textbox", { name: "Buscar ícone" });
}

function getCount(page: Page) {
  return page.getByTestId("icons-count");
}

function getList(page: Page) {
  return page.getByTestId("icons-list");
}

function getItems(page: Page) {
  return getList(page).getByRole("listitem");
}

function getNames(page: Page) {
  return getItems(page).locator("code");
}

function getItem(page: Page, icon: string) {
  return getItems(page).filter({ has: page.locator("code").getByText(icon, { exact: true }) });
}

function getCopyButton(page: Page, icon: string) {
  return page.getByRole("button", { name: `Copiar o nome ${icon}`, exact: true });
}

/** The toast of the given color, which also holds its close button */
function getToast(page: Page, color: "success" | "error") {
  return page.locator(`.v-overlay-container .v-snackbar__wrapper.bg-${color}`);
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
