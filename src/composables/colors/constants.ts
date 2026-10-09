import type {
  ColorVariant,
  FeedbackColorVariant,
  VuetifyColor,
  VuetifyTextColor,
} from "@/composables/colors/types.ts";

export const feedbackColorToVuetifyColor: Record<FeedbackColorVariant, VuetifyColor> = {
  positive: "success",
  informative: "info",
  caution: "warning",
  danger: "error",
};

export const colorToVuetifyColor: Record<ColorVariant, VuetifyColor> = {
  primary: "primary",
  secondary: "secondary",
  ...feedbackColorToVuetifyColor,
};

/**
 * The theme colors to use when a color is the text color, on the surface or background, instead
 * of a fill. The fills are too light to reach WCAG AA's contrast as text, so each one has a darker
 * shade, except `secondary`, which is almost white and gives way to the theme's text color.
 */
export const colorToVuetifyTextColor: Record<ColorVariant, VuetifyTextColor> = {
  primary: "primary-text",
  secondary: "on-surface",
  positive: "success-text",
  informative: "info-text",
  caution: "warning-text",
  danger: "error-text",
};
