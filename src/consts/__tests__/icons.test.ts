// @vitest-environment node
// Reads the icon font's stylesheet from Node, as `src/__tests__/plugins.test.ts` does

import { iconToVuetifyIcon, icons } from "@/consts/icons.ts";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

// The installed icon font's stylesheet, which has a `.<class>::before` rule for each of its icons
const iconFontCss = readFileSync(
  createRequire(import.meta.url).resolve("@mdi/font/css/materialdesignicons.css"),
  "utf8",
);
const mappedIcons = Object.entries(iconToVuetifyIcon);
const alternativeSuffix = "-alternative";

describe("icons", () => {
  describe("icons", () => {
    it("should list each name once", () => {
      expect(new Set(icons).size).toBe(icons.length);
    });

    it("should list the names in the same order as `iconToVuetifyIcon`", () => {
      expect(Object.keys(iconToVuetifyIcon)).toEqual(icons);
    });
  });

  describe("iconToVuetifyIcon", () => {
    it.each(mappedIcons)(
      "should map %s to an icon of the installed icon font",
      (_, vuetifyIcon) => {
        expect(iconFontCss).toContain(`.${vuetifyIcon}::before {`);
      },
    );

    it("should map each name to a different icon", () => {
      const vuetifyIcons = new Set(Object.values(iconToVuetifyIcon));

      expect(vuetifyIcons.size).toBe(mappedIcons.length);
    });

    it.each(mappedIcons.filter(([icon]) => icon.endsWith(alternativeSuffix)))(
      "should map %s to the outlined version of its base icon",
      (icon, vuetifyIcon) => {
        const base = icon.slice(0, -alternativeSuffix.length);
        const [, baseVuetifyIcon] = mappedIcons.find(([name]) => name === base) ?? [];

        expect(vuetifyIcon).toBe(`${baseVuetifyIcon}-outline`);
      },
    );
  });
});
