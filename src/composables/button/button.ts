import type { ButtonProps, ButtonVariant } from "@/components/button/types.ts";
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";
import type { VBtn } from "vuetify/components";

type VBtnProps = InstanceType<typeof VBtn>["$props"];

type VuetifyVariant = NonNullable<VBtnProps["variant"]>;

const buttonVariantToVuetifyVariant: Record<ButtonVariant, VuetifyVariant> = {
  primary: "elevated",
  secondary: "flat",
  ghost: "outlined",
};

export function useButtonVariant(
  variant: MaybeRefOrGetter<ButtonProps["variant"]>,
): ComputedRef<VuetifyVariant> {
  return computed(() => {
    const variantValue = toValue(variant);

    return variantValue
      ? buttonVariantToVuetifyVariant[variantValue]
      : buttonVariantToVuetifyVariant.primary;
  });
}

export function useButtonType(type: MaybeRefOrGetter<ButtonProps["type"]>) {
  return computed(() => {
    const typeValue = toValue(type);
    return typeValue ?? "button";
  });
}

export function useButtonForm(form: MaybeRefOrGetter<ButtonProps["form"]>) {
  return computed(() => toValue(form));
}
