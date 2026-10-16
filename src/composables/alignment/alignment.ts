import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";
import type { AlignX, AlignY, AlignYClasses } from "@/composables/alignment/types.ts";

const alignXToClass: Record<AlignX, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

const alignYToClasses: Record<AlignY, AlignYClasses> = {
  start: { items: "align-start", content: "align-content-start" },
  center: { items: "align-center", content: "align-content-center" },
  end: { items: "align-end", content: "align-content-end" },
  stretch: { items: "align-stretch", content: "align-content-stretch" },
};

/**
 * Vuetify's `justify-*` utility class for components with an `alignX` prop, laid out with flexbox.
 * Falls back to `"start"`.
 */
export function useAlignX(alignX: MaybeRefOrGetter<AlignX | undefined>): ComputedRef<string> {
  return computed(() => alignXToClass[toValue(alignX) ?? "start"]);
}

/**
 * Vuetify's `align-*` and `align-content-*` utility classes for components with an `alignY` prop,
 * laid out with flexbox. Falls back to `"start"`.
 */
export function useAlignY(
  alignY: MaybeRefOrGetter<AlignY | undefined>,
): ComputedRef<AlignYClasses> {
  return computed(() => alignYToClasses[toValue(alignY) ?? "start"]);
}
