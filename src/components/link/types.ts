import type { RouteLocationRaw } from "vue-router";

/**
 * Props exposed by the {@link Link} component.
 */
export type LinkProps = {
  /**
   * Where the link goes. A route inside the app (`"/login"`,
   * `{ name: "forgot-password" }`) navigates through the app's router; a URL
   * starting with `http` navigates through the browser, in the same tab.
   */
  route: RouteLocationRaw;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};
