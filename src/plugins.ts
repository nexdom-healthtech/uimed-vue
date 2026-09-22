import { resolve } from "node:path";
import vitePluginVuetify from "vite-plugin-vuetify";
import type { UserConfig } from "vite-plus";

/**
 * Vite plugin for Uimed.
 */
export function vitePluginUimed(): ReturnType<typeof vitePluginVuetify> {
  return vitePluginVuetify({
    autoImport: false,
    styles: { configFile: resolve(__dirname, "styles/settings.scss") },
  });
}

/**
 * Vitest Server plugin for Uimed.
 */
export function vitestServerPluginUimed(): NonNullable<NonNullable<UserConfig["test"]>["server"]> {
  return { deps: { inline: ["vuetify"] } };
}
