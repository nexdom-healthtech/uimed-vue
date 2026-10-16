import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";

/**
 * Vuetify's utility class that stretches a component to the whole width of its parent, for
 * components with a `fullWidth` prop.
 */
export function useFullWidth(
  fullWidth: MaybeRefOrGetter<boolean | undefined>,
): ComputedRef<string | undefined> {
  return computed(() => (toValue(fullWidth) ? "w-100" : undefined));
}

/**
 * Vuetify's utility class that stretches a component to the whole height of its parent, for
 * components with a `fullHeight` prop. The parent must have a height of its own.
 */
export function useFullHeight(
  fullHeight: MaybeRefOrGetter<boolean | undefined>,
): ComputedRef<string | undefined> {
  return computed(() => (toValue(fullHeight) ? "h-100" : undefined));
}
