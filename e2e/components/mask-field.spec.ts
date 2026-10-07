import { test, expect, type Locator, type Page } from "@playwright/test";
import { gotoPage, selectOption } from "@e2e/utils.ts";

test.describe("mask-field", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/mask-field");
  });

  test.describe("presets demo", () => {
    const presets = [
      ["cpf", "12345678909", "123.456.789-09"],
      ["cnpj", "12345678000195", "12.345.678/0001-95"],
      ["cep", "01310100", "01310-100"],
      ["phone", "11912345678", "(11) 91234-5678"],
      ["date", "31122026", "31/12/2026"],
    ];

    for (const [type, digits, masked] of presets) {
      test(`masks the ${type} while typing and emits only its digits`, async ({ page }) => {
        const input = getInput(page, `mask-field-demo-${type}`);

        await input.pressSequentially(digits);

        await expect(input).toHaveValue(masked);
        await expect(page.getByTestId(`mask-field-demo-${type}-value`)).toHaveText(`"${digits}"`);
      });
    }

    test("shows the numeric keyboard", async ({ page }) => {
      await expect(getInput(page, "mask-field-demo-cpf")).toHaveAttribute("inputmode", "numeric");
    });

    test("discards incompatible characters", async ({ page }) => {
      const input = getInput(page, "mask-field-demo-cpf");

      await input.pressSequentially("12a3 b4!");

      await expect(input).toHaveValue("123.4");
      await expect(getCpfValue(page)).toHaveText('"1234"');
    });

    test("limits the value to the mask's length", async ({ page }) => {
      const input = getInput(page, "mask-field-demo-cep");

      await input.pressSequentially("0131010099");

      await expect(input).toHaveValue("01310-100");
      await expect(page.getByTestId("mask-field-demo-cep-value")).toHaveText('"01310100"');
    });

    test("shows a literal as soon as the character before it is typed", async ({ page }) => {
      const input = getInput(page, "mask-field-demo-cpf");

      await input.pressSequentially("123");

      await expect(input).toHaveValue("123.");
      await expect.poll(() => getSelection(input)).toEqual([4, 4]);
      await expect(getCpfValue(page)).toHaveText('"123"');
    });

    test("doesn't duplicate a literal typed at its position", async ({ page }) => {
      const input = getInput(page, "mask-field-demo-cpf");

      await input.pressSequentially("123.456");

      await expect(input).toHaveValue("123.456.");
      await expect(getCpfValue(page)).toHaveText('"123456"');
    });

    test("moves the caret before a literal with Backspace, then deletes the digit", async ({
      page,
    }) => {
      const input = getInput(page, "mask-field-demo-cpf");
      await input.pressSequentially("12345678909");

      await setSelection(input, 12);
      await input.press("Backspace");

      await expect(input).toHaveValue("123.456.789-09");
      await expect.poll(() => getSelection(input)).toEqual([11, 11]);

      await input.press("Backspace");

      await expect(input).toHaveValue("123.456.780-9");
      await expect(getCpfValue(page)).toHaveText('"1234567809"');
    });

    test("moves the caret after a literal with Delete, then deletes the digit", async ({
      page,
    }) => {
      const input = getInput(page, "mask-field-demo-cpf");
      await input.pressSequentially("12345678909");

      await setSelection(input, 3);
      await input.press("Delete");

      await expect(input).toHaveValue("123.456.789-09");
      await expect.poll(() => getSelection(input)).toEqual([4, 4]);

      await input.press("Delete");

      await expect(input).toHaveValue("123.567.890-9");
      await expect(getCpfValue(page)).toHaveText('"1235678909"');
    });

    test("drops the last digit when typing in the middle of a full mask", async ({ page }) => {
      const input = getInput(page, "mask-field-demo-cep");
      await input.pressSequentially("01310100");

      await setSelection(input, 3);
      await input.press("9");

      await expect(input).toHaveValue("01391-010");
      await expect.poll(() => getSelection(input)).toEqual([4, 4]);
      await expect(page.getByTestId("mask-field-demo-cep-value")).toHaveText('"01391010"');
    });

    test("shows the mask as placeholder", async ({ page }) => {
      await expect(getInput(page, "mask-field-demo-cpf")).toHaveAttribute(
        "placeholder",
        "000.000.000-00",
      );
      await expect(getInput(page, "mask-field-demo-phone")).toHaveAttribute(
        "placeholder",
        "(00) 00000-0000",
      );
    });

    test("deletes only the selected digits", async ({ page }) => {
      const input = getInput(page, "mask-field-demo-cpf");
      await input.pressSequentially("12345678909");

      await setSelection(input, 2, 6);
      await input.press("Backspace");

      await expect(input).toHaveValue("126.789.09");
      await expect(getCpfValue(page)).toHaveText('"12678909"');
    });

    test("deletes nothing when only a literal is selected", async ({ page }) => {
      const input = getInput(page, "mask-field-demo-cpf");
      await input.pressSequentially("12345678909");

      await setSelection(input, 11, 12);
      await input.press("Backspace");

      await expect(input).toHaveValue("123.456.789-09");
      await expect(getCpfValue(page)).toHaveText('"12345678909"');
      await expect.poll(() => getSelection(input)).toEqual([11, 11]);
    });

    for (const pasted of ["123.456.789-09", "12345678909", "123 456 789 09", "1234567890999"]) {
      test(`pastes "${pasted}" as the same masked value`, async ({ page }) => {
        const input = getInput(page, "mask-field-demo-cpf");

        await paste(page, input, pasted);

        await expect(input).toHaveValue("123.456.789-09");
        await expect(getCpfValue(page)).toHaveText('"12345678909"');
      });
    }

    test("matches the accessible snapshot of the presets demo", async ({ page }) => {
      await expect(page.getByTestId("demo-presets")).toMatchAriaSnapshot();
    });
  });

  test.describe("custom mask demo", () => {
    test("masks the value with the custom mask", async ({ page }) => {
      const input = getInput(page, "mask-field-demo-custom");

      await input.pressSequentially("1234561234");

      await expect(input).toHaveValue("1234-56/1234");
      await expect(page.getByTestId("mask-field-demo-custom-value")).toHaveText('"1234561234"');
    });

    test("inserts the letters of the mask as literals", async ({ page }) => {
      const input = getInput(page, "mask-field-demo-number");

      await input.pressSequentially("1");

      await expect(input).toHaveValue("Nº 1");
      await expect.poll(() => getSelection(input)).toEqual([4, 4]);

      await input.pressSequentially("234");

      await expect(input).toHaveValue("Nº 1234");
      await expect(page.getByTestId("mask-field-demo-number-value")).toHaveText('"1234"');
    });

    test("accepts only digits in a mask with letters", async ({ page }) => {
      const input = getInput(page, "mask-field-demo-number");

      await input.pressSequentially(String.raw`aN1X2n3\4`);

      await expect(input).toHaveValue("Nº 1234");
      await expect(page.getByTestId("mask-field-demo-number-value")).toHaveText('"1234"');
    });

    test("removes the leading letters along with the only digit", async ({ page }) => {
      const input = getInput(page, "mask-field-demo-number");
      await input.pressSequentially("1");

      await input.press("Backspace");

      await expect(input).toHaveValue("");
      await expect(page.getByTestId("mask-field-demo-number-value")).toHaveText('""');
    });

    test("shows the numeric keyboard and the mask as placeholder", async ({ page }) => {
      const input = getInput(page, "mask-field-demo-number");

      await expect(input).toHaveAttribute("inputmode", "numeric");
      await expect(input).toHaveAttribute("placeholder", "Nº 0000");
      await expect(getInput(page, "mask-field-demo-custom")).toHaveAttribute(
        "placeholder",
        "0000-00/0000",
      );
    });

    for (const pasted of ["Nº 1234", "1234"]) {
      test(`pastes "${pasted}" into the mask with letters as the same value`, async ({ page }) => {
        const input = getInput(page, "mask-field-demo-number");

        await paste(page, input, pasted);

        await expect(input).toHaveValue("Nº 1234");
        await expect(page.getByTestId("mask-field-demo-number-value")).toHaveText('"1234"');
      });
    }
  });

  test.describe("placeholder demo", () => {
    test("shows the mask as placeholder when the field is focused", async ({ page }) => {
      const field = page.getByTestId("mask-field-demo-placeholder-default");
      const input = field.locator("input");

      await expect(input).toHaveAttribute("placeholder", "00000-000");
      await expect.poll(() => getPlaceholderOpacity(input)).toBe("0");

      await input.focus();

      await expect.poll(() => getPlaceholderOpacity(input)).not.toBe("0");
    });

    test("uses the given placeholder instead of the mask", async ({ page }) => {
      await expect(getInput(page, "mask-field-demo-placeholder-custom")).toHaveAttribute(
        "placeholder",
        "Somente números",
      );
    });
  });

  test.describe("initial value demo", () => {
    test("displays a value out of format normalized, without changing it", async ({ page }) => {
      await expect(getInput(page, "mask-field-demo-initial")).toHaveValue("123.456.789-09");
      await expect(page.getByTestId("mask-field-demo-initial-value")).toHaveText(
        '"123.456.789-09"',
      );
    });

    test("displays a value with excess digits cut, failing its validation", async ({ page }) => {
      const field = page.getByTestId("mask-field-demo-initial-excess");

      await expect(field.locator("input")).toHaveValue("123.456.789-09");
      await field.locator("input").focus();
      await field.locator("input").blur();

      await expect(field).toContainText("Valor inválido");
      await expect(page.getByTestId("mask-field-demo-initial-excess-value")).toHaveText(
        '"123456789099"',
      );
    });
  });

  test.describe("validation demo", () => {
    test("shows the required message when the form is submitted empty", async ({ page }) => {
      const field = page.getByTestId("mask-field-demo-required");

      await page.getByTestId("mask-field-demo-required-submit").click();

      await expect(field).toContainText("Campo obrigatório");
      await expect(field.locator("input")).toHaveAccessibleName("CPF");
    });

    test("shows the incomplete message after leaving an incomplete value", async ({ page }) => {
      const field = page.getByTestId("mask-field-demo-required");

      await field.locator("input").pressSequentially("12345");
      await field.locator("input").blur();

      await expect(field.locator("input")).toHaveValue("123.45");
      await expect(field).toContainText("Valor incompleto");
    });
  });

  test.describe("states demos", () => {
    test("blocks edits while disabled", async ({ page }) => {
      const input = getInput(page, "mask-field-demo-disabled");

      await expect(input).toHaveValue("123.456.789-09");
      await expect(input).toBeDisabled();
    });

    test("blocks edits while readonly", async ({ page }) => {
      const input = getInput(page, "mask-field-demo-readonly");

      await setSelection(input, 3);
      await input.press("Backspace");
      await input.pressSequentially("1");

      await expect(input).toHaveValue("123.456.789-09");
      await expect(input).toHaveAttribute("readonly");
    });

    test("marks the field as busy while loading", async ({ page }) => {
      const input = getInput(page, "mask-field-demo-loading");

      await expect(input).toHaveAttribute("aria-busy", "true");
      await expect(input).toHaveAccessibleName("Carregando");
    });

    test("clears the value", async ({ page }) => {
      const field = page.getByTestId("mask-field-demo-clearable");
      const value = page.getByTestId("mask-field-demo-clearable-value");

      await expect(field.locator("input")).toHaveValue("01310-100");
      await expect(value).toHaveText('"01310100"');

      await field.locator(".v-field__clearable .v-icon").click();

      await expect(value).toHaveText('""');
      await expect(field.locator("input")).toHaveValue("");
    });
  });

  test.describe("events demo", () => {
    test("keeps the caret after a digit typed in the middle", async ({ page }) => {
      const input = getInput(page, "mask-field-demo-update");
      const count = page.getByTestId("mask-field-demo-update-count");

      await expect(input).toHaveValue("(11) 91234-567");
      await expect(count).toHaveText('0 alteração(ões): "1191234567"');

      await setSelection(input, 5);
      await input.press("8");

      await expect(input).toHaveValue("(11) 89123-4567");
      await expect.poll(() => getSelection(input)).toEqual([6, 6]);
      await expect(count).toHaveText('1 alteração(ões): "11891234567"');
    });

    test("doesn't emit for discarded characters, typed literals or a full mask", async ({
      page,
    }) => {
      const input = getInput(page, "mask-field-demo-update");
      const count = page.getByTestId("mask-field-demo-update-count");

      await input.press("End");
      await input.pressSequentially("a-");
      await expect(input).toHaveValue("(11) 91234-567");

      await input.pressSequentially("89");

      await expect(input).toHaveValue("(11) 91234-5678");
      await expect(count).toHaveText('1 alteração(ões): "11912345678"');
    });

    test("matches the accessible snapshot of the update demo", async ({ page }) => {
      await expect(page.getByTestId("demo-update-event")).toMatchAriaSnapshot();
    });
  });

  test.describe("playground", () => {
    test("updates the mask when playground-mask changes", async ({ page }) => {
      const input = getPreview(page).locator("input");

      await input.pressSequentially("01310100");
      await expect(input).toHaveValue("013.101.00");

      await selectOption(page, "mask-field-playground-mask", "cep");
      await expect(input).toHaveValue("01310-100");

      await selectOption(page, "mask-field-playground-mask", "####-##/####");
      await expect(input).toHaveValue("0131-01/00");
    });

    test("fails the validation of a value longer than the new mask", async ({ page }) => {
      const preview = getPreview(page);
      const input = preview.locator("input");

      await selectOption(page, "mask-field-playground-mask", "cnpj");
      await input.pressSequentially("12345678000195");
      await expect(input).toHaveValue("12.345.678/0001-95");
      // Opening the menu may scroll the page to its end, leaving the select under the fixed
      // header, where the forced click of `selectOption` would land
      await page
        .getByTestId("mask-field-playground-mask")
        .evaluate((element) => element.scrollIntoView({ block: "center" }));

      await selectOption(page, "mask-field-playground-mask", "cpf");
      await input.focus();
      await input.blur();

      await expect(input).toHaveValue("123.456.780-00");
      await expect(preview).toContainText("Valor inválido");
    });

    test("updates variant when playground-variant changes", async ({ page }) => {
      const preview = getPreview(page);
      await expect(preview.locator(".v-field--variant-underlined")).toBeAttached();

      await selectOption(page, "mask-field-playground-variant", "secondary");
      await expect(preview.locator(".v-field--variant-outlined")).toBeAttached();
    });

    test("updates label text when playground-label changes", async ({ page }) => {
      const text = "Label do campo";
      await page.getByTestId("mask-field-playground-label").locator("input").fill(text);

      await expect(getPreview(page)).toContainText(text);
    });

    test("updates placeholder text when playground-placeholder changes", async ({ page }) => {
      const text = "Placeholder do campo";
      await page.getByTestId("mask-field-playground-placeholder").locator("input").fill(text);

      await expect(getPreview(page).locator(`[placeholder="${text}"]`)).toBeAttached();
    });

    test("shows the placeholder of the mask when playground-placeholder is empty", async ({
      page,
    }) => {
      const input = getPreview(page).locator("input");
      await expect(input).toHaveAttribute("placeholder", "000.000.000-00");

      await selectOption(page, "mask-field-playground-mask", "cep");
      await expect(input).toHaveAttribute("placeholder", "00000-000");
    });

    test("updates hint text when playground-hint changes", async ({ page }) => {
      const text = "Hint do campo";
      await page.getByTestId("mask-field-playground-hint").locator("input").fill(text);

      const preview = getPreview(page);
      await preview.locator("input").focus();
      await expect(preview).toContainText(text);
    });

    test("disables when playground-disabled is toggled", async ({ page }) => {
      const preview = getPreview(page);
      await expect(preview.locator("input")).toBeEnabled();

      await page.getByTestId("mask-field-playground-disabled").locator("input").click();
      await expect(preview.locator("input")).toBeDisabled();
    });

    test("turns into readonly when playground-readonly is toggled", async ({ page }) => {
      const preview = getPreview(page);
      await expect(preview.locator("input")).not.toHaveAttribute("readonly");

      await page.getByTestId("mask-field-playground-readonly").locator("input").click();
      await expect(preview.locator("input")).toHaveAttribute("readonly");
    });

    test("presents loading when playground-loading is toggled", async ({ page }) => {
      const preview = getPreview(page);
      await expect(preview.locator(".v-progress-linear--active")).not.toBeAttached();
      await expect(preview.locator("input")).not.toHaveAttribute("aria-busy");

      await page.getByTestId("mask-field-playground-loading").locator("input").click();
      await expect(preview.locator(".v-progress-linear--active")).toBeVisible();
      await expect(preview.getByRole("progressbar")).toHaveCount(0);
      await expect(preview.locator("input")).toHaveAttribute("aria-busy", "true");
      await expect(preview.locator("input")).toHaveAccessibleName("Label");
    });

    test("turns clearable when playground-clearable is toggled", async ({ page }) => {
      const preview = getPreview(page);
      await expect(preview.locator(".v-field__clearable")).not.toBeAttached();

      await page.getByTestId("mask-field-playground-clearable").locator("input").click();
      await expect(preview.locator(".v-field__clearable")).toBeAttached();
    });

    test("matches the accessible snapshot of the preview field in its default state", async ({
      page,
    }) => {
      await expect(getPreview(page)).toMatchAriaSnapshot();
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

function getPreview(page: Page) {
  return page.getByTestId("mask-field-preview");
}

function getInput(page: Page, testId: string) {
  return page.getByTestId(testId).locator("input");
}

function getCpfValue(page: Page) {
  return page.getByTestId("mask-field-demo-cpf-value");
}

async function setSelection(input: Locator, start: number, end = start) {
  await input.focus();
  await input.evaluate(
    (element: HTMLInputElement, range) => {
      element.setSelectionRange(range[0], range[1]);
    },
    [start, end],
  );
}

function getPlaceholderOpacity(input: Locator) {
  return input.evaluate(
    (element: HTMLInputElement) => globalThis.getComputedStyle(element, "::placeholder").opacity,
  );
}

function getSelection(input: Locator) {
  return input.evaluate((element: HTMLInputElement) => [
    element.selectionStart,
    element.selectionEnd,
  ]);
}

async function paste(page: Page, input: Locator, text: string) {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.evaluate((value) => navigator.clipboard.writeText(value), text);
  await input.focus();
  await input.press("ControlOrMeta+V");
}
