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
