import useVuetifyColor from "@/composables/colors/use-vuetify-color.ts";
import type { ToastMessage, ToastOptions } from "@/composables/dialogs/types.ts";
import { ref } from "vue";

export const messages = ref<Array<ToastMessage>>([]);

/**
 * Composable which returns a function to display toast messages.
 *
 * @example
 * ```ts
 * const { toast } = useToast();
 * toast({ message: "Hello, World!" });
 * ```
 */
export default function useToast() {
  return { toast };
}

/**
 * Displays a toast message.
 * @param {ToastOptions} options - Options for the toast message.
 *
 * @example
 * ```ts
 * toast({ message: "Hello, World!" });
 * ```
 */
function toast(options: ToastOptions): void {
  const text = options.message;
  const color = useVuetifyColor(options.color ?? "informative");
  const toastMessage: ToastMessage = { text, color: color.value, prependIcon: `$${color.value}` };
  messages.value.push(toastMessage);
}
