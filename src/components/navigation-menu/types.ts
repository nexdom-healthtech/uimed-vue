import type { RouteLocationRaw } from "vue-router";
import type { Icon } from "@/consts/types.ts";

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
   * Icon shown before the group's description, and alone while the menu is collapsed to a rail.
   * One of the names listed on the "Ícones" guide page.
   *
   * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/icons | Icons Guide}
   */
  icon: Icon;

  /**
   * Child {@link NavigationMenuChildItem} list. Unlike the first level items, they show no icon.
   */
  items: Array<NavigationMenuChildItem>;
};

/**
 * Item inside a {@link NavigationMenuParentItem}. Only the first level items and groups show an
 * icon, so every menu follows the same visual pattern.
 */
export type NavigationMenuChildItem = Omit<NavigationMenuItem, "icon">;

export interface NavigationMenuItem {
  /**
   * Text to present for the item.
   */
  description: string;

  /**
   * Icon shown before the item's description, and alone while the menu is collapsed to a rail.
   * One of the names listed on the "Ícones" guide page.
   *
   * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/icons | Icons Guide}
   */
  icon: Icon;

  /**
   * Route to navigate when item is clicked.
   */
  route?: RouteLocationRaw;

  /**
   * Callback to be triggered when the item is clicked.
   */
  action?: () => void;
}
