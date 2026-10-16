import type { ConfirmOptions } from "@/composables/dialogs/types.ts";
import { openDialog } from "@/composables/dialogs/use-dialog.ts";
import useRunOrToast from "@/composables/dialogs/use-run-or-toast.ts";

/**
 * Composable which returns a function to run actions only after the user confirms them in a
 * dialog, and a computed property `isRunning`.
 *
 * @example
 * ```ts
 * const { confirm, isRunning } = useConfirm();
 *
 * const removed = await confirm(
 *   { title: "Excluir paciente", message: "Esta ação não pode ser desfeita.", confirmText: "Excluir", color: "danger" },
 *   () => api.deletePatient(id),
 * );
 * ```
 */
export default function useConfirm() {
  const { run, isRunning } = useRunOrToast();

  /**
   * Displays a confirmation dialog and, if the user confirms, runs the given function while the
   * dialog shows the confirm button loading. If the function throws an error, the dialog closes
   * and a toast shows the error message.
   * @returns the function returned value, or `false` if the user cancels or the function fails
   *
   * @example
   * ```ts
   * const { confirm } = useConfirm();
   *
   * // Call like this:
   * const result1 = await confirm({ message: "Salvar alterações?" }, () => save(form));
   *
   * // Or this:
   * const result2 = await confirm({ message: "Salvar alterações?" }, save, form);
   * ```
   */
  function confirm<F extends (...args: Parameters<F>) => PromiseLike<Awaited<ReturnType<F>>>>(
    options: ConfirmOptions,
    action: F,
    ...params: Parameters<F>
  ): Promise<Awaited<ReturnType<F>> | false> {
    return openDialog(
      {
        title: options.title,
        message: options.message,
        role: "alertdialog",
        actions: [
          { text: options.cancelText ?? "Cancelar" },
          { text: options.confirmText ?? "Confirmar", value: "confirm", color: options.color },
        ],
      },
      (value) => (value === "confirm" ? run(action, ...params) : false),
    );
  }

  return { confirm, isRunning };
}
