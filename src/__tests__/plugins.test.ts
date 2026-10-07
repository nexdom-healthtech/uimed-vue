// @vitest-environment node
// The plugins run in Node: in browser environments, Vite rewrites `new URL(path, import.meta.url)`
// into a dev server URL

import { vitePluginUimed, vitestServerPluginUimed } from "@/plugins.ts";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { initAsyncCompiler, type AsyncCompiler } from "sass-embedded";
import type { Plugin } from "vite-plus";

vi.mock("node:fs", async (importOriginal) => {
  const fs = await importOriginal<typeof import("node:fs")>();
  return { ...fs, existsSync: vi.fn(fs.existsSync) };
});

vi.mock("sass-embedded", async (importOriginal) => {
  const sass = await importOriginal<typeof import("sass-embedded")>();
  return { ...sass, initAsyncCompiler: vi.fn(sass.initAsyncCompiler) };
});

// The installed Vuetify, with posix separators, as Vite passes module ids to plugins
const vuetifyPackage = createRequire(import.meta.url).resolve("vuetify/package.json");
const vuetify = dirname(vuetifyPackage).replaceAll("\\", "/");
// `vuetify/styles`, compiled from a `.sass` source. It's large: the other tests use small stylesheets
const styles = `${vuetify}/lib/styles/main.css`;
// Small stylesheets that use the body font, compiled from `.sass` and `.scss` sources
const badge = `${vuetify}/lib/components/VBadge/VBadge.css`;
const kbd = `${vuetify}/lib/components/VKbd/VKbd.css`;
const font = 'font-family: var(--v-font-body, "Unimed Slab", sans-serif);';
// The installed icon font's stylesheet, with posix separators
const iconFontStylesheet = createRequire(import.meta.url)
  .resolve("@mdi/font/css/materialdesignicons.css")
  .replaceAll("\\", "/");
const iconFontCss = readFileSync(iconFontStylesheet, "utf8");
const fontDisplay = " font-display: swap;";

describe("plugins", () => {
  describe("vitePluginUimed", () => {
    let plugin: Plugin;
    let iconFont: Plugin;

    beforeEach(() => {
      [plugin, iconFont] = vitePluginUimed();
    });

    afterEach(async () => {
      await closeBundle(plugin);
    });

    it("should return the styles and icon font plugins, which run before the others", () => {
      expect(vitePluginUimed()).toHaveLength(2);
      expect(plugin).toMatchObject({ name: "uimed:vuetify-styles", enforce: "pre" });
      expect(iconFont).toMatchObject({ name: "uimed:icon-font", enforce: "pre" });
    });

    it("should compile Vuetify's global styles with the library's font", async () => {
      const css = await load(plugin, styles);

      expect(css).toContain(font);
      expect(css).not.toContain("Roboto");
    });

    it("should compile Vuetify stylesheets from SCSS sources", async () => {
      const css = await load(plugin, kbd);

      expect(css).toContain(font);
      expect(css).not.toContain("Roboto");
    });

    it.each([
      ["a version", "?v=1a2b3c4d"],
      ["an inline import", "?inline"],
    ])("should compile Vuetify stylesheets with the query of %s", async (_, query) => {
      const css = await load(plugin, `${badge}${query}`);

      expect(css).toContain(font);
      expect(css).not.toContain("Roboto");
    });

    it("should compile Vuetify's labs stylesheets", async () => {
      const css = await load(plugin, `${vuetify}/lib/labs/VHighlight/VHighlight.css`);

      expect(css).toContain(".v-highlight");
      expect(initAsyncCompiler).toHaveBeenCalledOnce();
    });

    it("should compile Vuetify's list item subtitles with the font's own line height", async () => {
      const css = await load(plugin, `${vuetify}/lib/components/VList/VListItem.css`);

      expect(css).toMatch(/\.v-list-item-subtitle \{[^}]*line-height: normal;/);
    });

    it("should look for the Sass sources of Vuetify stylesheets with Windows separators", async () => {
      const windowsVuetify = String.raw`C:\app\node_modules\vuetify`;

      await expect(
        load(plugin, String.raw`${windowsVuetify}\lib\components\VList\VListItem.css`),
      ).resolves.toBeNull();

      expect(existsSync).toHaveBeenCalledTimes(2);
      expect(existsSync).toHaveBeenCalledWith(
        "C:/app/node_modules/vuetify/lib/components/VList/VListItem.sass",
      );
      expect(existsSync).toHaveBeenCalledWith(
        "C:/app/node_modules/vuetify/lib/components/VList/VListItem.scss",
      );
    });

    it.each([
      ["stylesheets outside Vuetify", "/app/src/main.css"],
      ["stylesheets outside Vuetify with a query", "/app/src/main.css?v=1a2b3c4d"],
      ["Vuetify stylesheets outside its Sass sources folder", `${vuetify}/dist/vuetify.css`],
      ["files that aren't stylesheets", `${vuetify}/lib/components/VList/VListItem.css.map`],
      ["stylesheets imported as is", `${badge}?raw`],
      ["stylesheets imported as URLs", `${badge}?url`],
      ["stylesheets imported as is with other queries", `${badge}?v=1a2b3c4d&raw`],
    ])("should leave %s to Vite, without looking for a Sass source", async (_, id) => {
      await expect(load(plugin, id)).resolves.toBeNull();

      expect(existsSync).not.toHaveBeenCalled();
      expect(initAsyncCompiler).not.toHaveBeenCalled();
    });

    it("should leave Vuetify stylesheets without a Sass source to Vite", async () => {
      await expect(
        load(plugin, `${vuetify}/lib/components/VList/VListMissing.css`),
      ).resolves.toBeNull();

      expect(existsSync).toHaveBeenCalledTimes(2);
      expect(initAsyncCompiler).not.toHaveBeenCalled();
    });

    it("should reuse the Sass compiler between stylesheets", async () => {
      await Promise.all([load(plugin, badge), load(plugin, kbd)]);

      expect(initAsyncCompiler).toHaveBeenCalledOnce();
    });

    it("should dispose the Sass compiler when the bundle closes and start another one if needed", async () => {
      await load(plugin, badge);
      const compiler: AsyncCompiler = await vi.mocked(initAsyncCompiler).mock.results[0]?.value;
      const dispose = vi.spyOn(compiler, "dispose");

      await closeBundle(plugin);

      expect(dispose).toHaveBeenCalledOnce();

      await expect(load(plugin, badge)).resolves.toContain(font);
      expect(initAsyncCompiler).toHaveBeenCalledTimes(2);
    });

    it("should close the bundle without a Sass compiler", async () => {
      await expect(closeBundle(plugin)).resolves.toBeUndefined();
    });

    describe("icon font", () => {
      it("should load the installed icon font with font-display swap", () => {
        const css = transform(iconFont, iconFontStylesheet, iconFontCss);

        expect(css).toContain(
          '@font-face { font-display: swap;\n  font-family: "Material Design Icons";',
        );
      });

      it("should change nothing in the icon font's stylesheet besides its font-face", () => {
        const css = transform(iconFont, iconFontStylesheet, iconFontCss);

        expect(css?.split(fontDisplay)).toHaveLength(2);
        expect(css?.replace(fontDisplay, "")).toBe(iconFontCss);
      });

      it.each([
        ["a version", "/app/node_modules/@mdi/font/css/materialdesignicons.css?v=1a2b3c4d"],
        ["an inline import", "/app/node_modules/@mdi/font/css/materialdesignicons.css?inline"],
        [
          "Windows separators",
          String.raw`C:\app\node_modules\@mdi\font\css\materialdesignicons.css`,
        ],
      ])("should load the icon font with font-display swap from ids with %s", (_, id) => {
        expect(transform(iconFont, id, "@font-face {}")).toBe("@font-face { font-display: swap;}");
      });

      it("should leave the icon font's stylesheet as is when it has no font-face", () => {
        expect(transform(iconFont, iconFontStylesheet, ".mdi {}")).toBe(".mdi {}");
      });

      it.each([
        ["stylesheets imported as is", `${iconFontStylesheet}?raw`],
        ["stylesheets imported as URLs", `${iconFontStylesheet}?url`],
        ["stylesheets imported as is with other queries", `${iconFontStylesheet}?v=1a2b3c4d&raw`],
        ["other stylesheets", "/app/src/main.css"],
        [
          "other stylesheets of the icon font",
          "/app/node_modules/@mdi/font/css/materialdesignicons.min.css",
        ],
        [
          "files that aren't stylesheets",
          "/app/node_modules/@mdi/font/css/materialdesignicons.css.map",
        ],
        ["stylesheets outside node_modules", "/app/@mdi/font/css/materialdesignicons.css"],
      ])("should leave %s to Vite", (_, id) => {
        expect(transform(iconFont, id, "@font-face {}")).toBeNull();
      });
    });
  });

  describe("vitestServerPluginUimed", () => {
    it("should return vuetify as inline deps", () => {
      const server = vitestServerPluginUimed();
      expect(server).toEqual({ deps: { inline: ["vuetify", "@nexdom/uimed-vue"] } });
    });
  });
});

interface LoadHook {
  filter: { id: { include: RegExp; exclude: RegExp } };
  handler: (id: string) => Promise<string | null>;
}

/**
 * Loads a module with the plugin as Vite does: the plugin is only called for the ids its filter
 * includes and doesn't exclude
 */
function load(plugin: Plugin, id: string) {
  const { filter, handler } = plugin.load as LoadHook;
  const included = filter.id.include.test(id) && !filter.id.exclude.test(id);

  return included ? handler(id) : Promise.resolve(null);
}

interface TransformHook {
  filter: { id: { include: RegExp; exclude: RegExp } };
  handler: (code: string) => string;
}

/**
 * Transforms a module with the plugin as Vite does: the plugin is only called for the ids its
 * filter includes and doesn't exclude
 */
function transform(plugin: Plugin, id: string, code: string) {
  const { filter, handler } = plugin.transform as TransformHook;
  const included = filter.id.include.test(id) && !filter.id.exclude.test(id);

  return included ? handler(code) : null;
}

function closeBundle(plugin: Plugin) {
  return (plugin.closeBundle as () => Promise<void>)();
}
