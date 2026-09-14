import { gotoPage } from "@e2e/utils.ts";
import { test, expect, type Page } from "@playwright/test";

test.describe("root", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/root");
    page.on("dialog", (dialog) => dialog.accept());
  });

  test.describe("props demo", () => {
    test.describe("app-bar", () => {
      test("matches the accessible snapshot of the app bar demo", async ({ page }) => {
        const demo = getAppBar(page);
        await expect(demo).toMatchAriaSnapshot();
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
  });

  test.describe("playground", () => {
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

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      const userButton = getUserButton(page);
      await userButton.click();

      const userMenu = getUserMenu(page);
      await userMenu.getByRole("listitem").first().click();
      await expect(page).toHaveScreenshot({ fullPage: true });

      const notificationsButton = getNotificationsButton(page);
      await notificationsButton.click();
      await expect(page).toHaveScreenshot({ fullPage: true });

      await page.keyboard.press("Escape");
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

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
