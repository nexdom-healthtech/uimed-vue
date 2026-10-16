import {
  mdiAccount,
  mdiAccountGroup,
  mdiAccountGroupOutline,
  mdiAccountOutline,
  mdiAlertCircle,
  mdiBellOutline,
  mdiCalendar,
  mdiCalendarOutline,
  mdiChartBox,
  mdiChartBoxOutline,
  mdiCheckboxBlankOutline,
  mdiCheckboxMarked,
  mdiCheckCircle,
  mdiChevronDown,
  mdiChevronLeft,
  mdiChevronRight,
  mdiChevronUp,
  mdiClipboardText,
  mdiClipboardTextOutline,
  mdiClose,
  mdiCloseCircle,
  mdiCog,
  mdiCogOutline,
  mdiEye,
  mdiEyeOff,
  mdiFileDocument,
  mdiFileDocumentOutline,
  mdiFlask,
  mdiFlaskOutline,
  mdiFolder,
  mdiFolderOutline,
  mdiHelpCircleOutline,
  mdiHome,
  mdiHomeOutline,
  mdiHospitalBuilding,
  mdiInformation,
  mdiMagnify,
  mdiMenu,
  mdiMenuDown,
  mdiPill,
  mdiStethoscope,
  mdiWallet,
  mdiWalletOutline,
} from "@mdi/js";

/**
 * SVG path of each icon, by its name, in the order the "Ícones" guide page lists them. The paths
 * come from `@mdi/js`, which exports one constant per icon, so the apps' bundles only take the
 * icons used here.
 *
 * Every name can be passed to the components that accept an icon (e.g. `UIconButton` and the items
 * of the navigation menu). The map is also the set of icon aliases of the underlying components,
 * which draw some icons by name on their own (e.g. `close`, the arrows of the pagination and the
 * checkbox marks): those names must match the aliases exactly, and a component that renders an
 * alias missing here draws an empty icon. The unit tests of `src/consts/icons.ts` check each
 * component that renders one.
 *
 * - The first names describe the icon's drawing. A name ending in `Alternative` is an alternative
 *   version of the same drawing (currently, outlined).
 * - The others describe what the components use the icon for.
 *
 * To add an icon, add it here and to the list on the "Ícones" guide page (`docs/guide/icons.md`).
 */
export const icons = {
  home: mdiHome,
  homeAlternative: mdiHomeOutline,
  account: mdiAccount,
  accountAlternative: mdiAccountOutline,
  accountGroup: mdiAccountGroup,
  accountGroupAlternative: mdiAccountGroupOutline,
  calendar: mdiCalendar,
  calendarAlternative: mdiCalendarOutline,
  clipboardText: mdiClipboardText,
  clipboardTextAlternative: mdiClipboardTextOutline,
  fileDocument: mdiFileDocument,
  fileDocumentAlternative: mdiFileDocumentOutline,
  flask: mdiFlask,
  flaskAlternative: mdiFlaskOutline,
  folder: mdiFolder,
  folderAlternative: mdiFolderOutline,
  chartBox: mdiChartBox,
  chartBoxAlternative: mdiChartBoxOutline,
  wallet: mdiWallet,
  walletAlternative: mdiWalletOutline,
  cog: mdiCog,
  cogAlternative: mdiCogOutline,
  stethoscope: mdiStethoscope,
  pill: mdiPill,
  hospital: mdiHospitalBuilding,
  // Actions, such as the buttons of the app bar and of the fields
  help: mdiHelpCircleOutline,
  notifications: mdiBellOutline,
  menu: mdiMenu,
  search: mdiMagnify,
  showPassword: mdiEye,
  hidePassword: mdiEyeOff,
  close: mdiClose,
  // Same drawing as `error`: both are aliases of the underlying components
  clear: mdiCloseCircle,
  // Expansion of menus and groups. `dropdown` and `subgroup` (the month and year selection of the
  // date picker) are both aliases of the underlying components, with the same drawing
  dropdown: mdiMenuDown,
  subgroup: mdiMenuDown,
  expand: mdiChevronDown,
  collapse: mdiChevronUp,
  // Navigation between pages and months
  prev: mdiChevronLeft,
  next: mdiChevronRight,
  // Checkbox marks, named after the aliases of the underlying components
  checkboxOn: mdiCheckboxMarked,
  checkboxOff: mdiCheckboxBlankOutline,
  // Feedback, such as the toasts of each color
  success: mdiCheckCircle,
  info: mdiInformation,
  warning: mdiAlertCircle,
  error: mdiCloseCircle,
};
