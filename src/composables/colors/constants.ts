import type {
  ColorVariant,
  FeedbackColorVariant,
  VuetifyColor,
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
