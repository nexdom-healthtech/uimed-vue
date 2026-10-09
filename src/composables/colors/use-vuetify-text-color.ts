import { colorToVuetifyTextColor } from "@/composables/colors/constants.ts";
import type { ColorVariant, VuetifyTextColor } from "@/composables/colors/types.ts";
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";

/**
 * Maps a color to the theme color to use when it's the text color, e.g. in a ghost button, so it
 * keeps WCAG AA's contrast on the surface and background.
 */
export default function useVuetifyTextColor(
  color: MaybeRefOrGetter<ColorVariant | undefined>,
): ComputedRef<VuetifyTextColor> {
  return computed(() => colorToVuetifyTextColor[toValue(color) ?? "primary"]);
}
