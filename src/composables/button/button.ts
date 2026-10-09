import type { ButtonProps, ButtonVariant } from "@/components/button/types.ts";
import useVuetifyColor from "@/composables/colors/use-vuetify-color.ts";
import useVuetifyTextColor from "@/composables/colors/use-vuetify-text-color.ts";
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import type { VBtn } from "vuetify/components";

type VBtnProps = ComponentProps<typeof VBtn>;

type VuetifyVariant = NonNullable<VBtnProps["variant"]>;

const buttonVariantToVuetifyVariant: Record<ButtonVariant, VuetifyVariant> = {
  primary: "elevated",
  secondary: "flat",
  ghost: "text",
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

/**
 * Maps the button's color to Vuetify's. A ghost button has no fill, so its color is the text's,
 * which takes the color's text shade to keep WCAG AA's contrast.
 */
export function useButtonColor(
  color: MaybeRefOrGetter<ButtonProps["color"]>,
  variant: MaybeRefOrGetter<ButtonProps["variant"]>,
) {
  const fillColor = useVuetifyColor(color);
  const textColor = useVuetifyTextColor(color);

  return computed(() => (toValue(variant) === "ghost" ? textColor.value : fillColor.value));
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
