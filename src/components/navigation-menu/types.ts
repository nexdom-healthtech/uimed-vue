import type { RouteLocationRaw } from "vue-router";
import type { Icon } from "@/consts/icons.ts";

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
   * Icon shown before the group's description. One of the names listed on the "Ícones" guide
   * page.
   *
   * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/icons | Icons Guide}
   */
  icon?: Icon;

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
   * Icon shown before the item's description. One of the names listed on the "Ícones" guide
   * page.
   *
   * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/icons | Icons Guide}
   */
  icon?: Icon;

  /**
   * Route to navigate when item is clicked.
   */
  route?: RouteLocationRaw;

  /**
   * Callback to be triggered when the item is clicked.
   */
  action?: () => void;
}
