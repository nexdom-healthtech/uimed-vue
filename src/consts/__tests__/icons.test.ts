// @vitest-environment node
// Reads the icon font's stylesheet from Node, as `src/__tests__/plugins.test.ts` does

import { iconToVuetifyIcon } from "@/consts/icons.ts";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

// The installed icon font's stylesheet, which has a `.<class>::before` rule for each of its icons
const iconFontCss = readFileSync(
  createRequire(import.meta.url).resolve("@mdi/font/css/materialdesignicons.css"),
  "utf8",
);
const icons = Object.entries(iconToVuetifyIcon);

describe("icons", () => {
  it.each(icons)("should map %s to an icon of the installed icon font", (_, vuetifyIcon) => {
    expect(iconFontCss).toContain(`.${vuetifyIcon}::before {`);
  });

  it("should map each name to a different icon", () => {
    const vuetifyIcons = new Set(Object.values(iconToVuetifyIcon));

    expect(vuetifyIcons.size).toBe(icons.length);
  });

  it.each(icons.filter(([icon]) => icon.endsWith("-outline")))(
    "should map %s to the outlined version of the same icon",
    (icon, vuetifyIcon) => {
      const [, filled] = icons.find(([name]) => `${name}-outline` === icon) ?? [];

      expect(vuetifyIcon).toBe(`${filled}-outline`);
    },
  );
});
