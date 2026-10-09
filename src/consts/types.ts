import type { icons } from "@/consts/icons.ts";

/**
 * Name of an icon available to the components that accept one (e.g. `UIconButton` and the items
 * of the navigation menu). The full list, with a preview of each icon, is on the "Ícones" guide
 * page.
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/icons | Icons Guide}
 */
export type Icon = keyof typeof icons;
