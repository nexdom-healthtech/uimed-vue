import { test, expect, type Page } from "@playwright/test";

const gotoPlayground = async (page: Page) => {
  await page.goto("guide/components/button");
  return page.locator(".btn-playground");
};

const selectOption = async (page: Page, label: string, option: string) => {
  await page.getByLabel(label, { exact: true }).click({ force: true });
  await page.getByRole("option", { name: option, exact: true }).click();
};

test.describe("button playground", () => {
  test("updates the variant when the Variante select changes", async ({ page }) => {
    const playground = await gotoPlayground(page);
    const previewButton = playground.locator(".btn-playground-preview .v-btn");

    await expect(previewButton).toHaveClass(/v-btn--variant-elevated/);

    await selectOption(page, "Variante", "outlined");

    await expect(previewButton).toHaveClass(/v-btn--variant-outlined/);
  });

  test("updates the label text when the Rótulo field changes", async ({ page }) => {
    const playground = await gotoPlayground(page);
    const previewButton = playground.locator(".btn-playground-preview .v-btn");

    await page.getByLabel("Rótulo", { exact: true }).fill("Confirmar");

    await expect(previewButton).toContainText("Confirmar");
  });

  test("switches to a custom color when Cor is set to Customizada", async ({ page }) => {
    const playground = await gotoPlayground(page);
    const previewButton = playground.locator(".btn-playground-preview .v-btn");

    await selectOption(page, "Cor", "Customizada");
    await page.getByLabel("Cor customizada (CSS)", { exact: true }).fill("#004f51");

    await expect(previewButton).toHaveCSS("background-color", "rgb(0, 79, 81)");
  });

  test("disables the button when the Desabilitado switch is toggled", async ({ page }) => {
    const playground = await gotoPlayground(page);
    const previewButton = playground.locator(".btn-playground-preview .v-btn");

    await expect(previewButton).toBeEnabled();

    await page.getByLabel("Desabilitado", { exact: true }).click();

    await expect(previewButton).toBeDisabled();
  });

  test("shows a custom loader when Carregando and Loader customizado are enabled", async ({
    page,
  }) => {
    const playground = await gotoPlayground(page);
    const previewButton = playground.locator(".btn-playground-preview .v-btn");

    await page.getByLabel("Carregando", { exact: true }).click();
    await expect(previewButton.locator(".v-progress-circular")).toBeVisible();

    await page.getByLabel("Loader customizado", { exact: true }).click();
    await page.getByLabel("Texto do loader", { exact: true }).fill("Enviando…");

    await expect(previewButton.locator(".v-progress-circular")).toHaveCount(0);
    await expect(previewButton).toContainText("Enviando…");
  });

  test("applies the position class when Posição changes", async ({ page }) => {
    const playground = await gotoPlayground(page);
    const previewButton = playground.locator(".btn-playground-preview .v-btn");

    await selectOption(page, "Posição", "absolute");

    await expect(previewButton).toHaveCSS("position", "absolute");
  });

  test("matches the accessible snapshot of the preview button in its default state", async ({
    page,
  }) => {
    const playground = await gotoPlayground(page);
    const previewButton = playground.locator(".btn-playground-preview .v-btn");

    await expect(previewButton).toMatchAriaSnapshot();
  });
});

test.describe("button events demo", () => {
  test("increments the click counter and blocks clicks while disabled", async ({ page }) => {
    await page.goto("guide/components/button");

    const demo = page.locator(".btn-demo-row", { hasText: "Me clique" });
    const clickButton = demo.getByRole("button", { name: "Me clique" });

    await expect(demo).toContainText("0 clique(s)");

    await clickButton.click();
    await clickButton.click();

    await expect(demo).toContainText("2 clique(s)");
  });

  test("matches the accessible snapshot of the click demo", async ({ page }) => {
    await page.goto("guide/components/button");

    const demo = page.locator(".btn-demo-row", { hasText: "Me clique" });

    await expect(demo).toMatchAriaSnapshot();
  });
});
