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
          },
          variables: {
            "border-color": "#D0D5DD",
          },
        },
      },
    },
  });
}
