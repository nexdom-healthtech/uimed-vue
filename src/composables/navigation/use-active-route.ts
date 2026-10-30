import { computed, inject, toValue, type MaybeRefOrGetter } from "vue";
import { routerKey, type RouteLocationRaw, type Router } from "vue-router";
import type {
  NavigationMenuParentItem,
  NavigationMenuParentItemOrItem,
} from "@/components/navigation-menu/types.ts";
import { isParentItem } from "@/composables/navigation/use-navigation-rail.ts";
import { isExternalRoute, routeToListItemProps } from "@/composables/navigation/use-route-props.ts";

type ActiveListItemProps = ReturnType<typeof routeToListItemProps> & {
  active: boolean;
  "aria-current": "page" | undefined;
};

export interface ActiveRoute {
  /** Whether one of the group's items is the active one. */
  hasActiveRoute: (item: NavigationMenuParentItem) => boolean;
  /**
   * Props of an item's list item: its route's (see `routeToListItemProps`), plus whether it's the
   * active one, which replace the highlight and the `aria-current` the router's link would give it.
   */
  listItemProps: (route: RouteLocationRaw | undefined) => ActiveListItemProps;
}

/**
 * Which navigation menu item is the current page's. An item is on the current page when the page's
 * path is its route's path (with the route's params, and without its query and hash) or is below it
 * (`/people` and `/people/new`, but not `/people-archive`), as a form opened in a dialog by a route
 * of its own. The root (`/`) is only on its own page, or it would be on every page. When several
 * items are on the current page (e.g. `/people` and `/people/reports`), only the most specific ones,
 * with the longest path, are active.
 *
 * External routes, items without a route and apps without a router are never active.
 */
export function useActiveRoute(
  items: MaybeRefOrGetter<Array<NavigationMenuParentItemOrItem> | undefined>,
): ActiveRoute {
  const router = inject(routerKey, null);
  const isActiveRoute = router ? createIsActiveRoute(router, items) : () => false;

  function hasActiveRoute(item: NavigationMenuParentItem): boolean {
    return item.items.some(({ route }) => isActiveRoute(route));
  }

  function listItemProps(route: RouteLocationRaw | undefined): ActiveListItemProps {
    const active = isActiveRoute(route);
    return { ...routeToListItemProps(route), active, "aria-current": active ? "page" : undefined };
  }

  return { hasActiveRoute, listItemProps };
}

/** Whether a route is the active item's, among the menu's items, in an app with a router. */
function createIsActiveRoute(
  router: Router,
  items: MaybeRefOrGetter<Array<NavigationMenuParentItemOrItem> | undefined>,
): (route: RouteLocationRaw | undefined) => boolean {
  /** Paths of the items the current page is on. */
  const currentPaths = computed(() => {
    const current = router.currentRoute.value.path;
    return (toValue(items) ?? [])
      .flatMap((item) => (isParentItem(item) ? item.items.map(({ route }) => route) : [item.route]))
      .filter(isLocalRoute)
      .map((route) => resolvePath(router, route))
      .filter((path) => isOnPath(current, path));
  });

  return (route) => {
    if (!isLocalRoute(route)) return false;

    const path = resolvePath(router, route);
    return (
      isOnPath(router.currentRoute.value.path, path) &&
      currentPaths.value.every((other) => other.length <= path.length)
    );
  };
}

/** Whether it's a route of the app (whose path has the route's params), instead of an external one. */
function isLocalRoute(route: RouteLocationRaw | undefined): route is RouteLocationRaw {
  return !!route && !isExternalRoute(route);
}

/**
 * Path of the app's route, with its params, without a trailing slash (`/people/` is `/people`), so
 * the pages below it start with the path and a single slash.
 */
function resolvePath(router: Router, route: RouteLocationRaw): string {
  const { path } = router.resolve(route);
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

/**
 * Whether the page's path is the given one, or below it. The root is only its own page's, since no
 * path starts with `//`.
 */
function isOnPath(current: string, path: string): boolean {
  return current === path || current.startsWith(`${path}/`);
}
