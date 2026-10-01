import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { localeOptions } from "@/composables/locale/constants.ts";

const vuetify = createVuetify({ components, directives, locale: localeOptions });

/**
 * Vue Test Utils plugin for Uimed.
 */
export function vueTestUtilsPluginUimed(): ReturnType<typeof createVuetify> {
  globalThis.ResizeObserver = require("resize-observer-polyfill");

  return vuetify;
}
