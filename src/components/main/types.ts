import type { AppBarProps } from "@/components/app-bar/types.ts";
import type { NavigationMenuProps } from "@/components/navigation-menu/types.ts";
import type { FooterProps } from "@/components/footer/types.ts";

/**
 * Props exposed by the {@link Main} component.
 */
export type MainProps = {
  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;

  /**
   * URL to logo image.
   *
   * The logo is decorative (`alt=""`): screen readers identify the app by
   * the app bar title (`appBar.title`).
   */
  logo?: string;

  /**
   * App bar properties.
   */
  appBar?: AppBarProps;

  /**
   * Navigation menu properties.
   */
  navigationMenu?: NavigationMenuProps;

  /**
   * Footer properties. The footer is fixed at the bottom of the screen and
   * is hidden when it's omitted or its `description` is empty.
   *
   * @example
   * ```vue
   * <u-main :footer="{ description: `Versão ${version}` }" />
   * ```
   */
  footer?: FooterProps;

  /**
   * Shows skeleton loaders in place of the user-related parts of the app bar
   * and of the navigation menu items while their data is being loaded.
   * The main content (default slot) isn't affected.
   * @default false
   */
  loading?: boolean;
};
