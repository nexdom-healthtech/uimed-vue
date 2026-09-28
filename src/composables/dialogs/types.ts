import type { ButtonVariant } from "@/components/button/types.ts";
import type {
  ColorVariant,
  FeedbackColorVariant,
  VuetifyColor,
} from "@/composables/colors/types.ts";

export interface ToastOptions {
  /**
   * Text to be presented in the toast.
   */
  message: string;

  /**
   * Applies a color to the toast.
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

/**
 * A button displayed at the bottom of a dialog opened by `useDialog`'s `dialog`.
 */
export interface DialogAction<T extends string = string> {
  /**
   * Text displayed on the button.
   */
  text: string;

  /**
   * Value the dialog resolves with when the button is clicked.
   */
  value: T;

  /**
   * Applies a distinct style variation to the button.
   * One of `primary`, `secondary`, or `ghost`.
   * @default "ghost", or "primary" for the last action
   */
  variant?: ButtonVariant;

  /**
   * Applies a color to the button.
   * One of `primary`, `secondary`, `positive`, `informative`, `caution`, or `danger`.
   * @default "primary"
   */
  color?: ColorVariant;
}

/**
 * Options of a dialog opened by `useDialog`'s `dialog`.
 */
export interface DialogOptions<T extends string = string> {
  /**
   * Plain text displayed as the dialog's title. HTML isn't interpreted.
   */
  title?: string;

  /**
   * Plain text displayed as the dialog's message. HTML isn't interpreted.
   */
  message: string;

  /**
   * Buttons displayed at the bottom of the dialog, right-aligned, in the given order.
   * @default [{ text: "Fechar" }], which resolves `undefined`
   */
  actions?: DialogAction<T>[];
}

/**
 * Options of a dialog opened by `useConfirm`'s `confirm`.
 */
export interface ConfirmOptions {
  /**
   * Plain text displayed as the dialog's title. HTML isn't interpreted.
   */
  title?: string;

  /**
   * Plain text displayed as the dialog's message. HTML isn't interpreted.
   */
  message: string;

  /**
   * Text displayed on the confirm button.
   * @default "Confirmar"
   */
  confirmText?: string;

  /**
   * Text displayed on the cancel button.
   * @default "Cancelar"
   */
  cancelText?: string;

  /**
   * Applies a color to the confirm button.
   * One of `primary`, `secondary`, `positive`, `informative`, `caution`, or `danger`.
   * @default "primary"
   */
  color?: ColorVariant;
}

/**
 * A button of a queued dialog, with its variant already resolved.
 */
export interface DialogRequestAction<T extends string = string> {
  text: string;
  value?: T;
  variant: ButtonVariant;
  color?: ColorVariant;
}

/**
 * A dialog waiting in the queue to be displayed by the internal `Dialog` component.
 */
export interface DialogRequest {
  title?: string;
  message: string;
  role: "dialog" | "alertdialog";
  actions: DialogRequestAction[];

  /**
   * Handles the value of the clicked action, or `undefined` when the dialog is dismissed.
   * Resolves once the dialog can close.
   */
  select(value?: string): Promise<void>;
}
