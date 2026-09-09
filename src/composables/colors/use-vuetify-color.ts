import { colorToVuetifyColor } from "@/composables/colors/constants.ts";
import type { ColorVariant, VuetifyColor } from "@/composables/colors/types.ts";
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";

export default function useVuetifyColor(
  color: MaybeRefOrGetter<ColorVariant | undefined>,
): ComputedRef<VuetifyColor> {
  return computed(() => {
    const colorValue = toValue(color);
    return colorValue ? colorToVuetifyColor[colorValue] : colorToVuetifyColor.primary;
  });
}
