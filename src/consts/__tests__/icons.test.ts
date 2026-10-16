import { icons } from "@/consts/icons.ts";
import * as mdiIcons from "@mdi/js";

// SVG path of each icon of the installed `@mdi/js`, by its name. Some icons share a path
const mdiIconPaths = Object.entries(mdiIcons);
const mdiPaths = Object.values(mdiIcons);
const mappedIcons = Object.entries(icons);
const alternativeSuffix = "-alternative";
// Names that share a drawing with another one, since the underlying components draw both by alias
const sharedDrawings = [
  ["clear", "error"],
  ["dropdown", "subgroup"],
];

function getIconNames(path: string) {
  return mdiIconPaths.filter(([, iconPath]) => iconPath === path).map(([name]) => name);
}

describe("icons", () => {
  it.each(mappedIcons)("should map %s to an icon of the installed @mdi/js", (_, path) => {
    expect(mdiPaths).toContain(path);
  });

  it("should map each name to a different icon, except the aliases that share a drawing", () => {
    const paths = [...new Set(Object.values(icons))];
    const sharedNames = paths
      .map((path) => mappedIcons.filter(([, iconPath]) => iconPath === path).map(([name]) => name))
      .filter((names) => names.length > 1);

    expect(sharedNames).toEqual(sharedDrawings);
  });

  it.each(mappedIcons.filter(([icon]) => icon.endsWith(alternativeSuffix)))(
    "should map %s to the outlined version of its base icon",
    (icon, path) => {
      const base = icon.slice(0, -alternativeSuffix.length);
      const [, basePath = ""] = mappedIcons.find(([name]) => name === base) ?? [];
      const outlinedNames = getIconNames(basePath).map((name) => `${name}Outline`);
      const names = getIconNames(path);

      expect(outlinedNames.filter((name) => names.includes(name))).not.toHaveLength(0);
    },
  );
});
