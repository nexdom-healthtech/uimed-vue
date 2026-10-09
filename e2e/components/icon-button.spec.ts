import { test, expect, type Page } from "@playwright/test";
import { gotoPage, selectOption } from "@e2e/utils.ts";
import { iconToVuetifyIcon } from "@/consts/icons.ts";

test.describe("icon-button", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/icon-button");
  });

  test.describe("demos", () => {
    test("exposes each button by its label, with the icon hidden from screen readers", async ({
      page,
    }) => {
      const demo = page.getByTestId("demo-icon");
      const buttons = demo.getByRole("button");

      await expect(buttons).toHaveCount(3);
      for (const [index, name] of ["Início", "Agenda", "Configurações"].entries()) {
        await expect(buttons.nth(index)).toHaveAccessibleName(name);
        await expect(buttons.nth(index)).toHaveAttribute("type", "button");
      }
      await expect(buttons.nth(2).locator(".v-icon")).toContainClass(
        iconToVuetifyIcon["cog-alternative"],
      );
      await expect(buttons.nth(2).locator(".v-icon")).toHaveAttribute("aria-hidden", "true");
    });

    test("applies each color of the palette", async ({ page }) => {
      const buttons = page.getByTestId("demo-colors").getByRole("button");

      await expect(buttons).toHaveCount(6);
      for (const [index, color] of [
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "error",
      ].entries()) {
        await expect(buttons.nth(index)).toContainClass(`bg-${color}`);
      }
    });

    test("matches the accessible snapshot of the demos", async ({ page }) => {
      await expect(page.getByTestId("demo-icon")).toMatchAriaSnapshot();
      await expect(page.getByTestId("demo-colors")).toMatchAriaSnapshot();
    });
  });

  test.describe("events demo", () => {
    test("increments the counter on each click", async ({ page }) => {
      const counterText = page.getByTestId("icon-btn-demo-click-count");
      const button = page.getByRole("button", { name: "Adicionar paciente" });

      await expect(counterText).toHaveText("0 paciente(s)");

      await button.click();
      await button.click();

      await expect(counterText).toHaveText("2 paciente(s)");
    });

    test("is activated by the keyboard", async ({ page }) => {
      const counterText = page.getByTestId("icon-btn-demo-click-count");
      const button = page.getByTestId("icon-btn-demo-click");

      await button.focus();
      await page.keyboard.press("Enter");
      await page.keyboard.press("Space");

      await expect(button).toBeFocused();
      await expect(counterText).toHaveText("2 paciente(s)");
    });

    test("matches the accessible snapshot of the click demo", async ({ page }) => {
      await expect(page.getByTestId("demo-click-event")).toMatchAriaSnapshot();
    });
  });

  test.describe("playground", () => {
    test("updates the icon when playground-icon changes", async ({ page }) => {
      const icon = getPreviewButton(page).locator(".v-icon");
      await expect(icon).toContainClass(iconToVuetifyIcon.home);

      // The options far from the top are only rendered when typing or scrolling, so type first
      await page.getByTestId("icon-btn-playground-icon").locator("input:visible").fill("hosp");
      await page.getByRole("option", { name: "hospital", exact: true }).click();
      await expect(icon).toContainClass(iconToVuetifyIcon.hospital);
      await expect(icon).not.toContainClass(iconToVuetifyIcon.home);
    });

    test("updates the color when playground-color changes", async ({ page }) => {
      const previewButton = getPreviewButton(page);
      await expect(previewButton).toContainClass("bg-primary");

      await selectOption(page, "icon-btn-playground-color", "danger");
      await expect(previewButton).toContainClass("bg-error");
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

function getPreviewButton(page: Page) {
  return page.getByTestId("icon-btn-preview");
}
