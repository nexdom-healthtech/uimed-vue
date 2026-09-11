import type { RouteLocationRaw } from "vue-router";

/**
 * Props exposed by the {@link AppBar} component.
 */
export type AppBarProps = {
  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;

  /**
   * Main title to be presented.
   */
  title?: string;

  /**
   * Help page route.
   */
  help?: RouteLocationRaw;

  /**
   * Resources available to the user in the app-bar
   */
  user?: AppBarUserProps;
};

export interface AppBarUserProps {
  /**
   * Major identifier, like the user full name.
   */
  title?: string;

  /**
   * Complement to user identifier, like it's e-mail or username.
   */
  subtitle?: string;

  /**
   * URL leading to a user picture.
   */
  img?: string;

  /**
   * Options to show the user when its menu is opened.
   * Can be plain options, grouped or both.
   */
  options?: Array<ParentOptionOrOption>;
}

export type ParentOptionOrOption = ParentOption | Option;

export type ParentOption = {
  /**
   * Text to present for the group.
   */
  description: string;

  /**
   * Child {@link Option} list.
   */
  items: Array<Option>;
};

export interface Option {
  /**
   * Text to present for the action.
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
