import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({ components, directives });

/**
 * Vue Test Utils plugin for Uimed.
 */
export function vueTestUtilsPluginUimed(): ReturnType<typeof createVuetify> {
  global.ResizeObserver = require("resize-observer-polyfill");

  return vuetify;
}
