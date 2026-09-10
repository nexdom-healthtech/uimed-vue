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
};
