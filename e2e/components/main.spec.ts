import {
  expectLoadingAnnouncement,
  expectNoA11yViolations,
  getFieldContrast,
  gotoPage,
  selectOption,
  waitForAnimations,
} from "@e2e/utils.ts";
import { icons } from "@/consts/icons.ts";
import { test, expect, type Locator, type Page } from "@playwright/test";

// Any of the background color classes, e.g. `bg-primary`
const backgroundClass = /(^|\s)bg-/;

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

          await userMenu.getByRole("button", { name: "Sair" }).click();

          const dialog = await dialogPromise;
          expect(dialog).toBeTruthy();
          expect(dialog.type()).toBe("alert");
          expect(dialog.message()).toBe("Saindo...");
        });

        test("shows the picture instead of the initials", async ({ page }) => {
          const avatar = getUserButton(page).locator(".v-avatar");

          await expect(avatar.locator(".v-img")).toBeVisible();
          await expect(avatar).toHaveText("");
        });

        test("centers the avatar above the name and subtitle in the user menu", async ({
          page,
        }) => {
          await getUserButton(page).click();
          await expectCenteredUserMenuAvatar(page, getUserButton(page), getUserMenu(page));
        });

        test("makes the group's header as wide as the other options and aligns its text", async ({
          page,
        }) => {
          await getUserButton(page).click();
          const userMenu = getUserMenu(page);

          await expectAlignedItems(
            page,
            userMenu.getByRole("button", { name: "Bibliotecas" }),
            userMenu.getByRole("link", { name: "GitHub NEXDOM" }),
          );
        });
      });

      test.describe("user without picture", () => {
        test("shows the user's initials in the button and in the menu", async ({ page }) => {
          const userButton = getUserInitialsButton(page);
          await expect(userButton.locator(".v-avatar")).toBeVisible();
          await expect(userButton.locator(".v-avatar")).toHaveText("RP");

          await userButton.click();

          const userMenu = getUserInitialsMenu(page);
          await expect(userMenu).toBeVisible();
          await expect(userMenu.locator(".v-avatar")).toBeVisible();
          await expect(userMenu.locator(".v-avatar")).toHaveText("RP");
        });

        test("keeps the button's name and hides the initials from screen readers", async ({
          page,
        }) => {
          const userButton = getUserInitialsButton(page);
          await expect(userButton).toHaveAccessibleName("Menu do usuário");
          await expect(userButton.locator(".v-avatar")).toHaveAttribute("aria-hidden", "true");

          await userButton.click();

          const userMenu = getUserInitialsMenu(page);
          await expect(userMenu.locator(".v-avatar")).toHaveText("RP");
          await expect(userMenu.locator(".v-avatar")).toHaveAttribute("aria-hidden", "true");
          expect(await userMenu.ariaSnapshot()).not.toContain("RP");
        });

        test("matches the accessible snapshot of the user without picture demo", async ({
          page,
        }) => {
          await expect(getUserInitialsDemo(page)).toMatchAriaSnapshot();
        });

        test("centers the avatar above the name and subtitle in the user menu", async ({
          page,
        }) => {
          await getUserInitialsButton(page).click();
          await expectCenteredUserMenuAvatar(
            page,
            getUserInitialsButton(page),
            getUserInitialsMenu(page),
          );
        });
      });

      test.describe("user details", () => {
        test("shows the details centered between the user's name and the options", async ({
          page,
        }) => {
          await getUserDetailsButton(page).click();
          const userMenu = getUserDetailsMenu(page);
          await expect(userMenu).toBeVisible();
          // The menu grows from the button while it opens, so its boxes are only final afterwards
          await waitForAnimations(page);

          const organization = userMenu.getByText("Unimed do Estado de Santa Catarina");
          const profile = userMenu.getByText("Perfil Administrador");
          await expect(organization).toHaveCSS("text-align", "center");
          await expect(profile).toHaveCSS("text-align", "center");

          const [card, subtitle, organizationBox, manageButton, option] = await Promise.all([
            getBox(userMenu),
            getBox(userMenu.locator(".v-card-subtitle")),
            getBox(organization),
            getBox(userMenu.getByRole("button", { name: "Gerenciar perfil" })),
            getBox(userMenu.getByRole("button", { name: "Sair" })),
          ]);

          expect(subtitle.y + subtitle.height).toBeLessThanOrEqual(organizationBox.y);
          expect(manageButton.y + manageButton.height).toBeLessThanOrEqual(option.y);
          const cardCenter = card.x + card.width / 2;
          const organizationCenter = organizationBox.x + organizationBox.width / 2;
          expect(Math.abs(organizationCenter - cardCenter)).toBeLessThanOrEqual(1);
        });

        test("triggers the action of a button in the details", async ({ page }) => {
          await getUserDetailsButton(page).click();

          const dialogPromise = page.waitForEvent("dialog");
          await getUserDetailsMenu(page).getByRole("button", { name: "Gerenciar perfil" }).click();

          const dialog = await dialogPromise;
          expect(dialog.type()).toBe("alert");
          expect(dialog.message()).toBe("Abrindo o perfil...");
        });

        test("matches the accessible snapshot of the open user details menu", async ({ page }) => {
          await getUserDetailsButton(page).click();
          await expect(getUserDetailsMenu(page)).toMatchAriaSnapshot();
        });
      });
    });

    test.describe("navigation-menu", () => {
      test.beforeEach(async ({ page }) => {
        await expandByMouse(page, getNavigationMenu(page));
      });

      test("matches the accessible snapshot of the navigation menu demo", async ({ page }) => {
        const demo = getNavigationMenu(page);
        await expect(demo).toMatchAriaSnapshot();
      });

      test("shows the icon of each item and group, hidden from screen readers", async ({
        page,
      }) => {
        // The children of the closed group are rendered, but hidden, as the search item while the
        // menu is expanded
        const items = getNavigationMenu(page).locator(".v-list-item").filter({ visible: true });
        const itemIcons = items.locator(".v-list-item__prepend .v-icon");
        await expect(items).toHaveText(["Início", "Documentação", "Configurações"]);

        await expect(itemIcons).toHaveCount(3);
        await expect(itemIcons.nth(0).locator("path")).toHaveAttribute("d", icons.home);
        await expect(itemIcons.nth(1).locator("path")).toHaveAttribute("d", icons.folder);
        await expect(itemIcons.nth(2).locator("path")).toHaveAttribute("d", icons.cog);
        for (const icon of await itemIcons.all()) {
          await expect(icon).toBeVisible();
          await expect(icon).toHaveAttribute("aria-hidden", "true");
        }
      });

      test("shows no icon on the items inside a group", async ({ page }) => {
        const demo = getNavigationMenu(page);
        await demo.getByRole("button", { name: "Documentação" }).click();

        const items = demo.locator(".v-list-group__items .v-list-item").filter({ visible: true });
        await expect(items).toHaveText(["Componentes", "Composables"]);
        await expect(items.locator(".v-list-item__prepend")).toHaveCount(0);
      });

      test("makes the group's header as wide as the other items and aligns its text", async ({
        page,
      }) => {
        const demo = getNavigationMenu(page);

        await expectAlignedItems(
          page,
          demo.getByRole("button", { name: "Documentação" }),
          demo.getByRole("link", { name: "Início" }),
        );
      });

      test("shows its items over the menu's color, without a background of their own", async ({
        page,
      }) => {
        const list = getNavigationMenu(page).locator(".v-navigation-drawer__content .v-list");

        await expect(list).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
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

  // The default viewport (1280px) is above the mobile breakpoint (1145px)
  test.describe("navigation rail", () => {
    test("renders the rail on the client without hydration mismatches", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });

      await page.reload();
      await page.locator("h1").waitFor({ state: "visible" });

      await expectCollapsed(getNavigationMenu(page));
      expect(errors).toEqual([]);
    });

    test("shows the collapsed rail beside the content, with the icons and a search item", async ({
      page,
    }) => {
      const drawer = getNavigationMenu(page);
      await expectCollapsed(drawer);

      const items = drawer.locator(".v-list-item").filter({ visible: true });
      await expect(items).toHaveCount(4);
      const itemIcons = items.locator(".v-list-item__prepend .v-icon");
      await expect(itemIcons.nth(0).locator("path")).toHaveAttribute("d", icons.search);
      await expect(itemIcons.nth(1).locator("path")).toHaveAttribute("d", icons.home);
      await expect(itemIcons.nth(2).locator("path")).toHaveAttribute("d", icons.folder);
      await expect(itemIcons.nth(3).locator("path")).toHaveAttribute("d", icons.cog);

      // The titles are only clipped by the rail, so they still name the items
      await expect(drawer.getByRole("button", { name: "Buscar", exact: true })).toBeVisible();
      await expect(drawer.getByRole("link", { name: "Início" })).toBeVisible();
      await expect(drawer.getByRole("button", { name: "Documentação" })).toBeVisible();
      await expect(getNavigationMenuSearch(page)).toBeHidden();

      const [rail, content] = await Promise.all([
        getBox(drawer),
        getBox(getNavigationToggleDemo(page).locator(".v-main > .v-container")),
      ]);
      expect(content.x).toBeGreaterThanOrEqual(rail.x + rail.width);
    });

    test("stays between the app bar and the footer, which takes the app's whole width", async ({
      page,
    }) => {
      const drawer = getPlaygroundNavigationMenu(page);
      await expectCollapsed(drawer);

      const [app, appBar, rail, footer] = await Promise.all([
        getBox(page.getByTestId("root-preview")),
        getBox(getPlaygroundAppBar(page)),
        getBox(drawer),
        getBox(getPlaygroundFooter(page)),
      ]);
      expect(rail.y).toBeCloseTo(appBar.y + appBar.height, 0);
      expect(rail.y + rail.height).toBeCloseTo(footer.y, 0);
      expect(footer.x).toBeCloseTo(app.x, 0);
      expect(footer.width).toBeCloseTo(app.width, 0);
    });

    // The docs contain each demo's app, which then scrolls with the page. In an app, the main
    // component is the page, as without that containment
    test("stays in place while the page scrolls", async ({ page }) => {
      await page.addStyleTag({ content: ".demo { contain: none !important; }" });
      const drawer = getNavigationMenu(page);
      const content = getNavigationToggleDemo(page).locator(".v-main > .v-container");
      const [rail, contentBefore] = await Promise.all([getBox(drawer), getBox(content)]);

      await page.evaluate(() => globalThis.scrollBy(0, 300));

      await expect
        .poll(async () => (await getBox(content)).y)
        .toBeCloseTo(contentBefore.y - 300, 0);
      expect(await getBox(drawer)).toEqual(rail);
    });

    test("scrolls only its items when they don't fit", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 200 });
      const drawer = getNavigationMenu(page);
      const items = drawer.locator(".v-navigation-drawer__content");
      await scrollToMenu(drawer);
      await items.hover();
      await expectExpanded(drawer);
      const [scrollHeight, clientHeight] = await items.evaluate((element) => [
        element.scrollHeight,
        element.clientHeight,
      ]);
      expect(scrollHeight).toBeGreaterThan(clientHeight + 20);
      const pageScroll = await page.evaluate(() => globalThis.scrollY);

      await page.mouse.wheel(0, 20);

      await expect.poll(() => items.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
      expect(await page.evaluate(() => globalThis.scrollY)).toBe(pageScroll);
      await expect(getNavigationMenuSearch(page)).toBeInViewport();
    });

    test("leaves the navigation button out of the app bar", async ({ page }) => {
      await expect(getNavigationToggleButton(page)).not.toBeAttached();
      await expect(getNavigationMenu(page)).toBeVisible();
    });

    test("expands over the content while the mouse is over it", async ({ page }) => {
      const drawer = getNavigationMenu(page);
      const content = getNavigationToggleDemo(page).locator(".v-main > .v-container");
      await scrollToMenu(drawer);
      const contentBefore = await getBox(content);

      await expandByMouse(page, drawer);

      await expect(getNavigationMenuSearch(page)).toBeVisible();
      await expect(drawer.getByRole("button", { name: "Buscar", exact: true })).toBeHidden();
      expect((await getBox(drawer)).width).toBe(256);
      expect(await getBox(content)).toEqual(contentBefore);

      await page.mouse.move(1000, 600);

      await expectCollapsed(drawer);
    });

    test("keeps its items in place when it expands", async ({ page }) => {
      const drawer = getNavigationMenu(page);
      const item = drawer.getByRole("link", { name: "Início" });
      const divider = drawer.locator(".v-divider");
      await scrollToMenu(drawer);
      await expectCollapsed(drawer);
      const [itemBefore, dividerBefore] = await Promise.all([getBox(item), getBox(divider)]);

      await expandByMouse(page, drawer);

      expect((await getBox(divider)).y).toBe(dividerBefore.y);
      expect((await getBox(item)).y).toBe(itemBefore.y);
    });

    test("fits a group's common description, between its icon and its arrow, when expanded", async ({
      page,
    }) => {
      const drawer = getNavigationMenu(page);
      await expandByMouse(page, drawer);
      const title = drawer
        .getByRole("button", { name: "Documentação" })
        .locator(".v-list-item-title");

      // The description of the issue that reported it truncated, which the demo doesn't have
      const truncated = await title.evaluate((element) => {
        element.textContent = "Recursos humanos";
        return element.scrollWidth > element.clientWidth;
      });

      expect(truncated).toBe(false);
    });

    test("aligns the items of a group with its title", async ({ page }) => {
      const drawer = getNavigationMenu(page);
      await expandByMouse(page, drawer);
      const group = drawer.getByRole("button", { name: "Documentação" });
      await group.click();
      // The group grows while it opens, moving its items
      await waitForAnimations(page);

      const [groupTitle, itemTitle] = await Promise.all([
        getBox(group.locator(".v-list-item-title")),
        getBox(drawer.getByRole("link", { name: "Componentes" }).locator(".v-list-item-title")),
      ]);
      expect(itemTitle.x).toBe(groupTitle.x);
    });

    test("expands while the keyboard focus is in it, and collapses when it leaves", async ({
      page,
    }) => {
      const drawer = getNavigationMenu(page);

      // The search item passes the focus on to the search field
      await tabInto(page, drawer);
      await expect(getNavigationMenuSearch(page)).toBeFocused();
      await expectExpanded(drawer);

      await page.keyboard.press("Tab");
      await expect(drawer.getByRole("link", { name: "Início" })).toBeFocused();
      await expectExpanded(drawer);

      // The list's items take the focus with the arrow keys, and Tab leaves the list
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await expect(drawer.getByRole("button", { name: "Configurações" })).toBeFocused();
      await expectExpanded(drawer);
      await page.keyboard.press("Tab");

      await expectCollapsed(drawer);
    });

    test("stays expanded while the mouse leaves with the keyboard focus inside", async ({
      page,
    }) => {
      const drawer = getNavigationMenu(page);
      await tabInto(page, drawer);
      await page.keyboard.press("Tab");

      await expandByMouse(page, drawer);
      await page.mouse.move(1000, 600);

      await expectExpanded(drawer);
      await expect(drawer.getByRole("link", { name: "Início" })).toBeFocused();
    });

    test("collapses after a click on an item once the mouse leaves", async ({ page }) => {
      const drawer = getNavigationMenu(page);
      await expandByMouse(page, drawer);

      await drawer.getByRole("link", { name: "Início" }).click();
      await page.mouse.move(1000, 600);

      await expectCollapsed(drawer);
    });

    test("collapses with Escape, even with the mouse over it, until the mouse enters again", async ({
      page,
    }) => {
      const drawer = getNavigationMenu(page);
      await expandByMouse(page, drawer);
      const link = drawer.getByRole("link", { name: "Início" });
      await link.focus();

      await page.keyboard.press("Escape");

      await expectCollapsed(drawer);
      await expect(link).toBeFocused();

      await page.mouse.move(1000, 600);
      await expandByMouse(page, drawer);
    });

    test("moves the focus to the search item when Escape hides the search field", async ({
      page,
    }) => {
      const drawer = getNavigationMenu(page);
      await expandByMouse(page, drawer);
      await getNavigationMenuSearch(page).click();

      await page.keyboard.press("Escape");

      await expectCollapsed(drawer);
      await expect(drawer.getByRole("button", { name: "Buscar", exact: true })).toBeFocused();
    });

    test("expands and focuses the search with the search item", async ({ page }) => {
      const drawer = getNavigationMenu(page);
      const title = page.getByTestId("root-playground-title").locator("input");
      await title.focus();

      await drawer.getByRole("button", { name: "Buscar", exact: true }).focus();

      await expectExpanded(drawer);
      await expect(getNavigationMenuSearch(page)).toBeFocused();

      await page.keyboard.press("Escape");

      await expectCollapsed(drawer);
      await expect(title).toBeFocused();
    });

    test("clears the search when it collapses", async ({ page }) => {
      const drawer = getNavigationMenu(page);
      await expandByMouse(page, drawer);
      await getNavigationMenuSearch(page).fill("Configurações");
      await expect(drawer.getByRole("link", { name: "Início" })).not.toBeAttached();

      // The focus in the search field would keep it expanded
      await getNavigationMenuSearch(page).blur();
      await page.mouse.move(1000, 600);
      await expectCollapsed(drawer);

      await expect(getNavigationMenuSearch(page)).toHaveValue("");
      await expect(drawer.getByRole("link", { name: "Início" })).toBeVisible();
    });

    test("opens the groups with a match while searching, and closes them again when it's cleared", async ({
      page,
    }) => {
      const drawer = getNavigationMenu(page);
      const group = drawer.getByRole("button", { name: "Documentação" });
      await expandByMouse(page, drawer);
      await expect(group).toHaveAttribute("aria-expanded", "false");

      await getNavigationMenuSearch(page).fill("comp");

      await expect(group).toHaveAttribute("aria-expanded", "true");
      await expect(drawer.getByRole("link", { name: "Componentes" })).toBeVisible();
      await expect(drawer.getByRole("link", { name: "Composables" })).toBeVisible();

      await getNavigationMenuSearch(page).clear();

      await expect(group).toHaveAttribute("aria-expanded", "false");
      await expect(drawer.getByRole("link", { name: "Componentes" })).toBeHidden();
    });

    test("highlights the group of the current page while collapsed, and the page while expanded", async ({
      page,
    }) => {
      const drawer = getNavigationMenu(page);
      const group = drawer.getByRole("button", { name: "Documentação" });
      const link = drawer.getByRole("link", { name: "Componentes" });
      await openComponentsPage(page);

      await expectCollapsed(drawer);
      await expect(group).toContainClass("v-list-item--active");
      await expect(link).toBeHidden();
      // Highlighted like the other items, which Vuetify doesn't do for a group's header by default
      const groupHighlight = await getOverlayOpacity(group);
      expect(groupHighlight).toBeGreaterThan(0);

      await expandByMouse(page, drawer);

      // The group of the current page opens on its own
      await expect(link).toBeVisible();
      await expect(link).toContainClass("v-list-item--active");
      await expect(group).toHaveAttribute("aria-expanded", "true");
      await expect(group).not.toContainClass("v-list-item--active");
      expect(await getOverlayOpacity(link)).toBe(groupHighlight);
    });

    test("keeps the item highlighted on a page below its route's path, opened in a dialog", async ({
      page,
    }) => {
      const drawer = getNestedPageNavigationMenu(page);
      const group = drawer.getByRole("button", { name: "Documentação" });
      const link = drawer.getByRole("link", { name: "Componentes" });
      const home = drawer.getByRole("link", { name: "Início" });
      const dialog = getNestedPageDialog(page);
      await expect(group).not.toContainClass("v-list-item--active");

      await getNestedPageNewButton(page).click();

      await expect(dialog).toBeVisible();
      await expectCollapsed(drawer);
      await expect(group).toContainClass("v-list-item--active");
      // The root's item is only highlighted on its own page
      await expect(home).not.toContainClass("v-list-item--active");
      await expect(home).not.toHaveAttribute("aria-current");
      await expectNoA11yViolations(page);

      // The dialog's overlay covers the menu, so the mouse can't expand it: the event the mouse would
      // fire expands it behind the dialog
      await drawer.dispatchEvent("mouseenter");
      await expectExpanded(drawer);
      await expect(link).toContainClass("v-list-item--active");
      await expect(link).toHaveAttribute("aria-current", "page");
      await expect(group).toHaveAttribute("aria-expanded", "true");
    });

    test("closes the groups when it collapses", async ({ page }) => {
      const drawer = getNavigationMenu(page);
      const group = drawer.getByRole("button", { name: "Documentação" });
      await expandByMouse(page, drawer);
      await group.click();
      await expect(group).toHaveAttribute("aria-expanded", "true");

      await page.mouse.move(1000, 600);

      await expectCollapsed(drawer);
      await expect(group).toHaveAttribute("aria-expanded", "false");
      await expect(drawer.getByRole("link", { name: "Componentes" })).toBeHidden();
    });

    test("moves through every item with Tab, including a group's items, and back with Shift+Tab", async ({
      page,
    }) => {
      const drawer = getNavigationMenu(page);
      const search = getNavigationMenuSearch(page);
      const focused = page.locator(":focus");
      const items = ["Início", "Documentação", "Componentes", "Composables", "Configurações"];
      await expandByMouse(page, drawer);
      await drawer.getByRole("button", { name: "Documentação" }).click();
      await search.focus();

      for (const item of items) {
        await page.keyboard.press("Tab");
        await expect(focused).toHaveText(item);
      }

      for (const item of items.toReversed().slice(1)) {
        await page.keyboard.press("Shift+Tab");
        await expect(focused).toHaveText(item);
      }
      await page.keyboard.press("Shift+Tab");
      await expect(search).toBeFocused();
    });

    test("skips the items of a closed group with Tab, and keeps the arrow keys", async ({
      page,
    }) => {
      const drawer = getNavigationMenu(page);
      const focused = page.locator(":focus");
      await expandByMouse(page, drawer);
      await getNavigationMenuSearch(page).focus();

      for (const item of ["Início", "Documentação", "Configurações"]) {
        await page.keyboard.press("Tab");
        await expect(focused).toHaveText(item);
      }

      await page.keyboard.press("ArrowUp");
      await expect(focused).toHaveText("Documentação");
    });
  });

  test.describe("navigation drawer below the mobile breakpoint", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await expect(getNavigationToggleButton(page)).toBeVisible();
    });

    // Measured with the mouse and the focus away from the field, which raise its underline
    test("keeps the search's placeholder and underline above WCAG AA's minimum contrast", async ({
      page,
    }) => {
      await getNavigationToggleButton(page).click();
      await expect(getNavigationToggleDrawer(page)).toContainClass("v-navigation-drawer--active");

      const { placeholder, underline } = await getFieldContrast(getNavigationMenuSearch(page));

      expect(placeholder).toBeGreaterThanOrEqual(4.5);
      expect(underline).toBeGreaterThanOrEqual(3);
    });

    test("toggles drawer visibility with nav icon", async ({ page }) => {
      const button = getNavigationToggleButton(page);
      const drawer = getNavigationToggleDrawer(page);

      await expect(drawer).not.toContainClass("v-navigation-drawer--active");
      await expect(drawer).not.toContainClass("v-navigation-drawer--rail");

      await button.click();
      await expect(drawer).toContainClass("v-navigation-drawer--active");
      await expect(getNavigationMenuSearch(page)).toBeVisible();

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

    test("closes the drawer opened by its button with Escape", async ({ page }) => {
      await getNavigationToggleButton(page).click();
      await getNavigationMenu(page).getByRole("link", { name: "Início" }).focus();

      await page.keyboard.press("Escape");

      await expect(getNavigationToggleDrawer(page)).not.toContainClass(
        "v-navigation-drawer--active",
      );
    });

    test("closes the drawer with a click outside it", async ({ page }) => {
      await getNavigationToggleButton(page).click();
      await expect(getNavigationToggleDrawer(page)).toContainClass("v-navigation-drawer--active");

      await getNavigationToggleDemo(page).locator(".v-navigation-drawer__scrim").click();

      await expect(getNavigationToggleDrawer(page)).not.toContainClass(
        "v-navigation-drawer--active",
      );
    });

    test("opens the drawer with the shortcut and closes it with Escape", async ({ page }) => {
      const title = page.getByTestId("root-playground-title").locator("input");
      await title.focus();

      await title.press("ControlOrMeta+k");
      await expect(getNavigationToggleDrawer(page)).toContainClass("v-navigation-drawer--active");
      await expect(getNavigationMenuSearch(page)).toBeFocused();

      await page.keyboard.press("Escape");

      await expect(getNavigationToggleDrawer(page)).not.toContainClass(
        "v-navigation-drawer--active",
      );
      await expect(title).toBeFocused();
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

    test("turns back into a collapsed rail above the mobile breakpoint", async ({ page }) => {
      await getNavigationToggleButton(page).click();

      await page.setViewportSize({ width: 1280, height: 720 });
      await page.mouse.move(1000, 600);

      await expect(getNavigationToggleButton(page)).not.toBeAttached();
      await expectCollapsed(getNavigationMenu(page));
    });
  });

  // `ControlOrMeta` is Control on the Linux runners and ⌘ on macOS, as the shortcut itself
  test.describe("navigation-menu shortcut", () => {
    const shortcut = "ControlOrMeta+k";

    test("shows the shortcut in the search placeholder and keeps its name", async ({ page }) => {
      const userAgent = await page.evaluate(() => navigator.userAgent);
      const keys = userAgent.includes("Macintosh") ? "⌘K" : "Ctrl+K";
      const search = getNavigationMenuSearch(page);
      // The collapsed menu hides the field
      await expandByMouse(page, getNavigationMenu(page));

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
      await expect(
        getNavigationMenu(page).getByRole("button", {
          name: "Buscar",
          exact: true,
          includeHidden: true,
        }),
      ).toHaveAttribute(
        "aria-keyshortcuts",
        userAgent.includes("Macintosh") ? "Meta+K" : "Control+K",
      );
    });

    test("opens only the first navigation menu and focuses its search", async ({ page }) => {
      await page.keyboard.press(shortcut);

      await expectExpanded(getNavigationToggleDrawer(page));
      await expect(getNavigationMenuSearch(page)).toBeFocused();
      await expectCollapsed(getLoadingNavigationMenu(page));
      await expectCollapsed(getPlaygroundNavigationMenu(page));
      // The docs search, which also answers Ctrl+K, stays closed
      await expect(getDocsSearch(page)).not.toBeAttached();
    });

    test("selects the search text when the shortcut is pressed again", async ({ page }) => {
      const search = getNavigationMenuSearch(page);
      await page.keyboard.press(shortcut);
      await search.fill("Início");
      await search.press("End");

      await page.keyboard.press(shortcut);

      await expectExpanded(getNavigationToggleDrawer(page));
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

      await expectExpanded(getNavigationToggleDrawer(page));
      await expect(getNavigationMenuSearch(page)).toBeFocused();
      await expect(title).toHaveValue("Novo título");
      await expect(getDocsSearch(page)).not.toBeAttached();
    });

    test("leaves the shortcut to the page inside a menu", async ({ page }) => {
      await getUserButton(page).click();
      const link = getUserMenu(page).getByRole("link", { name: "GitHub NEXDOM" });
      await link.focus();

      await link.press(shortcut);

      await expectCollapsed(getNavigationToggleDrawer(page));
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

      await expectCollapsed(getNavigationToggleDrawer(page));
      await expect(getDocsSearch(page)).toBeVisible();
    });

    test("collapses the navigation menu with Escape and gives the focus back", async ({ page }) => {
      const title = page.getByTestId("root-playground-title").locator("input");
      await title.focus();
      await title.press(shortcut);
      await expect(getNavigationMenuSearch(page)).toBeFocused();

      await page.keyboard.press("Escape");

      await expectCollapsed(getNavigationToggleDrawer(page));
      await expect(title).toBeFocused();
    });

    test("collapses the navigation menu after navigating from its search", async ({ page }) => {
      // Starts on another page, so the link to "Início" navigates
      await openComponentsPage(page);
      const title = page.getByTestId("root-playground-title").locator("input");
      await title.focus();
      await title.press(shortcut);
      await getNavigationMenuSearch(page).fill("Início");

      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");

      await expectCollapsed(getNavigationToggleDrawer(page));
      await expect(title).toBeFocused();
    });

    test("expands the menu again with the shortcut after Escape", async ({ page }) => {
      await page.keyboard.press(shortcut);
      await page.keyboard.press("Escape");
      await expectCollapsed(getNavigationToggleDrawer(page));

      await page.keyboard.press(shortcut);

      await expectExpanded(getNavigationToggleDrawer(page));
      await expect(getNavigationMenuSearch(page)).toBeFocused();
    });

    test("keeps the docs search on the slash key", async ({ page }) => {
      await page.keyboard.press("/");

      await expect(getDocsSearch(page)).toBeVisible();
      await expectCollapsed(getNavigationToggleDrawer(page));
    });
  });

  test.describe("loading demo", () => {
    test("shows a skeleton in place of the app bar actions", async ({ page }) => {
      const appBar = getLoadingAppBar(page);

      await expect(appBar).toHaveAttribute("aria-busy", "true");
      await expect(appBar.locator(".v-skeleton-loader")).toBeVisible();
      await expectLoadingAnnouncement(appBar.locator(".v-skeleton-loader"), 1);
      await expect(page.getByTestId("demo-root-loading-app-bar-help")).not.toBeAttached();
      await expect(page.getByTestId("demo-root-loading-app-bar-notifications")).not.toBeAttached();
      await expect(page.getByTestId("demo-root-loading-app-bar-user")).not.toBeAttached();
      // Above the mobile breakpoint, the menu is a rail instead of the button's drawer
      await expect(getLoadingNavigationButton(page)).not.toBeAttached();
      await expect(appBar).toContainText("Menu superior");
    });

    test("shows skeleton items and a disabled search item in the collapsed rail", async ({
      page,
    }) => {
      const navigationMenu = getLoadingNavigationMenu(page);

      await expectCollapsed(navigationMenu);
      await expect(navigationMenu).toHaveAttribute("aria-busy", "true");
      await expect(navigationMenu.locator(".v-skeleton-loader")).toBeVisible();
      await expect(
        navigationMenu.getByRole("button", { name: "Buscar", exact: true }),
      ).toBeDisabled();
    });

    test("expands the navigation menu with skeleton items and a disabled search", async ({
      page,
    }) => {
      const navigationMenu = getLoadingNavigationMenu(page);
      await expandByMouse(page, navigationMenu);

      await expect(navigationMenu).toHaveAttribute("aria-busy", "true");
      await expect(navigationMenu.locator(".v-skeleton-loader")).toBeVisible();
      await expectLoadingAnnouncement(navigationMenu.locator(".v-skeleton-loader"), 1);
      await expect(navigationMenu.getByText("Início")).not.toBeAttached();
      await expect(
        page.getByTestId("demo-root-loading-navigation-menu-search").locator("input"),
      ).toBeDisabled();
    });

    test("matches the accessible snapshot of the loading demo", async ({ page }) => {
      await expectCollapsed(getLoadingNavigationMenu(page));

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

  test.describe("back to top demo", () => {
    test("is hidden while the top of the demo is in view", async ({ page }) => {
      await getBackToTopDemo(page).scrollIntoViewIfNeeded();
      await expect(getBackToTopDemo(page).locator(".v-fab .v-btn")).toBeHidden();
    });

    test("shows once the page scrolls past a screen of the demo, and hides back at its top", async ({
      page,
    }) => {
      await scrollToBackToTopDemoEnd(page);
      await expect(getBackToTopButton(page)).toBeVisible();

      await getBackToTopDemo(page).evaluate((demo) => demo.scrollIntoView());

      await expect(getBackToTopDemo(page).locator(".v-fab .v-btn")).toBeHidden();
    });

    test("is named for screen readers, without a visible text", async ({ page }) => {
      await scrollToBackToTopDemoEnd(page);

      await expect(getBackToTopButton(page)).toHaveAccessibleName("Retornar ao topo");
      await expect(getBackToTopButton(page).getByText("Retornar ao topo")).toHaveClass("d-sr-only");
    });

    test("sits at the bottom end of the demo, above the footer", async ({ page }) => {
      await scrollToBackToTopDemoEnd(page);
      await waitForAnimations(page);

      const demo = await getBox(getBackToTopDemo(page));
      const button = await getBox(getBackToTopButton(page));
      const footer = await getBox(getBackToTopFooter(page));

      expect(button.y + button.height).toBeLessThanOrEqual(footer.y);
      expect(button.x + button.width).toBeGreaterThan(demo.x + demo.width - 100);
    });

    test("scrolls back to the top of the content and focuses it on click", async ({ page }) => {
      await scrollToBackToTopDemoEnd(page);

      await getBackToTopButton(page).click();

      // Within a pixel, since the page's scroll can stop at a fraction of a pixel
      await expect
        .poll(async () => Math.abs(await getTopInViewport(getBackToTopContent(page))))
        .toBeLessThanOrEqual(1);
      await expect(getBackToTopContent(page)).toBeFocused();
      await expect(getBackToTopDemo(page).locator(".v-fab .v-btn")).toBeHidden();
    });

    test("scrolls back instantly with the keyboard when the user prefers reduced motion", async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await scrollToBackToTopDemoEnd(page);

      await getBackToTopButton(page).press("Enter");

      expect(Math.abs(await getTopInViewport(getBackToTopContent(page)))).toBeLessThanOrEqual(1);
      await expect(getBackToTopContent(page)).toBeFocused();
    });
  });

  test.describe("background demo", () => {
    test("colors the background of the app and the text placed on it", async ({ page }) => {
      const app = getBackgroundApp(page);

      await expect(app).toContainClass("bg-primary");
      await expect(app).toHaveCSS("background-color", "rgb(7, 77, 49)");
      await expect(app.getByRole("heading", { level: 2 })).toHaveCSS("color", "rgb(252, 252, 253)");
    });

    test("keeps the background of the app bar", async ({ page }) => {
      const defaultAppBar = getLogoDemo(page).locator(".v-app-bar");
      const defaultBackground = await defaultAppBar.evaluate(
        (element) => getComputedStyle(element).backgroundColor,
      );

      await expect(getBackgroundAppBar(page)).toHaveCSS("background-color", defaultBackground);
      expect(defaultBackground).not.toBe("rgb(7, 77, 49)");
    });

    test("matches the accessible snapshot of the background demo", async ({ page }) => {
      await expect(getBackgroundDemo(page)).toMatchAriaSnapshot();
    });
  });

  test.describe("playground", () => {
    test("changes and clears the background when playground-background changes", async ({
      page,
    }) => {
      const preview = page.getByTestId("root-preview");
      await expect(preview).not.toHaveClass(backgroundClass);

      await selectOption(page, "root-playground-background", "danger");
      await expect(preview).toContainClass("bg-error");

      await selectOption(page, "root-playground-background", "positive");
      await expect(preview).toContainClass("bg-success");
      await expect(preview).not.toContainClass("bg-error");

      await selectOption(page, "root-playground-background", "Padrão");
      await expect(preview).not.toHaveClass(backgroundClass);
    });

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

      await expandByMouse(page, navigationMenu);
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
  });

  test.describe("fonts", () => {
    test("loads the text font with font-display swap, and no icon font", async ({ page }) => {
      await expect(getHelpButton(page)).toBeVisible();

      const fonts = await page.evaluate(() =>
        Array.from(document.fonts, (font) => ({
          family: font.family.replaceAll('"', ""),
          display: font.display,
        })),
      );
      const families = new Set(fonts.map(({ family }) => family));
      const faces = fonts.filter(({ family }) => family === "Unimed Slab");

      expect(families).not.toContain("Material Design Icons");
      expect(faces).not.toHaveLength(0);
      expect(faces.every(({ display }) => display === "swap")).toBe(true);
    });
  });

  test.describe("accessibility", () => {
    test("has no violations", async ({ page }) => {
      await expectNoA11yViolations(page);
    });

    test("has no violations with the menus open", async ({ page }) => {
      await getUserButton(page).click();
      await expect(getUserMenu(page)).toBeVisible();
      await expectNoA11yViolations(page);
      await page.keyboard.press("Escape");

      await getNotificationsButton(page).click();
      await expect(getNotificationsMenu(page)).toBeVisible();
      await expectNoA11yViolations(page);
      await page.keyboard.press("Escape");

      await expandByMouse(page, getNavigationMenu(page));
      await expectNoA11yViolations(page);
    });

    test("has no violations with the group of the current page highlighted", async ({ page }) => {
      await openComponentsPage(page);
      await expect(
        getNavigationMenu(page).getByRole("button", { name: "Documentação" }),
      ).toContainClass("v-list-item--active");
      await expectNoA11yViolations(page);

      await expandByMouse(page, getNavigationMenu(page));
      await expect(
        getNavigationMenu(page).getByRole("link", { name: "Componentes" }),
      ).toContainClass("v-list-item--active");
      await expectNoA11yViolations(page);
    });

    test("has no violations with the drawer open below the mobile breakpoint", async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await getNavigationToggleButton(page).click();
      await expect(getNavigationToggleDrawer(page)).toContainClass("v-navigation-drawer--active");
      await expectNoA11yViolations(page);
    });

    test("has no violations with the menu of the user without picture open", async ({ page }) => {
      await getUserInitialsButton(page).click();
      await expect(getUserInitialsMenu(page)).toBeVisible();
      await expectNoA11yViolations(page);
    });

    test("has no violations with the back-to-top button shown", async ({ page }) => {
      await scrollToBackToTopDemoEnd(page);
      await expect(getBackToTopButton(page)).toBeVisible();
      await expectNoA11yViolations(page);
    });

    test("has no violations with the menu of the user details open", async ({ page }) => {
      await getUserDetailsButton(page).click();
      await expect(getUserDetailsMenu(page)).toBeVisible();
      await expectNoA11yViolations(page);
    });
  });

  test.describe("UI consistency", () => {
    // Each state builds on the previous one, as a user would reach it, with one full-page screenshot
    // per test, so each test fits in the default timeout. The page is long enough that capturing it
    // takes longer than the assertion's default 5s when the specs run in parallel
    const fullPageScreenshot = { fullPage: true, timeout: 15_000 };

    test("matches last screenshot after choosing a user menu option", async ({ page }) => {
      await chooseUserMenuOption(page);
      await expect(page).toHaveScreenshot(fullPageScreenshot);
    });

    test("matches last screenshot with the notifications menu open", async ({ page }) => {
      await chooseUserMenuOption(page);
      await openNotificationsMenu(page);
      await expect(page).toHaveScreenshot(fullPageScreenshot);
    });

    test("matches last screenshot after closing the notifications menu", async ({ page }) => {
      await chooseUserMenuOption(page);
      await openNotificationsMenu(page);
      await page.keyboard.press("Escape");
      await expect(page).toHaveScreenshot(fullPageScreenshot);
    });

    test("matches last screenshot of the collapsed navigation rail", async ({ page }) => {
      await expectCollapsed(getNavigationMenu(page));
      await expectDemoScreenshot(page, getNavigationToggleDemo(page));
    });

    test("matches last screenshot of the navigation rail expanded by the mouse", async ({
      page,
    }) => {
      await getNavigationToggleDemo(page).scrollIntoViewIfNeeded();
      await expandByMouse(page, getNavigationMenu(page));
      await expectDemoScreenshot(page, getNavigationToggleDemo(page));
    });

    test("matches last screenshot of the collapsed navigation rail with the current page's group", async ({
      page,
    }) => {
      await openComponentsPage(page);
      await expectDemoScreenshot(page, getNavigationToggleDemo(page));
    });

    test("matches last screenshot with the navigation drawer open below the mobile breakpoint", async ({
      page,
    }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await getNavigationToggleButton(page).click();
      await expect(getNavigationToggleDrawer(page)).toContainClass("v-navigation-drawer--active");
      await expectDemoScreenshot(page, getNavigationToggleDemo(page));
    });

    test("matches last screenshot of the footer demo", async ({ page }) => {
      await expect(getFooter(page)).toBeVisible();
      // The demo is as tall as the viewport, so the docs' fixed navigation bar would cover its top
      await page.addStyleTag({ content: ".VPNav { visibility: hidden; }" });
      await expect(getFooterDemo(page)).toHaveScreenshot();
    });

    test("matches last screenshot of the back-to-top button above the footer", async ({ page }) => {
      await scrollToBackToTopDemoEnd(page);
      await expect(getBackToTopButton(page)).toBeVisible();
      await waitForAnimations(page);
      await page.addStyleTag({ content: ".VPNav, .VPLocalNav { visibility: hidden; }" });
      // The demo is taller than the viewport, so only its end, with the button, is in view
      await expect(page).toHaveScreenshot();
    });

    test("matches last screenshot of the background demo", async ({ page }) => {
      await expect(getBackgroundApp(page)).toContainClass("bg-primary");
      // The demo is as tall as the viewport, so the docs' fixed navigation bar would cover its top
      await page.addStyleTag({ content: ".VPNav { visibility: hidden; }" });
      await expect(getBackgroundDemo(page)).toHaveScreenshot();
    });

    test("matches last screenshot of the open user details menu", async ({ page }) => {
      await getUserDetailsButton(page).click();
      await expect(getUserDetailsMenu(page)).toBeVisible();
      // The menu grows from the button while it opens
      await waitForAnimations(page);
      await expect(getUserDetailsMenu(page)).toHaveScreenshot();
    });

    test("matches last screenshot of the loading demo with its navigation rail collapsed", async ({
      page,
    }) => {
      await expectCollapsed(getLoadingNavigationMenu(page));
      await expectDemoScreenshot(page, getLoadingDemo(page));
    });
  });
});

/** A viewport below the mobile breakpoint (1145px), where the navigation menu is a drawer. */
const MOBILE_VIEWPORT = { width: 1000, height: 720 };

async function expectCollapsed(drawer: Locator) {
  await expect(drawer).toContainClass("v-navigation-drawer--rail");
  await expect(drawer).not.toContainClass("v-navigation-drawer--is-hovering");
  await waitForAnimations(drawer.page());
  expect((await getBox(drawer)).width).toBe(56);
}

async function expectExpanded(drawer: Locator) {
  await expect(drawer).toContainClass("v-navigation-drawer--is-hovering");
  await waitForAnimations(drawer.page());
  expect((await getBox(drawer)).width).toBe(256);
}

/** Scrolls to the menu, aligned to the bottom so its top stays below the docs' fixed navigation bar. */
async function scrollToMenu(drawer: Locator) {
  await drawer.evaluate((element) => element.scrollIntoView({ block: "end" }));
}

/** Moves the mouse over the menu, away from its items, so none of them shows its hover state. */
async function expandByMouse(page: Page, drawer: Locator) {
  // Scrolling under the mouse would move it out of the menu
  await scrollToMenu(drawer);
  await drawer.hover({ position: { x: 28, y: 400 } });
  await expectExpanded(drawer);
}

/** Moves the keyboard focus forward, from the demo above, until it gets into the menu. */
async function tabInto(page: Page, drawer: Locator) {
  await page.getByTestId("demo-root-user-initials-app-bar-user").focus();
  for (let presses = 0; presses < 20; presses++) {
    await page.keyboard.press("Tab");
    if (await drawer.evaluate((element) => element.contains(document.activeElement))) return;
  }
  throw new Error("The focus should get into the navigation menu");
}

/** Navigates to the "Componentes" page, in the "Documentação" group, from the expanded menu. */
async function openComponentsPage(page: Page) {
  const drawer = getNavigationMenu(page);
  await expandByMouse(page, drawer);
  await drawer.getByRole("button", { name: "Documentação" }).click();
  // The group grows while it opens, moving the link
  await waitForAnimations(page);
  await drawer.getByRole("link", { name: "Componentes" }).click();
  await page.mouse.move(1000, 600);
  await expectCollapsed(drawer);
}

/**
 * Takes the screenshot of a demo with the docs' fixed navigation bars hidden (also the "Nesta
 * página" one of narrow screens), since the demo is as tall as the viewport and the bars would cover
 * its top. The demo must already be in view, as it is after expanding its menu: scrolling it under
 * the mouse would collapse the menu.
 */
async function expectDemoScreenshot(page: Page, demo: Locator) {
  await waitForAnimations(page);
  await page.addStyleTag({ content: ".VPNav, .VPLocalNav { visibility: hidden; }" });
  await expect(demo).toHaveScreenshot();
}

async function chooseUserMenuOption(page: Page) {
  await getUserButton(page).click();
  await getUserMenu(page).getByRole("button", { name: "Bibliotecas" }).click();
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

/** Opacity of a list item's highlight, the overlay Vuetify shows on the active items */
async function getOverlayOpacity(item: Locator) {
  const overlay = item.locator(".v-list-item__overlay");
  return Number(await overlay.evaluate((element) => getComputedStyle(element).opacity));
}

/**
 * Asserts two items of a menu have the same width and their titles' text starts at the same
 * distance from the item's start, once the menu finishes opening. The text is measured with a
 * `Range`, since a title's box can span the whole item while its text is centered in it.
 */
async function expectAlignedItems(page: Page, item: Locator, otherItem: Locator) {
  await expect(item).toBeVisible();
  await expect(otherItem).toBeVisible();
  await waitForAnimations(page);

  const measure = (locator: Locator) =>
    locator.evaluate((element) => {
      const title = element.querySelector(".v-list-item-title") as HTMLElement;
      const range = document.createRange();
      range.selectNodeContents(title);
      const box = element.getBoundingClientRect();
      return { width: box.width, textStart: range.getBoundingClientRect().left - box.left };
    });
  const [box, otherBox] = await Promise.all([measure(item), measure(otherItem)]);
  expect(Math.abs(box.width - otherBox.width)).toBeLessThan(1);
  expect(Math.abs(box.textStart - otherBox.textStart)).toBeLessThan(1);
}

/**
 * Asserts the open user menu shows the avatar bigger than the button's, centered at the top, with
 * the user's name and subtitle centered below it.
 */
async function expectCenteredUserMenuAvatar(page: Page, userButton: Locator, userMenu: Locator) {
  await expect(userMenu).toBeVisible();
  // The menu grows from the button while it opens, so its boxes are only final afterwards
  await waitForAnimations(page);

  const title = userMenu.locator(".v-card-title");
  const subtitle = userMenu.locator(".v-card-subtitle");
  await expect(title).toHaveCSS("text-align", "center");
  await expect(subtitle).toHaveCSS("text-align", "center");

  const [card, avatar, titleBox, buttonAvatar] = await Promise.all([
    getBox(userMenu),
    getBox(userMenu.locator(".v-avatar")),
    getBox(title),
    getBox(userButton.locator(".v-avatar")),
  ]);

  expect(Math.abs(avatar.x + avatar.width / 2 - (card.x + card.width / 2))).toBeLessThanOrEqual(1);
  expect(avatar.y + avatar.height).toBeLessThanOrEqual(titleBox.y);
  expect([avatar.width, avatar.height]).toEqual([56, 56]);
  expect([buttonAvatar.width, buttonAvatar.height]).toEqual([40, 40]);
}

function getBackgroundDemo(page: Page) {
  return page.getByTestId("demo-root-background");
}

function getBackgroundApp(page: Page) {
  return page.getByTestId("root-demo-background");
}

function getBackgroundAppBar(page: Page) {
  return page.getByTestId("demo-root-background-app-bar");
}

function getBackToTopDemo(page: Page) {
  return page.getByTestId("demo-root-back-to-top");
}

function getBackToTopButton(page: Page) {
  return getBackToTopDemo(page).getByRole("button", { name: "Retornar ao topo" });
}

function getBackToTopContent(page: Page) {
  return getBackToTopDemo(page).locator("main.v-main");
}

function getBackToTopFooter(page: Page) {
  return page.getByTestId("demo-root-back-to-top-footer");
}

/** Scrolls the page until the end of the back-to-top demo, more than a screen below its top. */
async function scrollToBackToTopDemoEnd(page: Page) {
  await getBackToTopDemo(page).evaluate((demo) => demo.scrollIntoView({ block: "end" }));
}

/** Distance from the top of the viewport to the top of `locator`. */
function getTopInViewport(locator: Locator) {
  return locator.evaluate((element) => element.getBoundingClientRect().top);
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

  // Both boxes sit at fractional positions, whose rounding can put the text a few hundred-thousandths
  // of a pixel past the box (e.g. 432.78802 against 432.78799) depending on where the menu opens,
  // while a clipped line overflows by whole pixels
  const tolerance = 0.01;
  expect(text.top).toBeGreaterThanOrEqual(box.top - tolerance);
  expect(text.bottom).toBeLessThanOrEqual(box.bottom + tolerance);
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

function getUserInitialsDemo(page: Page) {
  return page.getByTestId("demo-root-user-initials");
}

function getUserInitialsButton(page: Page) {
  return page.getByTestId("demo-root-user-initials-app-bar-user");
}

function getUserInitialsMenu(page: Page) {
  return page.getByTestId("demo-root-user-initials-app-bar-user-menu");
}

function getUserDetailsButton(page: Page) {
  return page.getByTestId("demo-root-user-details-app-bar-user");
}

function getUserDetailsMenu(page: Page) {
  return page.getByTestId("demo-root-user-details-app-bar-user-menu");
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

function getNestedPageNavigationMenu(page: Page) {
  return page.getByTestId("demo-root-nested-page-navigation-menu");
}

function getNestedPageNewButton(page: Page) {
  return page.getByTestId("demo-root-nested-page-new");
}

function getNestedPageDialog(page: Page) {
  return page.getByRole("dialog", { name: "Novo componente" });
}

function getNavigationMenuSearch(page: Page) {
  return page.getByTestId("demo-root-navigation-toggle-navigation-menu-search").locator("input");
}
