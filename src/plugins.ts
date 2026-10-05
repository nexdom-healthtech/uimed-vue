import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import type { AsyncCompiler } from "sass-embedded";
import type { Plugin, UserConfig } from "vite-plus";

/** Matches the ids of CSS files, with or without a query */
const stylesheet = /\.css(?:\?|$)/;

/** Path of Vuetify's stylesheets folder, inside the `node_modules` folder where it's installed */
const vuetifyStylesheets = "/node_modules/vuetify/lib/";

/**
 * Matches the queries that import a stylesheet's file as is (`?raw`) or its URL (`?url`), which
 * Vite doesn't compile. The URL still serves the compiled stylesheet, which Vite loads separately
 */
const uncompiledStylesheetQuery = /[?&](?:raw|url)\b/;

/**
 * Vite plugin that compiles the components' styles with the library's font and Sass settings.
 * Required: without it, the components lose the Unimed Slab font. Needs `sass-embedded`, a peer
 * dependency.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { vitePluginUimed } from "@nexdom/uimed-vue/plugins";
 *
 * export default defineConfig({
 *   plugins: [vue(), vitePluginUimed()],
 * });
 * ```
 */
export function vitePluginUimed(): Plugin[] {
  const settings = new URL("./styles/settings.scss", import.meta.url);
  let compiler: Promise<AsyncCompiler> | undefined;

  return [
    {
      // Compiles each Vuetify stylesheet the app loads from its Sass source with the library's
      // settings. Sass and Vuetify are resolved from the library and from the stylesheet's path, not
      // from the app's root, where package managers with isolated `node_modules` don't place them
      name: "uimed:vuetify-styles",
      enforce: "pre",
      load: {
        // Lets Vite skip the plugin for the modules that aren't stylesheets, without calling it
        filter: { id: { include: stylesheet, exclude: uncompiledStylesheetQuery } },
        async handler(id) {
          // The filter only passes CSS files. Their ids may have a query and Windows separators
          const file = id.split("?")[0].replaceAll("\\", "/");
          // Leaves the stylesheets outside Vuetify to Vite
          const folder = file.lastIndexOf(vuetifyStylesheets);
          if (folder === -1) return null;

          // The folder where Vuetify is installed
          const nodeModules = `${file.slice(0, folder)}/node_modules`;
          const source = [".sass", ".scss"]
            .map((extension) => `${file.slice(0, -".css".length)}${extension}`)
            .find((path) => existsSync(path));
          if (!source) return null;

          compiler ??= import("sass-embedded").then((sass) => sass.initAsyncCompiler());
          const sass = await compiler;
          const entry = `@use "${settings.href}";\n@use "${pathToFileURL(source).href}";`;
          // Vuetify's settings and the stylesheet must be loaded from the same folder, or Sass
          // loads them as two modules and ignores the library's settings
          const { css } = await sass.compileStringAsync(entry, { loadPaths: [nodeModules] });

          return css;
        },
      },
      async closeBundle() {
        const current = compiler;
        compiler = undefined;
        await (await current)?.dispose();
      },
    },
  ];
}

/**
 * Vitest Server plugin for UIMed.
 */
export function vitestServerPluginUimed(): NonNullable<NonNullable<UserConfig["test"]>["server"]> {
  return { deps: { inline: ["vuetify", "@nexdom/uimed-vue"] } };
}
