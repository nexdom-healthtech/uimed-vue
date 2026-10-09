import type { ButtonProps, ButtonVariant } from "@/components/button/types.ts";
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import type { RouteLocationRaw } from "vue-router";
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
 * The route the button navigates to, or `undefined` while it's blocked, so a `disabled` or
 * `loading` button is rendered as a disabled `<button>` instead of a link that the keyboard,
 * assistive technologies or `element.click()` could still follow.
 */
export function useButtonRoute(
  route: MaybeRefOrGetter<ButtonProps["route"]>,
  blocked: MaybeRefOrGetter<boolean>,
): ComputedRef<RouteLocationRaw | undefined> {
  return computed(() => (toValue(blocked) ? undefined : toValue(route)));
}

/**
 * The button's `type`. It doesn't apply to a button with a `route`, which is `undefined` while
 * rendered as a link, and `"button"` while blocked, so the disabled `<button>` it's rendered as
 * isn't a submit button.
 */
export function useButtonType(
  type: MaybeRefOrGetter<ButtonProps["type"]>,
  route: MaybeRefOrGetter<ButtonProps["route"]>,
  blocked: MaybeRefOrGetter<boolean>,
) {
  return computed(() => {
    if (!toValue(route)) return toValue(type) ?? "button";
    return toValue(blocked) ? "button" : undefined;
  });
}

/**
 * The button's `form`, or `undefined` when it has a `route`, even while blocked, since `form`
 * doesn't apply to it.
 */
export function useButtonForm(
  form: MaybeRefOrGetter<ButtonProps["form"]>,
  route: MaybeRefOrGetter<ButtonProps["route"]>,
) {
  return computed(() => (toValue(route) ? undefined : toValue(form)));
}
