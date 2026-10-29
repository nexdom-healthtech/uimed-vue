import "vuetify/styles";
import "./styles/fonts/fonts.css";
import { createVuetify, type ThemeDefinition } from "vuetify";
import { type Plugin } from "vue";
import { mdi } from "vuetify/iconsets/mdi-svg";
import { icons } from "@/consts/icons.ts";
import { localeOptions } from "@/consts/locale.ts";

/** The library's default theme, with its colors and the opacities of the text and borders */
const light: ThemeDefinition = {
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
    // The brand's dark green as the text on the background and the surfaces, instead of
    // Vuetify's black
    "on-background": "#053321",
    "on-surface": "#053321",
    // Secondary is the surface's off-white, so its text is the same dark green as the
    // surface's. Without it, filled secondary buttons keep black text while the outlined and
    // ghost ones are green
    "on-secondary": "#053321",
    // Without it, Vuetify generates pure white for the text on the primary fill, instead of
    // the surface's off-white
    "on-primary": "#FCFCFD",
    // Without it, Vuetify generates white text on the tertiary fill, with a contrast of 3.67:1,
    // below WCAG AA's 4.5:1
    "on-tertiary": "#000000",
    // Shades of the colors above for when they're the text color (e.g. in ghost buttons).
    // Primary is dark enough to be its own text; the others are darker, since their fills
    // are too light to reach 4.5:1 on the surface or background
    "primary-text": "#074D31",
    "tertiary-text": "#007547",
    "success-text": "#16783E",
    "info-text": "#277096",
    "warning-text": "#846300",
    "error-text": "#C92A1E",
    // Text color of `ULink`: a darker shade of the originally requested #027CBE, since that
    // one stays below 4.5:1 on the background
    link: "#0271AD",
  },
  variables: {
    "border-color": "#D0D5DD",
    // Renders the text in the exact #053321 (11.9:1 on the background). Vuetify's 0.87
    // lightens it to another shade of green
    "high-emphasis-opacity": 1,
    // Secondary text (e.g. subtitles and field labels) in the dark green reaches 5.34:1 on
    // the background and 4.72:1 on its active items (an overlay of 0.12 of the same color).
    // Vuetify's 0.6, and 0.7 on the active items, stay below WCAG AA's 4.5:1
    "medium-emphasis-opacity": 0.72,
    // Vuetify draws the fields' placeholders at the disabled opacity. Its 0.38 left them at
    // 2.22:1 on the surface and 2.17:1 on the background, below WCAG AA's 4.5:1. 0.77 is the
    // lowest that also keeps the navigation menu's search placeholder above it, on the tertiary
    // fill (4.56:1). The disabled elements share it, so they're less faded than Vuetify's
    "disabled-opacity": 0.77,
  },
};

/**
 * Create an UIMed-Vue instance to be installed after [createApp](https://vuejs.org/guide/essentials/application.html#the-application-instance).
 * @returns an instance to be used with [app.use](https://vuejs.org/guide/essentials/application.html#the-application-instance)
 */
export function createUimed(): Plugin {
  return createVuetify({
    // Draws the icons as SVGs, also the ones the components draw by alias
    icons: { defaultSet: "mdi", aliases: icons, sets: { mdi } },
    locale: localeOptions,
    theme: {
      defaultTheme: "light",
      themes: { light },
    },
  });
}
