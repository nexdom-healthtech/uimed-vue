import type { BtnVariant, BtnColor } from "@/components/btn/types.ts";
import type { VBtn } from "vuetify/lib/components/VBtn/VBtn.mjs";

export type VBtnProps = InstanceType<typeof VBtn>["$props"];

type VuetifyVariant = NonNullable<VBtnProps["variant"]>;

/**
 * Maps {@link BtnVariant} to the underlying Vuetify `VBtn` `variant` value.
 * Each value is checked against Vuetify's prop type, so a variant renamed or
 * removed by Vuetify fails to type-check here.
 */
export const btnVariantToVuetifyVariant = {
  primary: "elevated",
  secondary: "flat",
  ghost: "outlined",
} as const satisfies Record<BtnVariant, VuetifyVariant>;

/**
 * Resolves a {@link BtnVariant} to its Vuetify `VBtn` `variant` value,
 * defaulting to `primary`'s mapping when `variant` is `undefined` or not a
 * key of {@link btnVariantToVuetifyVariant} (e.g. a value that bypassed
 * {@link BtnVariant}'s type check at the call site).
 */
export function resolveBtnVariant(variant: BtnVariant | undefined): VuetifyVariant {
  return btnVariantToVuetifyVariant[variant as BtnVariant] ?? btnVariantToVuetifyVariant.primary;
}

/**
 * Maps {@link BtnColor} to the underlying Vuetify `VBtn` `color` value.
 * Vuetify types `color` as a bare `string` (it accepts any theme color or
 * CSS color), so this only guarantees every {@link BtnColor} has a mapped
 * value, not that the value is itself a valid Vuetify theme color.
 */
export const btnColorToVuetifyColor = {
  primary: "primary",
  secondary: "secondary",
  positive: "success",
  informative: "info",
  caution: "warning",
  danger: "error",
} as const satisfies Record<BtnColor, string>;

/**
 * Resolves a {@link BtnColor} to its Vuetify `VBtn` `color` value,
 * defaulting to `primary`'s mapping when `color` is `undefined` or not a key
 * of {@link btnColorToVuetifyColor} (e.g. a value that bypassed
 * {@link BtnColor}'s type check at the call site).
 */
export function resolveBtnColor(color: BtnColor | undefined): string {
  return btnColorToVuetifyColor[color as BtnColor] ?? btnColorToVuetifyColor.primary;
}
