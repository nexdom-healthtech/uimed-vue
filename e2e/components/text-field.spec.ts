import { test, expect, type Page } from "@playwright/test";
import { gotoPage, selectOption } from "@e2e/utils.ts";

test.describe("text-field", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/text-field");
  });

  test.describe("playground", () => {
    test("updates variant when playground-variant changes", async ({ page }) => {
      const previewTextField = getPreviewTextField(page);
      await expect(previewTextField.locator(".v-field--variant-underlined")).toBeAttached();

      await selectOption(page, "text-field-playground-variant", "secondary");
      await expect(previewTextField.locator(".v-field--variant-outlined")).toBeAttached();
    });

    test("updates label text when playground-label changes", async ({ page }) => {
      const text = "Label do campo";
      await page.getByTestId("text-field-playground-label").locator("input").fill(text);

      const previewTextField = getPreviewTextField(page);
      await expect(previewTextField).toContainText(text);
    });

    test("updates placeholder text when playground-placeholder changes", async ({ page }) => {
      const text = "Placeholder do campo";
      await page.getByTestId("text-field-playground-placeholder").locator("input").fill(text);

      const previewTextField = getPreviewTextField(page);
      await expect(previewTextField.locator(`[placeholder="${text}"]`)).toBeAttached();
    });

    test("updates hint text when playground-hint changes", async ({ page }) => {
      const text = "Hint do campo";
      await page.getByTestId("text-field-playground-hint").locator("input").fill(text);

      const previewTextField = getPreviewTextField(page);
      await previewTextField.locator("input").focus();
      await expect(previewTextField).toContainText(text);
    });

    test("disables when playground-disabled is toggled", async ({ page }) => {
      const previewTextField = getPreviewTextField(page);
      await expect(previewTextField).toBeEnabled();

      await page.getByTestId("text-field-playground-disabled").locator("input").click();
      await expect(previewTextField.locator("input")).toBeDisabled();
    });

    test("turns into readonly when playground-readonly is toggled", async ({ page }) => {
      const previewTextField = getPreviewTextField(page);
      await expect(previewTextField.locator("input")).not.toHaveAttribute("readonly");

      await page.getByTestId("text-field-playground-readonly").locator("input").click();
      await expect(previewTextField.locator("input")).toHaveAttribute("readonly");
    });

    test("presents loading when playground-loading is toggled", async ({ page }) => {
      const previewTextField = getPreviewTextField(page);
      await expect(previewTextField.locator(".v-progress-linear--active")).not.toBeAttached();
      await expect(previewTextField.locator("input")).not.toHaveAttribute("aria-busy");

      await page.getByTestId("text-field-playground-loading").locator("input").click();
      await expect(previewTextField.locator(".v-progress-linear--active")).toBeAttached();
      await expect(previewTextField.locator(".v-progress-linear--active")).toBeVisible();
      await expect(previewTextField.getByRole("progressbar")).toHaveCount(0);
      await expect(previewTextField.locator("input")).toHaveAttribute("aria-busy", "true");
      await expect(previewTextField.locator("input")).toHaveAccessibleName("Label");
    });

    test("turns clearable when playground-clearable is toggled", async ({ page }) => {
      const previewTextField = getPreviewTextField(page);
      await expect(previewTextField.locator(".v-field__clearable")).not.toBeAttached();

      await page.getByTestId("text-field-playground-clearable").locator("input").click();
      await expect(previewTextField.locator(".v-field__clearable")).toBeAttached();
    });

    test("matches the accessible snapshot of the preview text field in its default state", async ({
      page,
    }) => {
      const previewTextField = getPreviewTextField(page);
      await expect(previewTextField).toMatchAriaSnapshot();
    });
  });

  test.describe("events demo", () => {
    test("increments the update counter and blocks changes while disabled or readonly", async ({
      page,
    }) => {
      const updateTextField = page.getByTestId("text-field-demo-update");
      const input = updateTextField.locator("input");

      await input.focus();

      await expect(updateTextField).toContainText("0 alteração(ões)");

      await input.fill("626");
      await input.fill("624");

      await expect(updateTextField).toContainText("2 alteração(ões)");
    });

    test("matches the accessible snapshot of the update demo", async ({ page }) => {
      const demo = page.getByTestId("demo-update-event");

      await expect(demo).toMatchAriaSnapshot();
    });
  });

  test.describe("password demo", () => {
    test("shows and hides the password on click, keeping the focus on the field", async ({
      page,
    }) => {
      const passwordTextField = page.getByTestId("text-field-demo-password");
      const input = passwordTextField.locator("input");
      const toggle = passwordTextField.getByRole("button", { name: "Mostrar senha" });

      await expect(input).toHaveAttribute("type", "password");
      await expect(toggle).toHaveAttribute("aria-pressed", "false");

      await input.fill("senha-de-exemplo");
      await toggle.click();

      await expect(input).toHaveAttribute("type", "text");
      await expect(input).toHaveValue("senha-de-exemplo");
      await expect(toggle).toHaveAttribute("aria-pressed", "true");
      await expect(input).toBeFocused();

      await toggle.click();

      await expect(input).toHaveAttribute("type", "password");
      await expect(toggle).toHaveAttribute("aria-pressed", "false");
      await expect(input).toBeFocused();
    });

    test("reaches the toggle with Tab and toggles it with Space and Enter", async ({ page }) => {
      const passwordTextField = page.getByTestId("text-field-demo-password");
      const input = passwordTextField.locator("input");
      const toggle = passwordTextField.getByRole("button", { name: "Mostrar senha" });

      await input.focus();
      await page.keyboard.press("Tab");
      await expect(toggle).toBeFocused();

      await page.keyboard.press("Space");
      await expect(input).toHaveAttribute("type", "text");
      await expect(toggle).toHaveAttribute("aria-pressed", "true");
      await expect(toggle).toBeFocused();

      await page.keyboard.press("Enter");
      await expect(input).toHaveAttribute("type", "password");
      await expect(toggle).toHaveAttribute("aria-pressed", "false");
      await expect(toggle).toBeFocused();
    });

    test("matches the accessible snapshot of the password demo", async ({ page }) => {
      const passwordTextField = page.getByTestId("text-field-demo-password");

      await expect(passwordTextField).toMatchAriaSnapshot();
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

function getPreviewTextField(page: Page) {
  return page.getByTestId("text-field-preview");
}
