import type { ColorVariant } from "@/composables/colors/types.ts";

export interface ToastOptions {
  /**
   * Text to be presented in the toast.
   */
  message: string;

  /**
   * Applies a color to the button.
   * One of `primary`, `secondary`, `positive`, `informative`, `caution`, or `danger`.
   * @default "informative"
   */
  color?: ColorVariant;
}

export type ToastMessage = Required<ToastOptions>;
