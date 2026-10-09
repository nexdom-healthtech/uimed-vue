/**
 * Name of an icon available to the components that accept one (e.g. the items of the navigation
 * menu). The full list, with a preview of each icon, is on the "Ícones" guide page.
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/icons | Icons Guide}
 */
export type Icon =
  | "home"
  | "home-outline"
  | "account"
  | "account-outline"
  | "account-group"
  | "account-group-outline"
  | "calendar"
  | "calendar-outline"
  | "clipboard-text"
  | "clipboard-text-outline"
  | "file-document"
  | "file-document-outline"
  | "flask"
  | "flask-outline"
  | "folder"
  | "folder-outline"
  | "chart-box"
  | "chart-box-outline"
  | "wallet"
  | "wallet-outline"
  | "cog"
  | "cog-outline"
  | "stethoscope"
  | "pill"
  | "hospital";

/**
 * Icon font class of each {@link Icon}.
 */
export const iconToVuetifyIcon: Record<Icon, string> = {
  home: "mdi-home",
  "home-outline": "mdi-home-outline",
  account: "mdi-account",
  "account-outline": "mdi-account-outline",
  "account-group": "mdi-account-group",
  "account-group-outline": "mdi-account-group-outline",
  calendar: "mdi-calendar",
  "calendar-outline": "mdi-calendar-outline",
  "clipboard-text": "mdi-clipboard-text",
  "clipboard-text-outline": "mdi-clipboard-text-outline",
  "file-document": "mdi-file-document",
  "file-document-outline": "mdi-file-document-outline",
  flask: "mdi-flask",
  "flask-outline": "mdi-flask-outline",
  folder: "mdi-folder",
  "folder-outline": "mdi-folder-outline",
  "chart-box": "mdi-chart-box",
  "chart-box-outline": "mdi-chart-box-outline",
  wallet: "mdi-wallet",
  "wallet-outline": "mdi-wallet-outline",
  cog: "mdi-cog",
  "cog-outline": "mdi-cog-outline",
  stethoscope: "mdi-stethoscope",
  pill: "mdi-pill",
  hospital: "mdi-hospital-building",
};
