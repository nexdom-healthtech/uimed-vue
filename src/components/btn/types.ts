import type { VBtn } from "vuetify/components";

export type VBtnProps = InstanceType<typeof VBtn>["$props"];

type VuetifyVariant = NonNullable<VBtnProps["variant"]>;

/**
 * Style variation for the {@link Button} component.
 * {@link btnVariantToVuetifyVariant} for the mapping applied when rendering.
 */
export type BtnVariant = "primary" | "secondary" | "ghost";

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
 * Color palette for the {@link Button} component.
 * {@link btnColorToVuetifyColor} for the mapping applied when rendering.
 */
export type BtnColor = "brand" | "neutral" | "positive" | "informative" | "caution" | "danger";

/**
 * Maps {@link BtnColor} to the underlying Vuetify `VBtn` `color` value.
 * Vuetify types `color` as a bare `string` (it accepts any theme color or
 * CSS color), so this only guarantees every {@link BtnColor} has a mapped
 * value — not that the value is itself a valid Vuetify theme color.
 */
export const btnColorToVuetifyColor = {
  brand: "primary",
  neutral: "secondary",
  positive: "success",
  informative: "info",
  caution: "warning",
  danger: "error",
} as const satisfies Record<BtnColor, string>;

/**
 * Props exposed by the {@link Btn} component.
 */
export type ButtonProps = {
  /**
   * Applies a distinct style variation to the button.
   * One of `primary`, `secondary`, or `ghost`.
   * @default "primary"
   */
  variant?: BtnVariant;
  /**
   * Applies a color to the button.
   * One of `brand`, `neutral`, `positive`, `informative`, `caution`, or `danger`.
   * @default "brand"
   */
  color?: BtnColor;
  /**
   * Removes the ability to click or target the button.
   * @default false
   */
  disabled?: boolean;
  /**
   * Displays a loading indicator on the button, disabling interaction.
   * @default false
   */
  loading?: boolean;
};

/**
 * Events emitted by the {@link Button} component.
 */
export type ButtonEmits = {
  /**
   * Emitted when the button is clicked.
   * @param {MouseEvent} event - The native `MouseEvent` object associated with the click.
   * @returns void
   */
  click: (event: MouseEvent) => void;
};
