import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import "./styles/fonts/fonts.css";
import { createVuetify } from "vuetify";
import { type Plugin } from "vue";
import { localeOptions } from "@/consts/locale.ts";

/**
 * Create an UIMed-Vue instance to be installed after [createApp](https://vuejs.org/guide/essentials/application.html#the-application-instance).
 * @returns an instance to be used with [app.use](https://vuejs.org/guide/essentials/application.html#the-application-instance)
 */
export function createUimed(): Plugin {
  return createVuetify({
    locale: localeOptions,
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
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
            // White text on the primary fill has a contrast of 3.67:1, below WCAG AA's 4.5:1
            "on-primary": "#000000",
            // Darker shades of the colors above for when they're the text color (e.g. in ghost
            // buttons), since the fills are too light to reach 4.5:1 on the surface or background
            "primary-text": "#007A4A",
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
