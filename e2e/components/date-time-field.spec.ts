import { test, expect, type Locator, type Page } from "@playwright/test";
import { gotoPage, selectOption } from "@e2e/utils.ts";

test.describe("date-time-field", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/date-time-field");
  });

  test.describe("types demo", () => {
    test("selects a date", async ({ page }) => {
      const field = page.getByTestId("date-time-field-demo-date");

      await field.locator("input").click();
      await pickDay(page, "24 de setembro de 2026");

      await expect(getOpenMenu(page)).toBeHidden();
      await expect(page.getByTestId("date-time-field-demo-date-value")).toHaveText('"2026-09-24"');
      await expect(field.locator("input")).toHaveValue("24/09/2026");
    });

    test("selects a time, closing after the minutes are picked", async ({ page }) => {
      const field = page.getByTestId("date-time-field-demo-time");

      await field.locator("input").click();
      await pickClockItem(page, "14");
      await expect(getOpenMenu(page)).toBeVisible();
      await pickClockItem(page, "30");

      await expect(getOpenMenu(page)).toBeHidden();
      await expect(page.getByTestId("date-time-field-demo-time-value")).toHaveText('"14:30"');
      await expect(field.locator("input")).toHaveValue("14:30");
    });

    test("selects a date and a time", async ({ page }) => {
      const field = page.getByTestId("date-time-field-demo-datetime");
      const value = page.getByTestId("date-time-field-demo-datetime-value");

      await field.locator("input").click();
      await expect(getOpenMenu(page).locator(".v-date-picker")).toBeVisible();
      await expect(getOpenMenu(page).locator(".v-time-picker")).toBeVisible();
      await pickDay(page, "24 de setembro de 2026");

      await expect(getOpenMenu(page)).toBeHidden();
      await expect(value).toHaveText('"2026-09-24T08:00"');

      await field.locator("input").click();
      await pickClockItem(page, "14");
      await pickClockItem(page, "30");

      await expect(getOpenMenu(page)).toBeHidden();
      await expect(value).toHaveText('"2026-09-24T14:30"');
      await expect(field.locator("input")).toHaveValue("24/09/2026 14:30");
    });

    test("presents the pickers in Portuguese", async ({ page }) => {
      await page.getByTestId("date-time-field-demo-datetime").locator("input").click();

      const menu = getOpenMenu(page);
      await expect(menu).toContainText("Selecione a data");
      await expect(menu).toContainText("Selecione o horário");
      await expect(menu.getByRole("button", { name: "Próximo mês" })).toBeVisible();
      await expect(getDay(page, "24 de setembro de 2026")).toBeVisible();
    });

    test("presents the field as a combobox that opens a dialog named by its label", async ({
      page,
    }) => {
      const field = page.getByTestId("date-time-field-demo-date");
      const input = field.getByRole("combobox", { name: "Data", exact: true });

      await expect(input).toHaveAttribute("aria-haspopup", "dialog");
      await expect(input).toHaveAttribute("aria-expanded", "false");
      await expect(input).not.toHaveAttribute("aria-owns");
      expect(await getAriaAttributes(field.locator(".v-field"))).toEqual([]);

      await input.click();

      await expect(input).toHaveAttribute("aria-expanded", "true");
      const controls = await input.getAttribute("aria-controls");
      const dialog = page.locator(`[id="${controls}"]`).getByRole("dialog", { name: "Data" });
      await expect(dialog).toBeVisible();
      await expect(dialog.locator(".v-date-picker")).toBeVisible();

      await page.keyboard.press("Escape");

      await expect(getOpenMenu(page)).toBeHidden();
      await expect(input).toHaveAttribute("aria-expanded", "false");
    });

    test("opens the picker with ArrowDown and closes it with Escape, keeping the focus", async ({
      page,
    }) => {
      const input = page
        .getByTestId("date-time-field-demo-date")
        .getByRole("combobox", { name: "Data", exact: true });

      await input.focus();
      await page.keyboard.press("ArrowDown");

      await expect(getOpenMenu(page)).toBeVisible();
      await expect(input).toHaveAttribute("aria-expanded", "true");

      await page.keyboard.press("Escape");

      await expect(getOpenMenu(page)).toBeHidden();
      await expect(input).toBeFocused();
    });

    test("opens the picker when the field is clicked outside the input", async ({ page }) => {
      const field = page.getByTestId("date-time-field-demo-date");

      const control = field.locator(".v-field");
      const box = (await control.boundingBox())!;
      const isInput = await page.evaluate(
        ({ x, y }) => document.elementFromPoint(x, y)?.tagName === "INPUT",
        { x: box.x + 4, y: box.y + 4 },
      );
      expect(isInput).toBe(false);
      await control.click({ position: { x: 4, y: 4 } });

      await expect(getOpenMenu(page)).toBeVisible();
    });

    test("matches the accessible snapshot of the types demo", async ({ page }) => {
      await expect(page.getByTestId("demo-types")).toMatchAriaSnapshot();
    });
  });

  test.describe("limits demo", () => {
    test("disables days out of range", async ({ page }) => {
      await page.getByTestId("date-time-field-demo-limits").locator("input").click();

      await expect(getDay(page, "9 de setembro de 2026")).toBeDisabled();
      await expect(getDay(page, "10 de setembro de 2026")).toBeEnabled();
      await expect(getDay(page, "20 de setembro de 2026")).toBeEnabled();
      await expect(getDay(page, "21 de setembro de 2026")).toBeDisabled();
    });

    test("shows an error when the value is out of range", async ({ page }) => {
      const field = page.getByTestId("date-time-field-demo-limits");
      const message = "Valor posterior ao máximo permitido (20/09/2026)";

      await expect(field).not.toContainText(message);

      await page.getByTestId("date-time-field-demo-limits-out").click();

      await expect(field.locator("input")).toHaveValue("25/09/2026");
      await expect(field).toContainText(message);
    });
  });

  test.describe("required demo", () => {
    test("shows the required message when the form is submitted empty", async ({ page }) => {
      const field = page.getByTestId("date-time-field-demo-required");

      await page.getByTestId("date-time-field-demo-required-submit").click();

      await expect(field).toContainText("Campo obrigatório");
    });
  });

  test.describe("states demos", () => {
    test("doesn't open the picker while disabled", async ({ page }) => {
      const field = page.getByTestId("date-time-field-demo-disabled");

      await expect(field.locator("input")).toBeDisabled();
      await field.click({ force: true });

      await expect(getOpenMenu(page)).toHaveCount(0);
    });

    test.describe("doesn't present the field as a combobox", () => {
      const states = [
        ["disabled", "Desabilitado"],
        ["readonly", "Somente leitura"],
      ] as const;

      for (const [state, label] of states) {
        test(`while ${state}`, async ({ page }) => {
          const field = page.getByTestId(`date-time-field-demo-${state}`);
          const input = field.getByRole("textbox", { name: label });

          await expect(input).toBeVisible();
          await expect(input).not.toHaveAttribute("aria-haspopup");
          await expect(input).not.toHaveAttribute("aria-expanded");
          expect(await getAriaAttributes(field.locator(".v-field"))).toEqual([]);
        });
      }
    });

    test("doesn't open the picker while readonly", async ({ page }) => {
      const field = page.getByTestId("date-time-field-demo-readonly");

      await expect(field.locator("input")).toHaveValue("24/09/2026 14:30");
      await field.locator("input").click();

      await expect(getOpenMenu(page)).toHaveCount(0);
    });

    test("clears the value", async ({ page }) => {
      const field = page.getByTestId("date-time-field-demo-clearable");
      const value = page.getByTestId("date-time-field-demo-clearable-value");

      await expect(value).toHaveText('"2026-09-24"');

      await field.locator(".v-field__clearable .v-icon").click();

      await expect(value).toHaveText('""');
      await expect(field.locator("input")).toHaveValue("");
      await expect(getOpenMenu(page)).toHaveCount(0);
    });
  });

  test.describe("playground", () => {
    test("updates pickers when playground-type changes", async ({ page }) => {
      const preview = getPreview(page);

      await selectOption(page, "date-time-field-playground-type", "date");
      await preview.locator("input").click();

      await expect(getOpenMenu(page).locator(".v-date-picker")).toBeVisible();
      await expect(getOpenMenu(page).locator(".v-time-picker")).toHaveCount(0);

      await page.keyboard.press("Escape");
      await expect(getOpenMenu(page)).toHaveCount(0);

      await selectOption(page, "date-time-field-playground-type", "time");
      await preview.locator("input").click();

      await expect(getOpenMenu(page).locator(".v-time-picker")).toBeVisible();
      await expect(getOpenMenu(page).locator(".v-date-picker")).toHaveCount(0);
    });

    test("updates variant when playground-variant changes", async ({ page }) => {
      const preview = getPreview(page);
      await expect(preview.locator(".v-field--variant-underlined")).toBeAttached();

      await selectOption(page, "date-time-field-playground-variant", "secondary");
      await expect(preview.locator(".v-field--variant-outlined")).toBeAttached();
    });

    test("updates label text when playground-label changes", async ({ page }) => {
      const text = "Label do campo";
      await page.getByTestId("date-time-field-playground-label").locator("input").fill(text);

      await expect(getPreview(page)).toContainText(text);
    });

    test("updates placeholder text when playground-placeholder changes", async ({ page }) => {
      const text = "Placeholder do campo";
      await page.getByTestId("date-time-field-playground-placeholder").locator("input").fill(text);

      await expect(getPreview(page).locator(`[placeholder="${text}"]`)).toBeAttached();
    });

    test("updates hint text when playground-hint changes", async ({ page }) => {
      const text = "Hint do campo";
      await page.getByTestId("date-time-field-playground-hint").locator("input").fill(text);

      const preview = getPreview(page);
      await preview.locator("input").focus();
      await expect(preview).toContainText(text);
    });

    test("limits the time picker when playground-min and playground-max change", async ({
      page,
    }) => {
      await selectOption(page, "date-time-field-playground-type", "time");
      await page.getByTestId("date-time-field-playground-min").locator("input").fill("08:00");
      await page.getByTestId("date-time-field-playground-max").locator("input").fill("18:00");

      await getPreview(page).locator("input").click();

      await expect(getClockItem(page, "7")).toHaveClass(/v-time-picker-clock__item--disabled/);
      await expect(getClockItem(page, "8")).not.toHaveClass(/v-time-picker-clock__item--disabled/);
      await expect(getClockItem(page, "18")).not.toHaveClass(/v-time-picker-clock__item--disabled/);
      await expect(getClockItem(page, "19")).toHaveClass(/v-time-picker-clock__item--disabled/);
    });

    test("disables when playground-disabled is toggled", async ({ page }) => {
      const preview = getPreview(page);
      await expect(preview.locator("input")).toBeEnabled();

      await page.getByTestId("date-time-field-playground-disabled").locator("input").click();
      await expect(preview.locator("input")).toBeDisabled();
    });

    test("stops opening the picker when playground-readonly is toggled", async ({ page }) => {
      const preview = getPreview(page);

      await page.getByTestId("date-time-field-playground-readonly").locator("input").click();
      await preview.locator("input").click();

      await expect(getOpenMenu(page)).toHaveCount(0);
    });

    test("presents loading when playground-loading is toggled", async ({ page }) => {
      const preview = getPreview(page);
      await expect(preview.locator(".v-progress-linear--active")).not.toBeAttached();
      await expect(preview.locator("input")).not.toHaveAttribute("aria-busy");

      await page.getByTestId("date-time-field-playground-loading").locator("input").click();
      await expect(preview.locator(".v-progress-linear--active")).toBeAttached();
      await expect(preview.locator(".v-progress-linear--active")).toBeVisible();
      await expect(preview.getByRole("progressbar")).toHaveCount(0);
      await expect(preview.locator("input")).toHaveAttribute("aria-busy", "true");
      await expect(preview.locator("input")).toHaveAccessibleName("Label");
    });

    test("turns clearable when playground-clearable is toggled", async ({ page }) => {
      const preview = getPreview(page);
      await expect(preview.locator(".v-field__clearable")).not.toBeAttached();

      await page.getByTestId("date-time-field-playground-clearable").locator("input").click();
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

function getAriaAttributes(locator: Locator) {
  return locator.evaluate((element) =>
    element.getAttributeNames().filter((name) => name.startsWith("aria-")),
  );
}

function getPreview(page: Page) {
  return page.getByTestId("date-time-field-preview");
}

function getOpenMenu(page: Page): Locator {
  return page.locator(".v-menu.v-overlay--active");
}

function getDay(page: Page, date: string) {
  return getOpenMenu(page).getByRole("button", { name: new RegExp(`, ${date}$`) });
}

async function pickDay(page: Page, date: string) {
  await getDay(page, date).click();
}

function getClockItem(page: Page, text: string) {
  return getOpenMenu(page)
    .locator(".v-time-picker-clock__item")
    .filter({ hasText: new RegExp(`^${text}$`) });
}

async function pickClockItem(page: Page, text: string) {
  await getClockItem(page, text).click();
}
