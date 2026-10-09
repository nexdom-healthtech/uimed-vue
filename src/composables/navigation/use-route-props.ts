import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";
import type { RouteLocationRaw } from "vue-router";

type LocalRouteResponse = { to?: RouteLocationRaw };
type ExternalRouteResponse = { href?: string };
type RouteResponse = LocalRouteResponse | ExternalRouteResponse;
type ActionResponse = { role: "button" };

export default function useRouteProps(
  route: MaybeRefOrGetter<RouteLocationRaw | undefined>,
): ComputedRef<RouteResponse> {
  return computed(() => routeToProps(route));
}

export function routeToProps(route: MaybeRefOrGetter<RouteLocationRaw | undefined>): RouteResponse {
  const location = toValue(route);
  return isExternalRoute(location) ? { href: location } : { to: location };
}

/**
 * Maps a menu item's route to its list item's props. An item without a route only runs its action,
 * so it's a button: Vuetify would make it a list item, which the menus' groups of links don't allow.
 */
export function routeToListItemProps(
  route: RouteLocationRaw | undefined,
): RouteResponse | ActionResponse {
  return route ? routeToProps(route) : { role: "button" };
}

export function isExternalRoute(route: RouteLocationRaw | undefined): route is string {
  return typeof route === "string" && route.startsWith("http");
}
