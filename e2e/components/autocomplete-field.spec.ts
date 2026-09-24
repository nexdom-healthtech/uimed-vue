import { test, expect, type Page } from "@playwright/test";
import { gotoPage, selectOption } from "@e2e/utils.ts";

test.describe("autocomplete-field", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/autocomplete-field");
  });

  test.describe("playground", () => {
    test("updates variant when playground-variant changes", async ({ page }) => {
      const previewField = getPreviewField(page);
      await expect(previewField.locator(".v-field--variant-underlined")).toBeAttached();

      await selectOption(page, "autocomplete-field-playground-variant", "Secondary");
      await expect(previewField.locator(".v-field--variant-outlined")).toBeAttached();
    });

    test("updates label text when playground-label changes", async ({ page }) => {
      const text = "Label do campo";
      await page.getByTestId("autocomplete-field-playground-label").locator("input").fill(text);

      const previewField = getPreviewField(page);
      await expect(previewField).toContainText(text);
    });

    test("updates placeholder text when playground-placeholder changes", async ({ page }) => {
      const text = "Placeholder do campo";
      await page
        .getByTestId("autocomplete-field-playground-placeholder")
        .locator("input")
        .fill(text);

      const previewField = getPreviewField(page);
      await expect(previewField.locator(`[placeholder="${text}"]`)).toBeAttached();
    });

    test("updates hint text when playground-hint changes", async ({ page }) => {
      const text = "Hint do campo";
      await page.getByTestId("autocomplete-field-playground-hint").locator("input").fill(text);

      const previewField = getPreviewField(page);
      await getComboboxInput(previewField).focus();
      await expect(previewField).toContainText(text);
    });

    test("switches between autocomplete and combobox when playground-strict is toggled", async ({
      page,
    }) => {
      const previewField = getPreviewField(page);
      await expect(previewField).toHaveClass(/v-combobox/);

      await page.getByTestId("autocomplete-field-playground-strict").locator("input").click();
      await expect(previewField).toHaveClass(/v-autocomplete/);
    });

    test("allows multiple selections when playground-multiple is toggled", async ({ page }) => {
      const previewField = getPreviewField(page);
      const input = getComboboxInput(previewField);

      await page.getByTestId("autocomplete-field-playground-multiple").locator("input").click();

      await input.click();
      await input.fill("Brasil");
      await input.press("Enter");
      await input.fill("Portugal");
      await input.press("Enter");

      await expect(previewField.locator(".v-chip")).toHaveCount(2);
    });

    test("disables when playground-disabled is toggled", async ({ page }) => {
      const previewField = getPreviewField(page);
      await expect(previewField).toBeEnabled();

      await page.getByTestId("autocomplete-field-playground-disabled").locator("input").click();
      await expect(getComboboxInput(previewField)).toBeDisabled();
    });

    test("turns into readonly when playground-readonly is toggled", async ({ page }) => {
      const previewField = getPreviewField(page);
      await expect(getComboboxInput(previewField)).not.toHaveAttribute("readonly");

      await page.getByTestId("autocomplete-field-playground-readonly").locator("input").click();
      await expect(getComboboxInput(previewField)).toHaveAttribute("readonly");
    });

    test("presents loading when playground-loading is toggled", async ({ page }) => {
      const previewField = getPreviewField(page);
      await expect(previewField.locator(".v-progress-linear--active")).not.toBeAttached();

      await page.getByTestId("autocomplete-field-playground-loading").locator("input").click();
      await expect(previewField.locator(".v-progress-linear--active")).toBeAttached();
    });

    test("turns clearable when playground-clearable is toggled", async ({ page }) => {
      const previewField = getPreviewField(page);
      await expect(previewField.locator(".v-field__clearable")).not.toBeAttached();

      await page.getByTestId("autocomplete-field-playground-clearable").locator("input").click();
      await expect(previewField.locator(".v-field__clearable")).toBeAttached();
    });

    test("matches the accessible snapshot of the preview field in its default state", async ({
      page,
    }) => {
      const previewField = getPreviewField(page);
      await expect(previewField).toMatchAriaSnapshot();
    });
  });

  test.describe("events demo", () => {
    test("increments the update counter when a new value is typed", async ({ page }) => {
      const updateField = page.getByTestId("autocomplete-field-demo-update");
      const input = getComboboxInput(updateField);

      await input.click();
      await expect(updateField).toContainText("0 alteração(ões)");

      await input.fill("Moçambique");
      await input.press("Enter");

      await expect(updateField).toContainText("1 alteração(ões)");
    });

    test("matches the accessible snapshot of the update demo", async ({ page }) => {
      const demo = page.getByTestId("demo-update-event");

      await expect(demo).toMatchAriaSnapshot();
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

function getPreviewField(page: Page) {
  return page.getByTestId("autocomplete-field-preview");
}

function getComboboxInput(field: ReturnType<Page["getByTestId"]>) {
  return field.locator('input:not([type="hidden"])');
}
