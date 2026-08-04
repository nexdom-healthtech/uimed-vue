import vitePluginVuetify from "vite-plugin-vuetify";

// TODO: add JSDoc
export function vitePluginUimed(): ReturnType<typeof vitePluginVuetify> {
  return vitePluginVuetify({ autoImport: false });
}
