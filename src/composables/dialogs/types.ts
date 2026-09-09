import type { FeedbackColorVariant, VuetifyColor } from "@/composables/colors/types.ts";

export interface ToastOptions {
  /**
   * Text to be presented in the toast.
   */
  message: string;

  /**
   * Applies a color to the button.
   * One of `positive`, `informative`, `caution`, or `danger`.
   * @default "informative"
   */
  color?: FeedbackColorVariant;
}

export interface ToastMessage {
  text: string;
  color: VuetifyColor;
  prependIcon?: string;
}
