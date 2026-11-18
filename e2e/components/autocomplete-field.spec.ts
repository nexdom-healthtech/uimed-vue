import { test, expect, type Page } from "@playwright/test";
import { expectNoA11yViolations, gotoPage, selectOption } from "@e2e/utils.ts";

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
      await expect(previewField.locator("input")).not.toHaveAttribute("aria-busy");

      await page.getByTestId("autocomplete-field-playground-loading").locator("input").click();
      await expect(previewField.locator(".v-progress-linear--active")).toBeAttached();
      await expect(previewField.locator(".v-progress-linear--active")).toBeVisible();
      await expect(previewField.getByRole("progressbar")).toHaveCount(0);
      await expect(previewField.locator("input")).toHaveAttribute("aria-busy", "true");
      await expect(previewField.locator("input")).toHaveAccessibleName("País");
    });

    test("turns clearable when playground-clearable is toggled", async ({ page }) => {
      const previewField = getPreviewField(page);
      await expect(previewField.locator(".v-field__clearable")).not.toBeAttached();

      await page.getByTestId("autocomplete-field-playground-clearable").locator("input").click();
      await expect(previewField.locator(".v-field__clearable")).toBeAttached();
    });

    test("presents the field as a single combobox named by its label", async ({ page }) => {
      const previewField = getPreviewField(page);
      const field = previewField.locator(".v-field");
      const combobox = previewField.getByRole("combobox", { name: "País" });

      const fieldAttributes = () =>
        field.evaluate((element) =>
          element.getAttributeNames().filter((name) => name === "role" || name.startsWith("aria-")),
        );
      expect(await fieldAttributes()).toEqual([]);
      await expect(previewField.getByRole("combobox")).toHaveCount(1);
      await expect(combobox).toHaveAttribute("aria-expanded", "false");

      await combobox.click();
      await expect(combobox).toHaveAttribute("aria-expanded", "true");

      const listboxId = await combobox.getAttribute("aria-controls");
      const listbox = page.locator(`[id="${listboxId}"]`).getByRole("listbox", { name: "País" });
      await expect(listbox).toBeVisible();
      expect(await fieldAttributes()).toEqual([]);

      await combobox.press("Escape");
      await expect(listbox).toBeHidden();
      await expect(combobox).toHaveAttribute("aria-expanded", "false");
      await expect(combobox).toBeFocused();
    });

    test("keeps the menu open when clicking a chip or the field outside the input", async ({
      page,
    }) => {
      const previewField = getPreviewField(page);
      const combobox = previewField.getByRole("combobox", { name: "País" });
      const listbox = page.getByRole("listbox", { name: "País" });

      await combobox.click();
      await listbox.getByRole("option", { name: "Brasil" }).click();
      await expect(listbox).toBeHidden();

      await combobox.click();
      await expect(listbox).toBeVisible();

      await previewField.locator(".v-chip").click();
      await expect(listbox).toBeVisible();
      await expect(combobox).toHaveAttribute("aria-expanded", "true");

      const field = previewField.locator(".v-field");
      const fieldBox = (await field.boundingBox())!;
      const isInput = await page.evaluate(
        ({ x, y }) => document.elementFromPoint(x, y)?.tagName === "INPUT",
        { x: fieldBox.x + 2, y: fieldBox.y + fieldBox.height - 1 },
      );
      expect(isInput).toBe(false);
      await field.click({ position: { x: 2, y: fieldBox.height - 1 } });
      await expect(listbox).toBeVisible();
      await expect(combobox).toHaveAttribute("aria-expanded", "true");
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

  test.describe("multiple selection demo", () => {
    test("keeps the options free of focusable elements", async ({ page }) => {
      await getComboboxInput(getMultipleField(page)).click();

      const options = page.getByRole("listbox").getByRole("option");
      await expect(options).toHaveCount(3);
      await expect(page.getByRole("listbox").getByRole("checkbox")).toHaveCount(0);

      const focusableCounts = await options.evaluateAll((elements) =>
        elements.map(
          (option) =>
            [
              ...option.querySelectorAll("input, button, a[href], select, textarea, [tabindex]"),
            ].filter((element) => !element.closest("[inert]")).length,
        ),
      );
      expect(focusableCounts).toEqual([0, 0, 0]);
    });

    test("toggles an option with the keyboard", async ({ page }) => {
      const field = getMultipleField(page);
      const input = getComboboxInput(field);
      await input.click();

      const option = page.getByRole("option", { name: "Brasil" });
      await expect(option).toHaveAttribute("aria-selected", "false");

      await input.press("ArrowDown");
      await expect(option).toBeFocused();
      await page.keyboard.press("Enter");

      await expect(option).toHaveAttribute("aria-selected", "true");
      await expect(option.locator("input")).toBeChecked();
      await expect(field.locator(".v-chip")).toHaveText(["Brasil"]);
    });

    test("toggles an option with a click", async ({ page }) => {
      const field = getMultipleField(page);
      await getComboboxInput(field).click();

      const option = page.getByRole("option", { name: "Portugal" });
      await option.click();

      await expect(option).toHaveAttribute("aria-selected", "true");
      await expect(field.locator(".v-chip")).toHaveText(["Portugal"]);

      await option.click();

      await expect(option).toHaveAttribute("aria-selected", "false");
      await expect(field.locator(".v-chip")).toHaveCount(0);
    });

    test("toggles an option with a click on its checkbox", async ({ page }) => {
      const field = getMultipleField(page);
      await getComboboxInput(field).click();

      const option = page.getByRole("option", { name: "Portugal" });
      // The checkbox is inert, so the click is dispatched at its position and reaches the option
      const checkbox = option.locator(".v-checkbox-btn");
      // Waits for the menu's opening transition to end, so the checkbox stops moving
      let previous = "";
      await expect
        .poll(async () => {
          const current = JSON.stringify(await checkbox.boundingBox());
          const isStable = current === previous;
          previous = current;
          return isStable;
        })
        .toBe(true);
      const box = (await checkbox.boundingBox())!;
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

      await expect(option).toHaveAttribute("aria-selected", "true");
      await expect(field.locator(".v-chip")).toHaveText(["Portugal"]);
    });

    test("matches the accessible snapshot of the open options", async ({ page }) => {
      await getComboboxInput(getMultipleField(page)).click();

      await expect(page.getByRole("listbox")).toMatchAriaSnapshot();
    });
  });

  test.describe("accessibility", () => {
    test("has no violations", async ({ page }) => {
      await expectNoA11yViolations(page);
    });

    test("has no violations with the menu open", async ({ page }) => {
      await getComboboxInput(getPreviewField(page)).click();
      await expect(page.locator(".v-menu.v-overlay--active")).toBeVisible();

      await expectNoA11yViolations(page);
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

function getMultipleField(page: Page) {
  return page.locator(".v-combobox").filter({ hasText: "Selecione países" });
}

function getComboboxInput(field: ReturnType<Page["getByTestId"]>) {
  return field.locator('input:not([type="hidden"])');
}
