import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { mdi } from "vuetify/iconsets/mdi-svg";
import { icons } from "@/consts/icons.ts";
import { localeOptions } from "@/consts/locale.ts";

const vuetify = createVuetify({
  components,
  directives,
  // Same icons as `createUimed()`
  icons: { defaultSet: "mdi", aliases: icons, sets: { mdi } },
  locale: localeOptions,
});

/**
 * Vue Test Utils plugin for Uimed.
 */
export function vueTestUtilsPluginUimed(): ReturnType<typeof createVuetify> {
  globalThis.ResizeObserver = require("resize-observer-polyfill");

  return vuetify;
}
