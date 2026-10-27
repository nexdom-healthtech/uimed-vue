import { icons } from "@/consts/icons.ts";
import { createUimed } from "@/index.ts";
import { createVuetify, type ThemeDefinition } from "vuetify";
import { mdi } from "vuetify/iconsets/mdi-svg";
import { pt } from "vuetify/locale";

// The first test checks that `createUimed` sets this theme, so the contrast tests can read it
const light = {
  dark: false,
  colors: {
    background: "#EAEDF0",
    surface: "#FCFCFD",
    primary: "#074D31",
    secondary: "#FCFCFD",
    tertiary: "#00995D",
    success: "#A9EFC5",
    warning: "#FFE596",
    error: "#D92D20",
    info: "#9ACBE5",
    "on-background": "#053321",
    "on-surface": "#053321",
    "on-secondary": "#053321",
    "on-primary": "#FCFCFD",
    "on-tertiary": "#000000",
    "primary-text": "#074D31",
    "tertiary-text": "#007547",
    "success-text": "#16783E",
    "info-text": "#277096",
    "warning-text": "#846300",
    "error-text": "#C92A1E",
    link: "#0271AD",
  },
  variables: {
    "border-color": "#D0D5DD",
    "high-emphasis-opacity": 1,
    "medium-emphasis-opacity": 0.72,
  },
} satisfies ThemeDefinition;

// The navigation menu's theme, the same colors with readable placeholders on its tertiary fill
const navigation = { ...light, variables: { ...light.variables, "disabled-opacity": 0.8 } };

// WCAG AA's minimum contrast for text of normal size
const minContrast = 4.5;
// WCAG AA's minimum contrast for interface components, such as the fields' underline
const minComponentContrast = 3;
// `$field-outline-opacity` in `src/styles/settings.scss`, the opacity of the fields' underline and
// outline (checked against the compiled styles by the plugins' tests)
const fieldOutlineOpacity = 0.6;
// Vuetify's opacity for the overlay of active items (e.g. the selected item of a list), drawn in
// the item's text color
const activatedOpacity = 0.12;

vi.mock("vuetify", () => ({ createVuetify: vi.fn() }));

function toRgb(hex: string): number[] {
  return [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));
}

// https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
function luminance(rgb: number[]): number {
  const [red, green, blue] = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

// https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio
function contrast(foreground: number[], background: number[]): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function blend(foreground: number[], background: number[], opacity: number): number[] {
  return foreground.map((channel, index) => channel * opacity + background[index] * (1 - opacity));
}

describe("index", () => {
  describe("createUimed", () => {
    it("should call createVuetify", () => {
      expect(createVuetify).not.toHaveBeenCalled();

      createUimed();

      expect(createVuetify).toHaveBeenCalledOnce();
      expect(createVuetify).toHaveBeenCalledWith({
        icons: { defaultSet: "mdi", aliases: icons, sets: { mdi } },
        locale: { locale: "pt-BR", messages: { "pt-BR": pt } },
        theme: { defaultTheme: "light", themes: { light, navigation } },
      });
    });

    describe.each(["surface", "background"] as const)("contrast on the %s", (backgroundColor) => {
      const textColor = toRgb(light.colors[`on-${backgroundColor}`]);
      const { "high-emphasis-opacity": highEmphasis, "medium-emphasis-opacity": mediumEmphasis } =
        light.variables;

      it("should keep text above WCAG AA's minimum", () => {
        const background = toRgb(light.colors[backgroundColor]);
        const text = blend(textColor, background, highEmphasis);

        expect(contrast(text, background)).toBeGreaterThanOrEqual(minContrast);
      });

      it("should keep secondary text above WCAG AA's minimum", () => {
        const background = toRgb(light.colors[backgroundColor]);
        const text = blend(textColor, background, highEmphasis * mediumEmphasis);

        expect(contrast(text, background)).toBeGreaterThanOrEqual(minContrast);
      });

      it("should keep secondary text on an active item above WCAG AA's minimum", () => {
        const background = blend(textColor, toRgb(light.colors[backgroundColor]), activatedOpacity);
        const text = blend(textColor, background, highEmphasis * mediumEmphasis);

        expect(contrast(text, background)).toBeGreaterThanOrEqual(minContrast);
      });

      it("should keep the fields' underline above WCAG AA's minimum for interface components", () => {
        const background = toRgb(light.colors[backgroundColor]);
        const underline = blend(textColor, background, highEmphasis * fieldOutlineOpacity);

        expect(contrast(underline, background)).toBeGreaterThanOrEqual(minComponentContrast);
      });

      it.each([
        "primary-text",
        "tertiary-text",
        "success-text",
        "info-text",
        "warning-text",
        "error-text",
        "link",
      ] as const)("should keep `%s` above WCAG AA's minimum", (textColor) => {
        expect(
          contrast(toRgb(light.colors[textColor]), toRgb(light.colors[backgroundColor])),
        ).toBeGreaterThanOrEqual(minContrast);
      });
    });

    it.each([
      ["primary", "on-primary"],
      ["secondary", "on-secondary"],
      ["tertiary", "on-tertiary"],
    ] as const)("should keep the text on the %s fill above WCAG AA's minimum", (fill, onFill) => {
      const text = toRgb(light.colors[onFill]);

      expect(contrast(text, toRgb(light.colors[fill]))).toBeGreaterThanOrEqual(minContrast);
    });

    describe("navigation menu, on the tertiary fill", () => {
      const fill = toRgb(navigation.colors.tertiary);
      const text = toRgb(navigation.colors["on-tertiary"]);

      it("should keep the search's placeholder above WCAG AA's minimum", () => {
        const placeholder = blend(text, fill, navigation.variables["disabled-opacity"]);

        expect(contrast(placeholder, fill)).toBeGreaterThanOrEqual(minContrast);
      });

      it("should keep the search's underline above WCAG AA's minimum for interface components", () => {
        const underline = blend(text, fill, fieldOutlineOpacity);

        expect(contrast(underline, fill)).toBeGreaterThanOrEqual(minComponentContrast);
      });

      it("should keep the default theme's placeholders as they are elsewhere", () => {
        expect(light.variables).not.toHaveProperty("disabled-opacity");
      });
    });
  });
});
