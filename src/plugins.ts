import vitePluginVuetify from "vite-plugin-vuetify";
import type { UserConfig } from "vite-plus";

/**
 * Vite plugin for UIMed.
 */
export function vitePluginUimed(): ReturnType<typeof vitePluginVuetify> {
  return vitePluginVuetify({ autoImport: false });
}

/**
 * Vitest Server plugin for UIMed.
 */
export function vitestServerPluginUimed(): NonNullable<NonNullable<UserConfig["test"]>["server"]> {
  return { deps: { inline: ["vuetify", "@nexdom/uimed-vue"] } };
}
