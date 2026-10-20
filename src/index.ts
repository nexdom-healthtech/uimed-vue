import "vuetify/styles";
import "./styles/fonts/fonts.css";
import { createVuetify } from "vuetify";
import { type Plugin } from "vue";
import { mdi } from "vuetify/iconsets/mdi-svg";
import { icons } from "@/consts/icons.ts";
import { localeOptions } from "@/consts/locale.ts";

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
      themes: {
        light: {
          dark: false,
          colors: {
            background: "#EAEDF0",
            surface: "#FCFCFD",
            primary: "#074D31",
            secondary: "#FCFCFD",
            success: "#A9EFC5",
            warning: "#FFE596",
            error: "#D92D20",
            info: "#9ACBE5",
            // Without it, Vuetify generates pure white for the text on the primary fill, instead of
            // the surface's off-white
            "on-primary": "#FCFCFD",
            // Shades of the colors above for when they're the text color (e.g. in ghost buttons).
            // Primary is dark enough to be its own text; the others are darker, since their fills
            // are too light to reach 4.5:1 on the surface or background
            "primary-text": "#074D31",
            "success-text": "#16783E",
            "info-text": "#277096",
            "warning-text": "#846300",
            "error-text": "#C92A1E",
          },
          variables: {
            "border-color": "#D0D5DD",
            // Vuetify's 0.6 renders secondary text (e.g. subtitles and field labels) with a
            // contrast of 4.3:1 on the surface, below WCAG AA's 4.5:1
            "medium-emphasis-opacity": 0.7,
          },
        },
      },
    },
  });
}
