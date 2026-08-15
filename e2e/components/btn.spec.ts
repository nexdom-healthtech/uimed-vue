import { test, expect, type Page } from "@playwright/test";

const gotoPlayground = async (page: Page) => {
  await page.goto("guide/components/btn");
  return page.getByTestId("btn-playground");
};

const selectOption = async (page: Page, testId: string, option: string) => {
  await page.getByTestId(testId).locator("input").click({ force: true });
  await page.getByRole("option", { name: option, exact: true }).click();
};

test.describe("btn playground", () => {
  test("updates the variant when the Variante select changes", async ({ page }) => {
    const playground = await gotoPlayground(page);
    const previewButton = playground.getByTestId("btn-playground-preview").locator(".v-btn");

    await expect(previewButton).toHaveClass(/v-btn--variant-elevated/);

    await selectOption(page, "btn-playground-variant", "ghost");

    await expect(previewButton).toHaveClass(/v-btn--variant-outlined/);
  });

  test("updates the label text when the Rótulo field changes", async ({ page }) => {
    const playground = await gotoPlayground(page);
    const previewButton = playground.getByTestId("btn-playground-preview").locator(".v-btn");

    await page.getByTestId("btn-playground-label").locator("input").fill("Confirmar");

    await expect(previewButton).toContainText("Confirmar");
  });

  test("updates the color when the Cor select changes", async ({ page }) => {
    const playground = await gotoPlayground(page);
    const previewButton = playground.getByTestId("btn-playground-preview").locator(".v-btn");

    await expect(previewButton).toHaveClass(/bg-primary/);

    await selectOption(page, "btn-playground-color", "danger");

    await expect(previewButton).toHaveClass(/bg-error/);
  });

  test("disables the button when the Desabilitado switch is toggled", async ({ page }) => {
    const playground = await gotoPlayground(page);
    const previewButton = playground.getByTestId("btn-playground-preview").locator(".v-btn");

    await expect(previewButton).toBeEnabled();

    await page.getByTestId("btn-playground-disabled").locator("input").click();

    await expect(previewButton).toBeDisabled();
    await expect(previewButton).toMatchAriaSnapshot();
  });

  test("matches the accessible snapshot of the preview button in its default state", async ({
    page,
  }) => {
    const playground = await gotoPlayground(page);
    const previewButton = playground.getByTestId("btn-playground-preview").locator(".v-btn");

    await expect(previewButton).toMatchAriaSnapshot();
  });
});

test.describe("btn events demo", () => {
  test("increments the click counter and blocks clicks while disabled", async ({ page }) => {
    await page.goto("guide/components/btn");

    const demo = page.getByTestId("btn-demo-click");
    const clickButton = demo.getByRole("button", { name: "Me clique" });

    await expect(demo).toContainText("0 clique(s)");

    await clickButton.click();
    await clickButton.click();

    await expect(demo).toContainText("2 clique(s)");
  });

  test("matches the accessible snapshot of the click demo", async ({ page }) => {
    await page.goto("guide/components/btn");

    const demo = page.getByTestId("btn-demo-click");

    await expect(demo).toMatchAriaSnapshot();
  });
});
