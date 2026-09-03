import type { BtnProps, BtnVariant } from "@/components/btn/types.ts";
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";
import type { VBtn } from "vuetify/components";

type VBtnProps = InstanceType<typeof VBtn>["$props"];

type VuetifyVariant = NonNullable<VBtnProps["variant"]>;

const btnVariantToVuetifyVariant: Record<BtnVariant, VuetifyVariant> = {
  primary: "elevated",
  secondary: "flat",
  ghost: "outlined",
};

export function useBtnVariant(
  variant: MaybeRefOrGetter<BtnProps["variant"]>,
): ComputedRef<VuetifyVariant> {
  return computed(() => {
    const variantValue = toValue(variant);

    return variantValue
      ? btnVariantToVuetifyVariant[variantValue]
      : btnVariantToVuetifyVariant.primary;
  });
}

export function useBtnType(type: MaybeRefOrGetter<BtnProps["type"]>) {
  return computed(() => {
    const typeValue = toValue(type);
    return typeValue ?? "button";
  });
}

export function useBtnForm(form: MaybeRefOrGetter<BtnProps["form"]>) {
  return computed(() => toValue(form));
}
