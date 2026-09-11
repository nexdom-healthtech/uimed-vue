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
    });
  });
});

function getAppBar(page: Page) {
  return page.getByTestId("demo-root-app-bar");
}

function getHelpButton(page: Page) {
  return page.getByTestId("demo-root-app-bar-help");
}

function getUserButton(page: Page) {
  return page.getByTestId("demo-root-app-bar-user");
}

function getUserMenu(page: Page) {
  return page.getByTestId("demo-root-app-bar-user-menu");
}
