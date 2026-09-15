import type { RouteLocationRaw } from "vue-router";

/**
 * Props exposed by the {@link NavigationMenu} component.
 */
export type NavigationMenuProps = {
  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;

  /**
   * List of items to show in the {@link NavigationMenu}.
   * Can be plain items, grouped or both.
   */
  items?: Array<NavigationMenuParentItemOrItem>;
};

export type NavigationMenuParentItemOrItem = NavigationMenuParentItem | NavigationMenuItem;

export type NavigationMenuParentItem = {
  /**
   * Text to present for the group.
   */
  description: string;

  /**
   * Child {@link NavigationMenuItem} list.
   */
  items: Array<NavigationMenuItem>;
};

export interface NavigationMenuItem {
  /**
   * Text to present for the item.
   */
  description: string;

  /**
   * Route to navigate when item is clicked.
   */
  route?: RouteLocationRaw;

  /**
   * Callback to be triggered when the item is clicked.
   */
  action?: () => void;
}
