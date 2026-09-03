import type { ColorVariant } from "@/composables/colors/types.ts";
import type { ToastMessage, ToastOptions } from "@/composables/dialogs/types.ts";
import { ref, toRaw } from "vue";

export const messages = ref<Array<ToastMessage>>([]);

/**
 * Composable which returns a function to display toast messages.
 *
 * @example
 * ```ts
 * const { toast, dismiss } = useToast();
 * toast({ message: "Hello, World!" });
 *
 * // To dismiss all toast messages:
 * dismiss();
 * ```
 */
export default function useToast() {
  return { toast, dismiss: dismissAll };
}

/**
 * Dismiss all toast messages.
 */
function dismissAll() {
  messages.value = [];
}

/**
 * Displays a toast message and returns a function to dismiss it.
 * @param {ToastOptions} options - Options for the toast message.
 * @returns A function to dismiss the toast message.
 *
 * @example
 * ```ts
 * const dismiss = toast({ message: "Hello, World!" });
 *
 * // To dismiss the toast message later:
 * dismiss();
 * ```
 */
function toast(options: ToastOptions): () => void {
  const color: ColorVariant = options.color ?? "informative";
  const toastMessage: ToastMessage = { ...options, color };
  messages.value.push(toastMessage);
  return () => dismiss(toastMessage);
}

function dismiss(options: ToastMessage): void {
  const index = toRaw(messages.value).findIndex((message) => message === options);
  if (index >= 0) messages.value.splice(index, 1);
}
