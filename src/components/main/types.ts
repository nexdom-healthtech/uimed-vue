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
};
