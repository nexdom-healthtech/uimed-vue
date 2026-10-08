import { gotoPage } from "@e2e/utils.ts";
import { test, expect, type Locator, type Page } from "@playwright/test";

test.describe("main", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/main");
    page.on("dialog", (dialog) => dialog.accept());
  });

  test.describe("props demo", () => {
    test.describe("logo", () => {
      test("renders the logo as a decorative image", async ({ page }) => {
        const demo = getLogoDemo(page);
        const logo = demo.locator("img");

        await expect(logo).toBeVisible();
        await expect(logo).toHaveAttribute("alt", "");
        await expect(demo.getByRole("img")).toHaveCount(0);
      });
    });

    test.describe("app-bar", () => {
      test("matches the accessible snapshot of the app bar demo", async ({ page }) => {
        const demo = getAppBar(page);
        await expect(demo).toMatchAriaSnapshot();
      });

      test("exposes the title as the page's level 1 heading", async ({ page }) => {
        const heading = getAppBar(page).getByRole("heading", { level: 1 });
        await expect(heading).toHaveText("Menu superior");
      });

      test.describe("help", () => {
        test("navigate to provided route", async ({ page }) => {
          const helpButton = getHelpButton(page);
          await helpButton.click();
          await expect(page).toHaveURL("https://www.google.com/");
        });
      });

      test.describe("notifications", () => {
        test("opens the notifications menu on click", async ({ page }) => {
          const notificationsButton = getNotificationsButton(page);
          await notificationsButton.click();

          const notificationsMenu = getNotificationsMenu(page);
          await expect(notificationsMenu).toBeVisible();
        });

        test("dismisses the unread badge after the menu is closed", async ({ page }) => {
          const notificationsButton = getNotificationsButton(page);
          const badge = getNotificationsBadge(page);
          await expect(badge).toBeVisible();

          await notificationsButton.click();
          await page.keyboard.press("Escape");

          await expect(badge).not.toBeVisible();
        });

        test("drops the unread count from its name after the menu is closed", async ({ page }) => {
          const notificationsButton = getNotificationsButton(page);
          await expect(notificationsButton).toHaveAccessibleName("Notificações (2 não lidas)");

          await notificationsButton.click();
          await expect(notificationsButton).toHaveAttribute("aria-expanded", "true");
          await page.keyboard.press("Escape");

          await expect(notificationsButton).toHaveAttribute("aria-expanded", "false");
          await expect(notificationsButton).toHaveAccessibleName("Notificações");
          await expect(getAppBar(page).getByRole("status")).toHaveCount(0);
        });

        test("doesn't clip the text of the notification subtitles", async ({ page }) => {
          const notificationsButton = getNotificationsButton(page);
          await notificationsButton.click();

          const subtitles = getNotificationsMenu(page).locator(".v-list-item-subtitle");
          await expect(subtitles).toHaveCount(4);

          for (const subtitle of await subtitles.all()) {
            await expectTextNotClipped(subtitle);
          }
        });
      });

      test.describe("user", () => {
        test("navigate to provided route", async ({ page }) => {
          const userButton = getUserButton(page);
          await userButton.click();

          const userMenu = getUserMenu(page);
          await userMenu.getByText("GitHub NEXDOM").click();
          await expect(page).toHaveURL("https://github.com/nexdom-healthtech");
        });

        test("triggers action callback", async ({ page }) => {
          const userButton = getUserButton(page);
          await userButton.click();

          const userMenu = getUserMenu(page);

          const dialogPromise = page.waitForEvent("dialog");

          await userMenu.getByRole("listitem").filter({ hasText: "Sair" }).click();

          const dialog = await dialogPromise;
          expect(dialog).toBeTruthy();
          expect(dialog.type()).toBe("alert");
          expect(dialog.message()).toBe("Saindo...");
        });
      });
    });

    test.describe("navigation-menu", () => {
      test.beforeEach(async ({ page }) => {
        const button = getNavigationToggleButton(page);
        await button.click();
      });

      test("matches the accessible snapshot of the navigation menu demo", async ({ page }) => {
        const demo = getNavigationMenu(page);
        await expect(demo).toMatchAriaSnapshot();
      });

      test("triggers action callback", async ({ page }) => {
        const demo = getNavigationMenu(page);

        const dialogPromise = page.waitForEvent("dialog");
        await demo.getByText("Configurações").click();

        const dialog = await dialogPromise;
        expect(dialog).toBeTruthy();
        expect(dialog.type()).toBe("alert");
        expect(dialog.message()).toBe("Abrindo configurações...");
      });

      test("filters items when typing in search field", async ({ page }) => {
        const searchField = getNavigationMenuSearch(page);
        const inicioItem = getNavigationMenu(page).getByText("Início");

        await expect(inicioItem).toBeVisible();

        await searchField.fill("Configurações");

        await expect(inicioItem).not.toBeVisible();
        await expect(getNavigationMenu(page).getByText("Configurações")).toBeVisible();

        await searchField.clear();

        await expect(inicioItem).toBeVisible();
      });
    });
  });

  // `ControlOrMeta` is Control on the Linux runners and ⌘ on macOS, as the shortcut itself
  test.describe("navigation-menu shortcut", () => {
    const shortcut = "ControlOrMeta+k";

    test("shows the shortcut in the search placeholder and keeps its name", async ({ page }) => {
      const userAgent = await page.evaluate(() => navigator.userAgent);
      const keys = userAgent.includes("Macintosh") ? "⌘K" : "Ctrl+K";
      const search = getNavigationMenuSearch(page);

      await expect(search).toHaveAttribute("placeholder", `Buscar (${keys})`);
      await expect(search).toHaveAccessibleName("Buscar");
      // Exact, so the test fails if the placeholder (with the shortcut) names the field again
      await expect(
        getNavigationMenu(page).getByRole("textbox", {
          name: "Buscar",
          exact: true,
          includeHidden: true,
        }),
      ).toHaveCount(1);
      await expect(getNavigationToggleButton(page)).toHaveAttribute(
        "aria-keyshortcuts",
        userAgent.includes("Macintosh") ? "Meta+K" : "Control+K",
      );
    });

    test("opens only the first navigation menu and focuses its search", async ({ page }) => {
      await page.keyboard.press(shortcut);

      await expect(getNavigationToggleDrawer(page)).toContainClass("v-navigation-drawer--active");
      await expect(getNavigationMenuSearch(page)).toBeFocused();
      await expect(getLoadingNavigationMenu(page)).not.toContainClass(
        "v-navigation-drawer--active",
      );
      await expect(getPlaygroundNavigationMenu(page)).not.toContainClass(
        "v-navigation-drawer--active",
      );
      // The docs search, which also answers Ctrl+K, stays closed
      await expect(getDocsSearch(page)).not.toBeAttached();
    });

    test("selects the search text when the shortcut is pressed again", async ({ page }) => {
      const search = getNavigationMenuSearch(page);
      await page.keyboard.press(shortcut);
      await search.fill("Início");
      await search.press("End");

      await page.keyboard.press(shortcut);

      await expect(getNavigationToggleDrawer(page)).toContainClass("v-navigation-drawer--active");
      await expect(search).toBeFocused();
      await expect(search).toHaveValue("Início");
      expect(await getSelection(search)).toEqual([0, "Início".length]);
      await expect(getNavigationMenu(page).getByText("Início")).toBeVisible();
      await expect(getNavigationMenu(page).getByText("Configurações")).not.toBeAttached();
    });

    test("focuses the search while typing in another field", async ({ page }) => {
      const title = page.getByTestId("root-playground-title").locator("input");
      await title.fill("Novo título");

      await title.press(shortcut);

      await expect(getNavigationToggleDrawer(page)).toContainClass("v-navigation-drawer--active");
      await expect(getNavigationMenuSearch(page)).toBeFocused();
      await expect(title).toHaveValue("Novo título");
      await expect(getDocsSearch(page)).not.toBeAttached();
    });

    test("leaves the shortcut to the page inside a menu", async ({ page }) => {
      await getUserButton(page).click();
      const link = getUserMenu(page).getByRole("link", { name: "GitHub NEXDOM" });
      await link.focus();

      await link.press(shortcut);

      await expect(getNavigationToggleDrawer(page)).not.toContainClass(
        "v-navigation-drawer--active",
      );
      await expect(getDocsSearch(page)).toBeVisible();
    });

    test("leaves the shortcut to the page while a menu opened by a click is open", async ({
      page,
    }) => {
      const userButton = getUserButton(page);
      await userButton.click();
      await expect(getUserMenu(page)).toBeVisible();
      // A click leaves the focus on the menu's button, outside the menu itself
      await expect(userButton).toBeFocused();

      await page.keyboard.press(shortcut);

      await expect(getNavigationToggleDrawer(page)).not.toContainClass(
        "v-navigation-drawer--active",
      );
      await expect(getDocsSearch(page)).toBeVisible();
    });

    test("closes the navigation menu with Escape and gives the focus back", async ({ page }) => {
      const title = page.getByTestId("root-playground-title").locator("input");
      await title.focus();
      await title.press(shortcut);
      await expect(getNavigationMenuSearch(page)).toBeFocused();

      await page.keyboard.press("Escape");

      await expect(getNavigationToggleDrawer(page)).not.toContainClass(
        "v-navigation-drawer--active",
      );
      await expect(title).toBeFocused();
    });

    test("closes the navigation menu opened by its button with Escape", async ({ page }) => {
      await getNavigationToggleButton(page).click();
      await getNavigationMenu(page).getByRole("link", { name: "Início" }).focus();

      await page.keyboard.press("Escape");

      await expect(getNavigationToggleDrawer(page)).not.toContainClass(
        "v-navigation-drawer--active",
      );
    });

    test("keeps the docs search on the slash key", async ({ page }) => {
      await page.keyboard.press("/");

      await expect(getDocsSearch(page)).toBeVisible();
      await expect(getNavigationToggleDrawer(page)).not.toContainClass(
        "v-navigation-drawer--active",
      );
    });
  });

  test.describe("loading demo", () => {
    test("shows a skeleton in place of the app bar actions", async ({ page }) => {
      const appBar = getLoadingAppBar(page);

      await expect(appBar).toHaveAttribute("aria-busy", "true");
      await expect(appBar.locator(".v-skeleton-loader")).toBeVisible();
      await expect(page.getByTestId("demo-root-loading-app-bar-help")).not.toBeAttached();
      await expect(page.getByTestId("demo-root-loading-app-bar-notifications")).not.toBeAttached();
      await expect(page.getByTestId("demo-root-loading-app-bar-user")).not.toBeAttached();
      await expect(getLoadingNavigationButton(page)).toBeVisible();
      await expect(appBar).toContainText("Menu superior");
    });

    test("opens the navigation menu with skeleton items and a disabled search", async ({
      page,
    }) => {
      await getLoadingNavigationButton(page).click();

      const navigationMenu = getLoadingNavigationMenu(page);
      await expect(navigationMenu).toContainClass("v-navigation-drawer--active");
      await expect(navigationMenu).toHaveAttribute("aria-busy", "true");
      await expect(navigationMenu.locator(".v-skeleton-loader")).toBeVisible();
      await expect(navigationMenu.getByText("Início")).not.toBeAttached();
      await expect(
        page.getByTestId("demo-root-loading-navigation-menu-search").locator("input"),
      ).toBeDisabled();
    });

    test("matches the accessible snapshot of the loading demo", async ({ page }) => {
      await getLoadingNavigationButton(page).click();
      await expect(getLoadingNavigationMenu(page)).toContainClass("v-navigation-drawer--active");

      await expect(getLoadingDemo(page)).toMatchAriaSnapshot();
    });
  });

  test.describe("footer demo", () => {
    test("shows the footer text", async ({ page }) => {
      await expect(getFooter(page)).toHaveText("Versão 1.4.2");
    });

    // In an app, a footer outside any sectioning element is the `contentinfo` landmark. Here the
    // docs page wraps the demo in its own `main`, which turns the footer into a generic element
    test("renders the footer as a footer element", async ({ page }) => {
      await expect(getFooter(page)).toHaveJSProperty("tagName", "FOOTER");
    });

    test("matches the accessible snapshot of the footer demo", async ({ page }) => {
      await expect(getFooterDemo(page)).toMatchAriaSnapshot();
    });

    test("sits at the bottom of the demo, below the page content", async ({ page }) => {
      const demo = await getBox(getFooterDemo(page));
      const footer = await getBox(getFooter(page));
      const content = await getBox(getFooterDemo(page).locator(".v-main > .v-container"));

      expect(Math.abs(footer.y + footer.height - (demo.y + demo.height))).toBeLessThanOrEqual(1);
      expect(content.y + content.height).toBeLessThanOrEqual(footer.y + 1);
    });
  });

  test.describe("playground", () => {
    test("updates the footer text when playground-footer-description changes", async ({ page }) => {
      const footer = getPlaygroundFooter(page);
      await expect(footer).toHaveText("Versão 1.0.0");

      await getPlaygroundFooterField(page).fill("Versão 2.0.0");

      await expect(footer).toHaveText("Versão 2.0.0");
    });

    test("removes the footer when playground-footer-description is cleared", async ({ page }) => {
      const footer = getPlaygroundFooter(page);
      await expect(footer).toBeVisible();

      await getPlaygroundFooterField(page).fill("");
      await expect(footer).not.toBeAttached();

      await getPlaygroundFooterField(page).fill("Versão 1.0.1");
      await expect(footer).toHaveText("Versão 1.0.1");
    });

    test("shows and hides the skeletons when playground-loading is toggled", async ({ page }) => {
      const appBar = getPlaygroundAppBar(page);
      const navigationMenu = getPlaygroundNavigationMenu(page);
      const notificationsButton = getPlaygroundNotificationsButton(page);

      await page.getByTestId("root-playground-app-bar-navigation").click();
      await expect(navigationMenu.getByText("Início")).toBeVisible();

      await getPlaygroundLoadingToggleButton(page).click();

      await expect(appBar).toHaveAttribute("aria-busy", "true");
      await expect(appBar.locator(".v-skeleton-loader")).toBeVisible();
      await expect(notificationsButton).not.toBeAttached();
      await expect(navigationMenu).toHaveAttribute("aria-busy", "true");
      await expect(navigationMenu.getByText("Início")).not.toBeAttached();
      await expect(getPlaygroundNavigationMenuSearch(page)).toBeDisabled();

      await getPlaygroundLoadingToggleButton(page).click();

      await expect(appBar).not.toHaveAttribute("aria-busy");
      await expect(appBar.locator(".v-skeleton-loader")).not.toBeAttached();
      await expect(notificationsButton).toBeVisible();
      await expect(navigationMenu).not.toHaveAttribute("aria-busy");
      await expect(getPlaygroundNavigationMenuSearch(page)).toBeEnabled();
    });

    test("keeps the search and filters the items when loading ends", async ({ page }) => {
      const navigationMenu = getPlaygroundNavigationMenu(page);

      await page.getByTestId("root-playground-app-bar-navigation").click();
      await getPlaygroundNavigationMenuSearch(page).fill("Início");

      await getPlaygroundLoadingToggleButton(page).click();
      await expect(navigationMenu.getByText("Início")).not.toBeAttached();
      await expect(getPlaygroundNavigationMenuSearch(page)).toHaveValue("Início");

      await getPlaygroundLoadingToggleButton(page).click();
      await expect(navigationMenu.getByText("Início")).toBeVisible();
      await expect(navigationMenu.getByText("Documentação")).not.toBeAttached();
    });

    test("closes the notifications menu when loading starts", async ({ page }) => {
      const notificationsButton = getPlaygroundNotificationsButton(page);
      const notificationsMenu = getPlaygroundNotificationsMenu(page);

      await notificationsButton.click();
      await expect(notificationsMenu).toBeVisible();

      const loadingToggleButton = getPlaygroundLoadingToggleButton(page);
      await loadingToggleButton.focus();
      await expect(notificationsMenu).toBeVisible();

      await loadingToggleButton.press("Space");
      await expect(notificationsButton).not.toBeAttached();
      await expect(notificationsMenu).not.toBeAttached();

      await loadingToggleButton.press("Space");
      await expect(notificationsButton).toBeVisible();
      await expect(notificationsButton).toHaveAttribute("aria-expanded", "false");
      await expect(notificationsMenu).not.toBeVisible();
    });

    test("names the notifications button with the unread count", async ({ page }) => {
      const appBar = getPlaygroundAppBar(page);
      const notificationsButton = getPlaygroundNotificationsButton(page);

      await expect(notificationsButton).toHaveAccessibleName("Notificações");
      await expect(appBar.getByRole("status")).toHaveCount(0);

      await page.getByTestId("root-playground-add-notification").click();
      await expect(notificationsButton).toHaveAccessibleName("Notificações (1 não lida)");
      await expect(appBar.getByRole("status", { name: "1 não lida", exact: true })).toHaveText("1");

      await page.getByTestId("root-playground-add-notification").click();
      await expect(notificationsButton).toHaveAccessibleName("Notificações (2 não lidas)");
      await expect(appBar.getByRole("status", { name: "2 não lidas", exact: true })).toHaveText(
        "2",
      );

      await page.getByTestId("root-playground-remove-notification").click();
      await page.getByTestId("root-playground-remove-notification").click();
      await expect(notificationsButton).toHaveAccessibleName("Notificações");
      await expect(appBar.getByRole("status")).toHaveCount(0);
    });

    test("updates title when playground-title changes", async ({ page }) => {
      const text = "Novo título";
      await page.getByTestId("root-playground-title").locator("input").fill(text);

      const appBar = getPlaygroundAppBar(page);
      await expect(appBar).toContainText(text);
    });

    test("updates help link when playground-help changes", async ({ page }) => {
      await page.getByTestId("root-playground-help").locator("input").fill("https://github.com");

      const helpButton = getPlaygroundHelpButton(page);
      await helpButton.click();
      await expect(page).toHaveURL("https://github.com/");
    });

    test("hides the help button when playground-help is cleared", async ({ page }) => {
      const helpButton = getPlaygroundHelpButton(page);
      await expect(helpButton).toBeVisible();

      await page.getByTestId("root-playground-help").locator("input").fill("");
      await expect(helpButton).not.toBeAttached();
    });

    test("adds a notification when playground-add-notification is clicked", async ({ page }) => {
      const notificationsButton = getPlaygroundNotificationsButton(page);
      const notificationsMenu = getPlaygroundNotificationsMenu(page);

      await notificationsButton.click();
      await expect(notificationsMenu).toContainText("Nenhuma notificação");
      await page.keyboard.press("Escape");

      await page.getByTestId("root-playground-add-notification").click();

      await notificationsButton.click();
      await expect(notificationsMenu.getByText("Lorem ipsum...")).toHaveCount(1);
    });

    test("toggles the notifications option in the app bar when checkbox is toggled", async ({
      page,
    }) => {
      const notificationsButton = getPlaygroundNotificationsButton(page);
      await expect(notificationsButton).toBeAttached();

      await getPlaygroundNotificationsToggleButton(page).click();
      await expect(notificationsButton).not.toBeAttached();

      await getPlaygroundNotificationsToggleButton(page).click();
      await expect(notificationsButton).toBeAttached();
    });

    test("toggles the user option in the app bar when checkbox is toggled", async ({ page }) => {
      const userButton = getPlaygroundUserButton(page);
      await expect(userButton).not.toBeAttached();

      await getPlaygroundUserToggleButton(page).click();
      await expect(userButton).toBeAttached();

      await getPlaygroundUserToggleButton(page).click();
      await expect(userButton).not.toBeAttached();
    });

    test("toggles the navigation menu when checkbox is toggled", async ({ page }) => {
      const navigationMenu = getPlaygroundNavigationMenu(page);
      await expect(navigationMenu).toBeAttached();

      await getPlaygroundNavigationMenuToggleButton(page).click();
      await expect(navigationMenu).not.toBeAttached();

      await getPlaygroundNavigationMenuToggleButton(page).click();
      await expect(navigationMenu).toBeAttached();
    });

    test("matches the accessible snapshot of the playground navigation menu in its default state", async ({
      page,
    }) => {
      const navigationMenu = getPlaygroundNavigationMenu(page);
      await expect(navigationMenu).toMatchAriaSnapshot();
    });

    test("removes the last notification when playground-remove-notification is clicked", async ({
      page,
    }) => {
      const notificationsButton = getPlaygroundNotificationsButton(page);
      const notificationsMenu = getPlaygroundNotificationsMenu(page);

      await page.getByTestId("root-playground-add-notification").click();
      await page.getByTestId("root-playground-add-notification").click();

      await notificationsButton.click();
      await expect(notificationsMenu.getByText("Lorem ipsum...")).toHaveCount(2);
      await page.keyboard.press("Escape");

      await page.getByTestId("root-playground-remove-notification").click();

      await notificationsButton.click();
      await expect(notificationsMenu.getByText("Lorem ipsum...")).toHaveCount(1);
    });

    test("matches the accessible snapshot of the playground app bar in its default state", async ({
      page,
    }) => {
      const appBar = getPlaygroundAppBar(page);
      await expect(appBar).toMatchAriaSnapshot();
    });
  });

  test.describe("events demo", () => {
    test("increments the counter when the notifications menu opens and closes", async ({
      page,
    }) => {
      const counter = getEventsNotificationsCounter(page);
      const notificationsButton = getEventsNotificationsButton(page);

      await expect(counter).toContainText("0 interação(ões)");

      await notificationsButton.click();
      await expect(counter).toContainText("1 interação(ões)");

      await page.keyboard.press("Escape");
      await expect(counter).toContainText("2 interação(ões)");
    });

    test("matches the accessible snapshot of the notifications open event demo", async ({
      page,
    }) => {
      const demo = getEventsDemo(page);

      await expect(demo).toMatchAriaSnapshot();
    });
  });

  test.describe("exemplos", () => {
    test("matches the accessible snapshot of the navigation toggle demo", async ({ page }) => {
      const demo = getNavigationToggleDemo(page);
      await expect(demo).toMatchAriaSnapshot();
    });

    test("toggles drawer visibility with nav icon", async ({ page }) => {
      const button = getNavigationToggleButton(page);
      const drawer = getNavigationToggleDrawer(page);

      await expect(drawer).not.toContainClass("v-navigation-drawer--active");

      await button.click();
      await expect(drawer).toContainClass("v-navigation-drawer--active");

      await button.click();
      await expect(drawer).not.toContainClass("v-navigation-drawer--active");
    });

    test("names the nav icon and toggles its aria-expanded with the drawer", async ({ page }) => {
      const button = getNavigationToggleDemo(page).getByRole("button", {
        name: "Menu de navegação",
        exact: true,
      });
      const drawer = getNavigationToggleDrawer(page);

      await expect(button).toHaveAttribute("aria-expanded", "false");

      await button.click();
      await expect(drawer).toContainClass("v-navigation-drawer--active");
      await expect(button).toHaveAttribute("aria-expanded", "true");

      await button.click();
      await expect(drawer).not.toContainClass("v-navigation-drawer--active");
      await expect(button).toHaveAttribute("aria-expanded", "false");
    });
  });

  test.describe("fonts", () => {
    test("loads the icon and text fonts with font-display swap", async ({ page }) => {
      await expect(getHelpButton(page)).toBeVisible();

      const fonts = await page.evaluate(() =>
        Array.from(document.fonts, (font) => ({
          family: font.family.replaceAll('"', ""),
          display: font.display,
        })),
      );
      const families = ["Material Design Icons", "Unimed Slab"];
      const faces = fonts.filter(({ family }) => families.includes(family));

      expect(new Set(faces.map(({ family }) => family))).toEqual(new Set(families));
      expect(faces.every(({ display }) => display === "swap")).toBe(true);
    });
  });

  test.describe("UI consistency", () => {
    // Each state builds on the previous one, as a user would reach it, with one full-page screenshot
    // per test, so each test fits in the default timeout
    test("matches last screenshot after choosing a user menu option", async ({ page }) => {
      await chooseUserMenuOption(page);
      await expect(page).toHaveScreenshot({ fullPage: true });
    });

    test("matches last screenshot with the notifications menu open", async ({ page }) => {
      await chooseUserMenuOption(page);
      await openNotificationsMenu(page);
      await expect(page).toHaveScreenshot({ fullPage: true });
    });

    test("matches last screenshot after closing the notifications menu", async ({ page }) => {
      await chooseUserMenuOption(page);
      await openNotificationsMenu(page);
      await page.keyboard.press("Escape");
      await expect(page).toHaveScreenshot({ fullPage: true });
    });

    test("matches last screenshot with the navigation menu open", async ({ page }) => {
      await chooseUserMenuOption(page);
      await openNotificationsMenu(page);
      await page.keyboard.press("Escape");
      await getNavigationToggleButton(page).click();
      await expect(page).toHaveScreenshot({ fullPage: true });
    });

    test("matches last screenshot after closing the navigation menu", async ({ page }) => {
      await chooseUserMenuOption(page);
      await openNotificationsMenu(page);
      await page.keyboard.press("Escape");
      await getNavigationToggleButton(page).click();
      await getNavigationToggleButton(page).click();
      await expect(page).toHaveScreenshot({ fullPage: true });
    });

    test("matches last screenshot of the footer demo", async ({ page }) => {
      await expect(getFooter(page)).toBeVisible();
      // The demo is as tall as the viewport, so the docs' fixed navigation bar would cover its top
      await page.addStyleTag({ content: ".VPNav { visibility: hidden; }" });
      await expect(getFooterDemo(page)).toHaveScreenshot();
    });

    // The loading demo with its drawer closed is already in the screenshots above
    test("matches last screenshot of the loading demo with its navigation menu open", async ({
      page,
    }) => {
      await getLoadingNavigationButton(page).click();
      await expect(getLoadingNavigationMenu(page)).toContainClass("v-navigation-drawer--active");
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

async function chooseUserMenuOption(page: Page) {
  await getUserButton(page).click();
  await getUserMenu(page).getByRole("listitem").first().click();
}

async function openNotificationsMenu(page: Page) {
  await getNotificationsButton(page).click();
}

function getDocsSearch(page: Page) {
  return page.locator(".VPLocalSearchBox");
}

function getSelection(input: Locator) {
  return input.evaluate((element: HTMLInputElement) => [
    element.selectionStart,
    element.selectionEnd,
  ]);
}

async function getBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("The element should be visible");
  return box;
}

function getFooterDemo(page: Page) {
  return page.getByTestId("demo-root-footer");
}

function getFooter(page: Page) {
  return page.getByTestId("demo-root-footer-footer");
}

function getPlaygroundFooter(page: Page) {
  return page.getByTestId("root-playground-footer");
}

function getPlaygroundFooterField(page: Page) {
  return page.getByTestId("root-playground-footer-description").locator("input");
}

function getLoadingDemo(page: Page) {
  return page.getByTestId("demo-root-loading");
}

function getLoadingAppBar(page: Page) {
  return page.getByTestId("demo-root-loading-app-bar");
}

function getLoadingNavigationButton(page: Page) {
  return page.getByTestId("demo-root-loading-app-bar-navigation");
}

function getLoadingNavigationMenu(page: Page) {
  return page.getByTestId("demo-root-loading-navigation-menu");
}

function getPlaygroundLoadingToggleButton(page: Page) {
  return page.getByTestId("root-playground-loading").locator("input");
}

function getPlaygroundNavigationMenuSearch(page: Page) {
  return page.getByTestId("root-playground-navigation-menu-search").locator("input");
}

function getLogoDemo(page: Page) {
  return page.getByTestId("demo-root-logo");
}

/**
 * Asserts the text of an element that clips its overflow fits inside the element's box. The text's
 * box, measured with a `Range`, spans the font's ascent and descent, which in Unimed Slab cover its
 * descenders (g, p, ç) and accented capitals, so it only fits when the line height is tall enough.
 */
async function expectTextNotClipped(element: Locator) {
  const { box, text } = await element.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const box = element.getBoundingClientRect();
    const text = range.getBoundingClientRect();

    return {
      box: { top: box.top, bottom: box.bottom },
      text: { top: text.top, bottom: text.bottom },
    };
  });

  expect(text.top).toBeGreaterThanOrEqual(box.top);
  expect(text.bottom).toBeLessThanOrEqual(box.bottom);
}

function getAppBar(page: Page) {
  return page.getByTestId("demo-root-app-bar");
}

function getHelpButton(page: Page) {
  return page.getByTestId("demo-root-app-bar-help");
}

function getNotificationsButton(page: Page) {
  return page.getByTestId("demo-root-app-bar-notifications");
}

function getNotificationsBadge(page: Page) {
  return getNotificationsButton(page).locator(".v-badge__badge");
}

function getNotificationsMenu(page: Page) {
  return page.getByTestId("demo-root-app-bar-notifications-menu");
}

function getUserButton(page: Page) {
  return page.getByTestId("demo-root-app-bar-user");
}

function getUserMenu(page: Page) {
  return page.getByTestId("demo-root-app-bar-user-menu");
}

function getPlaygroundAppBar(page: Page) {
  return page.getByTestId("root-playground-app-bar");
}

function getPlaygroundHelpButton(page: Page) {
  return page.getByTestId("root-playground-app-bar-help");
}

function getPlaygroundNotificationsButton(page: Page) {
  return page.getByTestId("root-playground-app-bar-notifications");
}

function getPlaygroundUserButton(page: Page) {
  return page.getByTestId("root-playground-app-bar-user");
}

function getPlaygroundNotificationsMenu(page: Page) {
  return page.getByTestId("root-playground-app-bar-notifications-menu");
}

function getPlaygroundUserToggleButton(page: Page) {
  return page.getByTestId("root-playground-show-user").locator("input");
}

function getPlaygroundNotificationsToggleButton(page: Page) {
  return page.getByTestId("root-playground-show-notifications").locator("input");
}

function getEventsDemo(page: Page) {
  return page.getByTestId("demo-notifications-open-event");
}

function getEventsNotificationsButton(page: Page) {
  return page.getByTestId("demo-root-events-app-bar-notifications");
}

function getEventsNotificationsCounter(page: Page) {
  return page.getByTestId("root-demo-notifications-open-count");
}

function getNavigationMenu(page: Page) {
  return page.getByTestId("demo-root-navigation-toggle-navigation-menu");
}

function getPlaygroundNavigationMenuToggleButton(page: Page) {
  return page.getByTestId("root-playground-show-navigation-menu").locator("input");
}

function getPlaygroundNavigationMenu(page: Page) {
  return page.getByTestId("root-playground-navigation-menu");
}

function getNavigationToggleDemo(page: Page) {
  return page.getByTestId("demo-root-navigation-toggle");
}

function getNavigationToggleButton(page: Page) {
  return page.getByTestId("demo-root-navigation-toggle-app-bar-navigation");
}

function getNavigationToggleDrawer(page: Page) {
  return page.getByTestId("demo-root-navigation-toggle-navigation-menu");
}

function getNavigationMenuSearch(page: Page) {
  return page.getByTestId("demo-root-navigation-toggle-navigation-menu-search").locator("input");
}
