import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify, type ThemeDefinition } from "vuetify";
import { type Plugin } from "vue";

const light: ThemeDefinition = {
  dark: false,
  colors: {
    background: "#FCFCFD",
    surface: "#C0C9C0",
    primary: "#2A6A47",
    secondary: "#546524",
    success: "#17B26A",
    warning: "#F47920",
    error: "#D92D20",
    info: "#A4D8DE",
  },
  variables: {
    "border-color": "#FCFCFD",
  },
};

/**
 * Create an UIMed-Vue instance to be installed after [createApp](https://vuejs.org/guide/essentials/application.html#the-application-instance).
 * @returns an instance to be used with [app.use](https://vuejs.org/guide/essentials/application.html#the-application-instance)
 */
export function createUimed(): Plugin {
  return createVuetify({
    theme: {
      defaultTheme: "system",
      themes: {
        light,
        dark: {
          dark: true,
          colors: {
            ...light.colors,
            background: "053321",
          },
          variables: {
            ...light.variables,
            "border-color": "#344054",
          },
        },
      },
    },
  });
}
