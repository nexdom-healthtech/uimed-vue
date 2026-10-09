import { createUimed } from "@/index.ts";
import { createVuetify, type ThemeDefinition } from "vuetify";
import { pt } from "vuetify/locale";

// The first test checks that `createUimed` sets this theme, so the contrast tests can read it
const light = {
  dark: false,
  colors: {
    background: "#EAEDF0",
    surface: "#FCFCFD",
    primary: "#00995D",
    secondary: "#FCFCFD",
    success: "#A9EFC5",
    warning: "#FFE596",
    error: "#D92D20",
    info: "#9ACBE5",
    "on-primary": "#000000",
    "primary-text": "#007A4A",
    "success-text": "#16783E",
    "info-text": "#277096",
    "warning-text": "#846300",
    "error-text": "#C92A1E",
  },
  variables: {
    "border-color": "#D0D5DD",
    "medium-emphasis-opacity": 0.7,
  },
} satisfies ThemeDefinition;

// WCAG AA's minimum contrast for text of normal size
const minContrast = 4.5;
// Vuetify's opacity for the theme's text color, on top of which secondary text applies
// `medium-emphasis-opacity`
const highEmphasisOpacity = 0.87;

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
        locale: { locale: "pt-BR", messages: { "pt-BR": pt } },
        theme: { defaultTheme: "light", themes: { light } },
      });
    });

    describe.each(["surface", "background"] as const)("contrast on the %s", (backgroundColor) => {
      it("should keep secondary text above WCAG AA's minimum", () => {
        const background = toRgb(light.colors[backgroundColor]);
        const opacity = highEmphasisOpacity * light.variables["medium-emphasis-opacity"];
        const text = blend([0, 0, 0], background, opacity);

        expect(contrast(text, background)).toBeGreaterThanOrEqual(minContrast);
      });

      it.each(["primary-text", "success-text", "info-text", "warning-text", "error-text"] as const)(
        "should keep `%s` above WCAG AA's minimum",
        (textColor) => {
          expect(
            contrast(toRgb(light.colors[textColor]), toRgb(light.colors[backgroundColor])),
          ).toBeGreaterThanOrEqual(minContrast);
        },
      );
    });

    it("should keep the text on the primary fill above WCAG AA's minimum", () => {
      const text = toRgb(light.colors["on-primary"]);

      expect(contrast(text, toRgb(light.colors.primary))).toBeGreaterThanOrEqual(minContrast);
    });
  });
});
