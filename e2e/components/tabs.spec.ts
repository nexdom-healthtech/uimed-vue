import { test, expect, type Page } from "@playwright/test";
import { expectNoA11yViolations, gotoPage, waitForAnimations } from "@e2e/utils.ts";

test.describe("tabs", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/tabs");
  });

  test.describe("demos", () => {
    test("selects the first tab and shows its content when the v-model is empty", async ({
      page,
    }) => {
      const tabs = page.getByTestId("demo-tabs-basic");
      const content = page.getByTestId("demo-tabs-basic-content");

      await expect(tabs.getByRole("tab", { name: "Dados pessoais" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      await expect(content.getByRole("tabpanel")).toHaveText(
        "Nome, data de nascimento e documentos",
      );
      await expect(page.getByTestId("demo-tabs-basic-value")).toHaveText("Aba selecionada: dados");
    });

    test("shows the content of a tab when it's clicked, hiding the previous one", async ({
      page,
    }) => {
      const tabs = page.getByTestId("demo-tabs-basic");
      const content = page.getByTestId("demo-tabs-basic-content");

      await tabs.getByRole("tab", { name: "Endereço" }).click();

      await expect(tabs.getByRole("tab", { name: "Endereço" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      await expect(tabs.getByRole("tab", { name: "Dados pessoais" })).toHaveAttribute(
        "aria-selected",
        "false",
      );
      await expect(content.getByText("Rua, número, bairro e CEP")).toBeVisible();
      await expect(content.getByText("Nome, data de nascimento e documentos")).toBeHidden();
      await expect(page.getByTestId("demo-tabs-basic-value")).toHaveText(
        "Aba selecionada: endereco",
      );
    });

    test("moves the focus with the arrow keys, Home and End, and selects with Enter or Space", async ({
      page,
    }) => {
      const tabs = page.getByTestId("demo-tabs-basic");
      const data = tabs.getByRole("tab", { name: "Dados pessoais" });
      const address = tabs.getByRole("tab", { name: "Endereço" });
      const contact = tabs.getByRole("tab", { name: "Contato" });
      const content = page.getByTestId("demo-tabs-basic-content");

      await data.focus();
      await page.keyboard.press("ArrowRight");
      await expect(address).toBeFocused();
      // Moving the focus doesn't select the tab
      await expect(data).toHaveAttribute("aria-selected", "true");
      await expect(address).toHaveAttribute("aria-selected", "false");

      await page.keyboard.press("End");
      await expect(contact).toBeFocused();
      await page.keyboard.press("Home");
      await expect(data).toBeFocused();
      // From the first tab, the left arrow goes around to the last one
      await page.keyboard.press("ArrowLeft");
      await expect(contact).toBeFocused();

      await page.keyboard.press("Enter");
      await expect(contact).toHaveAttribute("aria-selected", "true");
      await expect(content.getByText("Telefone e e-mail")).toBeVisible();

      await page.keyboard.press("ArrowLeft");
      await expect(address).toBeFocused();
      await page.keyboard.press("Space");
      await expect(address).toHaveAttribute("aria-selected", "true");
      await expect(content.getByText("Rua, número, bairro e CEP")).toBeVisible();
      await expect(content.getByText("Telefone e e-mail")).toBeHidden();
    });

    test("pairs the tabs without value with their contents by position", async ({ page }) => {
      const tabs = page.getByTestId("demo-tabs-index");
      const content = page.getByTestId("demo-tabs-index-content");
      const value = page.getByTestId("demo-tabs-index-value");

      await expect(tabs.getByRole("tab", { name: "Próximas" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      await expect(content.getByText("Consultas agendadas para os próximos dias")).toBeVisible();
      await expect(value).toHaveText("Aba selecionada: 0");

      await tabs.getByRole("tab", { name: "Realizadas" }).click();

      await expect(content.getByText("Consultas já realizadas")).toBeVisible();
      await expect(content.getByText("Consultas agendadas para os próximos dias")).toBeHidden();
      await expect(value).toHaveText("Aba selecionada: 1");
    });

    test("scrolls the tabs that don't fit with the arrows on the sides", async ({ page }) => {
      const tabs = page.getByTestId("demo-tabs-many");
      const prev = tabs.locator(".v-slide-group__prev");
      const next = tabs.locator(".v-slide-group__next");
      const container = tabs.locator(".v-slide-group__container");
      const december = tabs.getByRole("tab", { name: "Dezembro" });

      await expect(prev).toBeVisible();
      await expect(next).toBeVisible();
      await expect(prev).toContainClass("v-slide-group__prev--disabled");
      await expect(december).not.toBeInViewport();

      await next.click();

      await expect(prev).not.toContainClass("v-slide-group__prev--disabled");
      await expect
        .poll(() => container.evaluate((element) => element.scrollLeft))
        .toBeGreaterThan(0);

      await december.click();
      await expect(december).toHaveAttribute("aria-selected", "true");
      await expect(
        page.getByTestId("demo-tabs-many-content").getByText("Consultas de Dezembro"),
      ).toBeVisible();
    });

    test("hides the scroll arrows on screens narrower than 1145px", async ({ page }) => {
      const tabs = page.getByTestId("demo-tabs-many");

      await page.setViewportSize({ width: 1144, height: 720 });
      await expect(tabs.locator(".v-slide-group__next")).toHaveCount(0);

      await page.setViewportSize({ width: 1145, height: 720 });
      await expect(tabs.locator(".v-slide-group__next")).toBeVisible();
    });

    test("matches the accessible snapshot of the basic demo", async ({ page }) => {
      await expect(getBasicDemo(page)).toMatchAriaSnapshot();
    });
  });

  test.describe("accessibility", () => {
    test("has no violations", async ({ page }) => {
      await expectNoA11yViolations(page);
    });

    test("has no violations after selecting another tab", async ({ page }) => {
      await page.getByTestId("demo-tabs-basic").getByRole("tab", { name: "Contato" }).click();
      await expect(
        page.getByTestId("demo-tabs-basic-content").getByText("Telefone e e-mail"),
      ).toBeVisible();
      await waitForAnimations(page);

      await expectNoA11yViolations(page);
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

function getBasicDemo(page: Page) {
  return page.locator(".demo").filter({ has: page.getByTestId("demo-tabs-basic") });
}
