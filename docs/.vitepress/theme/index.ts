// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "virtual:group-icons.css";
import "./style.css";

import { createUimed } from "../../../dist/index.js";
import Playground from "./components/playground.vue";
import Demo from "./components/demo.vue";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app }) {
    app.use(createUimed());
    app.component("Playground", Playground);
    app.component("Demo", Demo);
  },
} satisfies Theme;
