import { feedbackColorToVuetifyColor } from "@/composables/colors/constants.ts";
import type { ToastMessage, ToastOptions } from "@/composables/dialogs/types.ts";
import { icons } from "@/consts/icons.ts";
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
  const color = feedbackColorToVuetifyColor[options.color ?? "informative"];
  const toastMessage: ToastMessage = {
    text,
    color,
    prependIcon: icons[color],
    // The timer bar takes the toast's text color, since Vuetify's default `info` doesn't stand out
    // on the other fills. Vuetify has no classes for the text colors, so it goes as a CSS color
    timerColor: `rgb(var(--v-theme-on-${color}))`,
  };
  messages.value.push(toastMessage);
}
