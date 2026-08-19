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
 * Maps {@link BtnColor} to the underlying Vuetify `VBtn` `color` value.
 * Vuetify types `color` as a bare `string` (it accepts any theme color or
 * CSS color), so this only guarantees every {@link BtnColor} has a mapped
 * value — not that the value is itself a valid Vuetify theme color.
 */
export const btnColorToVuetifyColor = {
  primary: "primary",
  secondary: "secondary",
  positive: "success",
  informative: "info",
  caution: "warning",
  danger: "error",
} as const satisfies Record<BtnColor, string>;
