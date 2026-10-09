/**
 * Names of the icons available to the components that accept one (e.g. `UIconButton` and the
 * items of the navigation menu), in the order the "Ícones" guide page lists them. A name ending
 * in `-alternative` is an alternative version of the same drawing (currently, outlined).
 *
 * Like the rest of the library, it's meant for apps built with a bundler (e.g. Vite), as importing
 * it also imports the library's styles.
 *
 * @example
 * ```ts
 * import { icons } from "@nexdom/uimed-vue";
 *
 * const isIcon = (name: string) => icons.some((icon) => icon === name);
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/icons | Icons Guide}
 */
export const icons = [
  "home",
  "home-alternative",
  "account",
  "account-alternative",
  "account-group",
  "account-group-alternative",
  "calendar",
  "calendar-alternative",
  "clipboard-text",
  "clipboard-text-alternative",
  "file-document",
  "file-document-alternative",
  "flask",
  "flask-alternative",
  "folder",
  "folder-alternative",
  "chart-box",
  "chart-box-alternative",
  "wallet",
  "wallet-alternative",
  "cog",
  "cog-alternative",
  "stethoscope",
  "pill",
  "hospital",
] as const;

/**
 * Name of an icon available to the components that accept one (e.g. `UIconButton` and the items
 * of the navigation menu): one of {@link icons}. The full list, with a preview of each icon, is on
 * the "Ícones" guide page.
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/icons | Icons Guide}
 */
export type Icon = (typeof icons)[number];

/**
 * Icon font class of each {@link Icon}.
 */
export const iconToVuetifyIcon: Record<Icon, string> = {
  home: "mdi-home",
  "home-alternative": "mdi-home-outline",
  account: "mdi-account",
  "account-alternative": "mdi-account-outline",
  "account-group": "mdi-account-group",
  "account-group-alternative": "mdi-account-group-outline",
  calendar: "mdi-calendar",
  "calendar-alternative": "mdi-calendar-outline",
  "clipboard-text": "mdi-clipboard-text",
  "clipboard-text-alternative": "mdi-clipboard-text-outline",
  "file-document": "mdi-file-document",
  "file-document-alternative": "mdi-file-document-outline",
  flask: "mdi-flask",
  "flask-alternative": "mdi-flask-outline",
  folder: "mdi-folder",
  "folder-alternative": "mdi-folder-outline",
  "chart-box": "mdi-chart-box",
  "chart-box-alternative": "mdi-chart-box-outline",
  wallet: "mdi-wallet",
  "wallet-alternative": "mdi-wallet-outline",
  cog: "mdi-cog",
  "cog-alternative": "mdi-cog-outline",
  stethoscope: "mdi-stethoscope",
  pill: "mdi-pill",
  hospital: "mdi-hospital-building",
};
