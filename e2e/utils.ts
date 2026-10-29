import { AxeBuilder } from "@axe-core/playwright";
import { expect, type Locator, type Page } from "@playwright/test";

export async function gotoPage(page: Page, url: string) {
  await page.goto(url);
  await page.locator("h1").waitFor({ state: "visible" });
}

export async function selectOption(page: Page, testId: string, option: string) {
  await page.getByTestId(testId).locator("input:visible").click({ force: true });
  await page.getByRole("option", { name: option, exact: true }).click();
}

/**
 * Pauses the page clock slightly ahead of the page's own time. The page clock can run ahead of the
 * test runner's, so pausing at the runner's time (e.g. `new Date()`) may fail with "Cannot
 * fast-forward to the past". Timers due within the margin still run before the pause.
 */
export async function pauseClock(page: Page, marginMs = 1000) {
  const pageNow = await page.evaluate(() => Date.now());
  await page.clock.pauseAt(new Date(pageNow + marginMs));
}

/**
 * Expects `count` skeletons, each announcing the loading with valid ARIA
 * attributes. The docs demos are rendered on the server and hydration doesn't
 * touch these attributes, so this checks the served HTML.
 */
export async function expectLoadingAnnouncement(skeletons: Locator, count: number) {
  await expect(skeletons).toHaveCount(count);

  for (const skeleton of await skeletons.all()) {
    await expect(skeleton).toHaveAttribute("aria-label", "Carregando...");
    await expect(skeleton).toHaveAttribute("aria-live", "polite");
    await expect(skeleton).not.toHaveAttribute("arialabel");
    await expect(skeleton).not.toHaveAttribute("arialive");
  }
}

/**
 * Waits for the page's animations to finish, except the ones that never end (e.g. loading
 * indicators). Vuetify animates overlays with both CSS transitions and the Web Animations API.
 */
export async function waitForAnimations(page: Page) {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => undefined)),
    ),
  );
}

/**
 * Checks the page's demos and overlays (e.g. toasts and dialogs, which render outside the demos)
 * against WCAG 2.2 AA and axe's best practices, failing on any violation. The docs' own content is
 * left out, since it isn't part of the library.
 *
 * The check runs in both of the docs' color schemes, since the demos sit on the docs' background,
 * which turns dark in dark mode while the components keep their light theme.
 *
 * `enableRules` also runs rules outside those tags, such as axe's experimental ones, by their ids.
 */
export async function expectNoA11yViolations(
  page: Page,
  { enableRules = [] }: { enableRules?: string[] } = {},
) {
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    // The docs follow the system's color scheme, switching the `dark` class on `html`
    const html = expect(page.locator("html"));
    await (colorScheme === "dark" ? html : html.not).toHaveClass(/\bdark\b/);
    await expectNoA11yViolationsInColorScheme(page, colorScheme, enableRules);
  }

  await page.emulateMedia({ colorScheme: "light" });
}

async function expectNoA11yViolationsInColorScheme(
  page: Page,
  colorScheme: "light" | "dark",
  enableRules: string[],
) {
  // Elements still fading in or out would be measured with partial contrast
  await waitForAnimations(page);

  // Axe can't tell the background of text covered by another element, and skips its contrast. So
  // it'd skip every button and field, whose text sits under Vuetify's decorative layers: the
  // overlay and underlay that tint them on hover, focus and press, and the fields' outline. During
  // the check, the tints are hidden and the outline goes behind the field, since it holds the
  // field's label, which hiding would take from the field's accessible name
  const decorativeLayers = await page.addStyleTag({
    content: `
      [class$="__overlay"], [class*="__overlay "], [class$="__underlay"], [class*="__underlay "] {
        display: none !important;
      }
      .v-field__outline { z-index: -1 !important; }
    `,
  });

  const { violations } = await new AxeBuilder({ page })
    .include(".demo")
    .include(".playground")
    .include(".v-overlay-container")
    // A single `options()` call, since `disableRules()` would discard the rules enabled here
    .options({
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
      },
      rules: {
        // The docs show several demos per page, inside their own `main` landmark, so these rules
        // fail on the page's layout: e.g. each `UMain` demo adds a `main` inside the docs' one, and
        // each `UDataSet` demo adds a pagination landmark with the same name
        "landmark-main-is-top-level": { enabled: false },
        "landmark-no-duplicate-main": { enabled: false },
        "landmark-unique": { enabled: false },
        ...Object.fromEntries(enableRules.map((rule) => [rule, { enabled: true }])),
      },
    })
    .analyze();

  await decorativeLayers.evaluate((element) => element.parentNode?.removeChild(element));

  expect(violations, `violations in the ${colorScheme} color scheme`).toEqual([]);
}

/**
 * Text shades of the theme colors set by `createUimed()` (`src/index.ts`), as computed styles
 * report them. Buttons without a fill (secondary and ghost) take them as their color, and links
 * take `link`.
 */
export const themeTextRgb = {
  primary: "rgb(7, 77, 49)",
  danger: "rgb(201, 42, 30)",
  link: "rgb(2, 113, 173)",
} as const;

/** Expects a button outlined by a solid border in `borderColor`, without a fill. */
export async function expectOutlinedButton(button: Locator, borderColor: string) {
  await expect(button).toContainClass("v-btn--variant-outlined");
  await expect(button).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(button).toHaveCSS("border-top-style", "solid");
  await expect(button).not.toHaveCSS("border-top-width", "0px");
  await expect(button).toHaveCSS("border-top-color", borderColor);
}

/**
 * Contrast of a field's placeholder and of its underline (or outline) with the background behind
 * the field, which axe doesn't measure. Against WCAG AA, the placeholder is text (4.5:1) and the
 * underline is an interface component (3:1).
 */
export async function getFieldContrast(input: Locator) {
  return input.evaluate((element) => {
    const channels = (color: string) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
      return { rgb: [red, green, blue], alpha: alpha / 255 };
    };
    const luminance = (rgb: number[]) => {
      const [red, green, blue] = rgb.map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    };
    const field = element.closest(".v-field")!;
    let background = [255, 255, 255];
    for (let ancestor: Element | null = field; ancestor; ancestor = ancestor.parentElement) {
      const color = channels(getComputedStyle(ancestor).backgroundColor);
      if (color.alpha === 1) {
        background = color.rgb;
        break;
      }
    }
    // The color as drawn on the background, with its own alpha and the element's opacity
    const contrastOf = (color: string, opacity: string) => {
      const { rgb, alpha } = channels(color);
      const drawn = rgb.map((channel, index) => {
        const weight = alpha * Number(opacity);
        return channel * weight + background[index] * (1 - weight);
      });
      const [lighter, darker] = [luminance(drawn), luminance(background)].sort((a, b) => b - a);
      return (lighter + 0.05) / (darker + 0.05);
    };
    const placeholder = getComputedStyle(element, "::placeholder");
    const underline = getComputedStyle(field.querySelector(".v-field__outline")!, "::before");

    return {
      placeholder: contrastOf(placeholder.color, placeholder.opacity),
      underline: contrastOf(underline.borderBottomColor, underline.opacity),
    };
  });
}
