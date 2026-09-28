import type { ButtonVariant } from "@/components/button/types.ts";
import type {
  DialogOptions,
  DialogRequest,
  DialogRequestAction,
} from "@/composables/dialogs/types.ts";
import { ref } from "vue";

/**
 * Dialogs waiting to be displayed, shared by `useDialog` and `useConfirm`. The first one is the
 * dialog on display (or about to be).
 */
export const requests = ref<DialogRequest[]>([]);

/**
 * Mounted `Dialog` components, in mounting order. Only the first one displays dialogs, so pages
 * with more than one `UMain` don't display duplicates.
 */
export const owners = ref<symbol[]>([]);

type OpenDialogAction<T extends string> = Omit<DialogRequestAction<T>, "variant"> & {
  variant?: ButtonVariant;
};

interface OpenDialogOptions<T extends string> extends Pick<
  DialogRequest,
  "title" | "message" | "role"
> {
  actions: OpenDialogAction<T>[];
}

/**
 * Queues a dialog and resolves with what `onSelect` returns for the clicked action's value
 * (`undefined` when the dialog is dismissed).
 */
export function openDialog<T extends string, R>(
  options: OpenDialogOptions<T>,
  onSelect: (value?: T) => R | PromiseLike<R>,
): Promise<R> {
  const { actions, ...content } = options;
  const lastIndex = actions.length - 1;

  return new Promise((resolve) => {
    requests.value.push({
      ...content,
      actions: actions.map((action, index) => ({
        ...action,
        variant: action.variant ?? (index === lastIndex ? "primary" : "ghost"),
      })),
      async select(value?: T) {
        resolve(await onSelect(value));
      },
    });
  });
}

/**
 * Composable which returns a function to display dialogs.
 *
 * @example
 * ```ts
 * const { dialog } = useDialog();
 *
 * const answer = await dialog({
 *   title: "Sessão expirando",
 *   message: "Deseja continuar conectado?",
 *   actions: [
 *     { text: "Sair", value: "leave" },
 *     { text: "Continuar", value: "stay" },
 *   ],
 * });
 * ```
 */
export default function useDialog() {
  return { dialog };
}

/**
 * Displays a dialog. Dialogs are displayed one at a time, in the order they were requested.
 * @param {DialogOptions} options - Options for the dialog.
 * @returns the `value` of the clicked action, or `undefined` when the dialog is closed by the
 * default action, the `Esc` key, a click outside it or the browser's back button.
 *
 * @example
 * ```ts
 * await dialog({ title: "Aviso", message: "Seu cadastro foi enviado para análise." });
 * ```
 */
// `never` by default, so a dialog without custom actions resolves `Promise<undefined>`
function dialog<T extends string = never>(options: DialogOptions<T>): Promise<T | undefined> {
  return openDialog(
    {
      title: options.title,
      message: options.message,
      role: "dialog",
      actions: options.actions ?? [{ text: "Fechar" }],
    },
    (value) => value,
  );
}
