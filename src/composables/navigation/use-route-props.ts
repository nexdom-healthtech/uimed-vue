import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";
import type { RouteLocationRaw } from "vue-router";

type LocalRouteResponse = { to?: RouteLocationRaw };
type ExternalRouteResponse = { href?: string };
type RouteResponse = LocalRouteResponse | ExternalRouteResponse;

export default function useRouteProps(
  route: MaybeRefOrGetter<RouteLocationRaw | undefined>,
): ComputedRef<RouteResponse> {
  return computed(() => routeToProps(route));
}

export function routeToProps(route: MaybeRefOrGetter<RouteLocationRaw | undefined>): RouteResponse {
  const location = toValue(route);
  return isExternalRoute(location) ? { href: location } : { to: location };
}

export function isExternalRoute(route: RouteLocationRaw | undefined): route is string {
  return typeof route === "string" && route.startsWith("http");
}
