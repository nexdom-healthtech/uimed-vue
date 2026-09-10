import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";
import type { RouteLocationRaw } from "vue-router";

type LocalRouteResponse = { to?: RouteLocationRaw };
type ExternalRouteResponse = { href?: string };
type RouteResponse = ComputedRef<LocalRouteResponse | ExternalRouteResponse>;

export default function useRouteProps(
  locationGetter: MaybeRefOrGetter<RouteLocationRaw | undefined>,
): RouteResponse {
  return computed(() => {
    const location = toValue(locationGetter);
    return isExternalRoute(location) ? { href: location } : { to: location };
  });
}

function isExternalRoute(route: RouteLocationRaw | undefined): route is string {
  return typeof route === "string" && route.startsWith("http");
}
