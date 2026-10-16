import { colorToVuetifyColor } from "@/composables/colors/constants.ts";
import type { ColorVariant, VuetifyColor } from "@/composables/colors/types.ts";
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";

/**
 * Vuetify's utility class that applies a color to the background of an element, and the color the
 * theme pairs with it to its text, for props that color a background. No class when the color is
 * omitted, so the element keeps its default background.
 */
export default function useVuetifyBackgroundColor(
  color: MaybeRefOrGetter<ColorVariant | undefined>,
): ComputedRef<`bg-${VuetifyColor}` | undefined> {
  return computed<`bg-${VuetifyColor}` | undefined>(() => {
    const colorValue = toValue(color);
    return colorValue ? `bg-${colorToVuetifyColor[colorValue]}` : undefined;
  });
}
