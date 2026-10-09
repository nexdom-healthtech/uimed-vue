// @vitest-environment node
// Reads the icon font's stylesheet from Node, as `src/__tests__/plugins.test.ts` does

import { icons } from "@/consts/icons.ts";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

// The installed icon font's stylesheet, which has a `.<class>::before` rule for each of its icons
const iconFontCss = readFileSync(
  createRequire(import.meta.url).resolve("@mdi/font/css/materialdesignicons.css"),
  "utf8",
);
const mappedIcons = Object.entries(icons);
const alternativeSuffix = "-alternative";

describe("icons", () => {
  it.each(mappedIcons)("should map %s to an icon of the installed icon font", (_, iconClass) => {
    expect(iconFontCss).toContain(`.${iconClass}::before {`);
  });

  it("should map each name to a different icon", () => {
    const iconClasses = new Set(Object.values(icons));

    expect(iconClasses.size).toBe(mappedIcons.length);
  });

  it.each(mappedIcons.filter(([icon]) => icon.endsWith(alternativeSuffix)))(
    "should map %s to the outlined version of its base icon",
    (icon, iconClass) => {
      const base = icon.slice(0, -alternativeSuffix.length);
      const [, baseIconClass] = mappedIcons.find(([name]) => name === base) ?? [];

      expect(iconClass).toBe(`${baseIconClass}-outline`);
    },
  );
});
