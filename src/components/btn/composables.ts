import type { BtnColor, BtnVariant } from "@/components/btn/types.ts";
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";
import type { VBtn } from "vuetify/components";

type VBtnProps = InstanceType<typeof VBtn>["$props"];

type VuetifyVariant = NonNullable<VBtnProps["variant"]>;

const btnVariantToVuetifyVariant: Record<BtnVariant, VuetifyVariant> = {
  primary: "elevated",
  secondary: "flat",
  ghost: "outlined",
};

const btnColorToVuetifyColor: Record<BtnColor, string> = {
  primary: "primary",
  secondary: "secondary",
  positive: "success",
  informative: "info",
  caution: "warning",
  danger: "error",
};

export function useBtnVariant(
  variant: MaybeRefOrGetter<BtnVariant | undefined>,
): ComputedRef<VuetifyVariant> {
  return computed(() => {
    const variantValue = toValue(variant);

    return variantValue
      ? btnVariantToVuetifyVariant[variantValue]
      : btnVariantToVuetifyVariant.primary;
  });
}

export function useBtnColor(color: MaybeRefOrGetter<BtnColor | undefined>): ComputedRef<string> {
  return computed(() => {
    const colorValue = toValue(color);
    return colorValue ? btnColorToVuetifyColor[colorValue] : btnColorToVuetifyColor.primary;
  });
}
