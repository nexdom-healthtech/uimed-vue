// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";
import { inBrowser, type Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "virtual:group-icons.css";
import "./style.css";

import { createUimed } from "../../../dist/index.js";
import Playground from "./components/playground.vue";
import Demo from "./components/demo.vue";

// The `UMain` demos open their navigation menu with Ctrl+K (⌘K on macOS), which also opens the docs
// search. The menu handles the key first, on `window`'s capture phase, and prevents its default,
// so stop the handled key here, before it bubbles up to the search listener on `window`
if (inBrowser) {
  document.addEventListener("keydown", (event) => {
    const isSearchShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
    if (isSearchShortcut && event.defaultPrevented) event.stopPropagation();
  });
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app }) {
    app.use(createUimed());
    // Lets the demos navigate to app routes (e.g. `ULink`'s) without leaving the docs page
    app.use(
      createRouter({
        history: createMemoryHistory(),
        routes: [{ path: "/:pathMatch(.*)*", component: { render: () => null } }],
      }),
    );
    app.component("Playground", Playground);
    app.component("Demo", Demo);
  },
} satisfies Theme;
