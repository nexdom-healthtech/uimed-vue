import type { ColorVariant } from "@/composables/colors/types.ts";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

const colorToVuetifyColor: Record<ColorVariant, string> = {
  primary: "primary",
  secondary: "secondary",
  positive: "success",
  informative: "info",
  caution: "warning",
  danger: "error",
};

export default function useVuetifyColor(color: MaybeRefOrGetter<ColorVariant | undefined>) {
  return computed(() => {
    const colorValue = toValue(color);
    return colorValue ? colorToVuetifyColor[colorValue] : colorToVuetifyColor.primary;
  });
}
