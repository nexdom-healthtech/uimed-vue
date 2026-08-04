import vitePluginVuetify from "vite-plugin-vuetify";

/**
 * Vite plugin for Uimed.
 */
export function vitePluginUimed(): ReturnType<typeof vitePluginVuetify> {
  return vitePluginVuetify({ autoImport: false });
}
