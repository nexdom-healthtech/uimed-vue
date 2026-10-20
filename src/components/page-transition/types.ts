/**
 * Props exposed by the {@link PageTransition} component.
 */
export type PageTransitionProps = {
  /**
   * Identifies the page on display: the change is animated whenever it
   * changes. Defaults to the current route's `fullPath`, so every navigation
   * is animated, including the ones that only change the route's params,
   * query or hash. Pass another value to choose which navigations are
   * animated, e.g. `route.path` to not animate when only the query or the
   * hash changes.
   *
   * @default route.fullPath
   */
  transitionKey?: string;
};
