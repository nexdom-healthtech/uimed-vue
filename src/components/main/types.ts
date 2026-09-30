import type { AppBarProps } from "@/components/app-bar/types.ts";
import type { NavigationMenuProps } from "@/components/navigation-menu/types.ts";

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
   * Shows skeleton loaders in place of the user-related parts of the app bar
   * and of the navigation menu items while their data is being loaded.
   * The main content (default slot) isn't affected.
   * @default false
   */
  loading?: boolean;
};
