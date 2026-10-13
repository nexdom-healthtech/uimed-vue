import type { DialogButtonAction } from "@/components/dialogs/dialog/types.ts";
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";

/**
 * Tells whether any action of a dialog is loading, during which the user can't close it with
 * `Esc`, a click outside or the browser's back button. Internal to the dialog components.
 * @param actions - The dialog's actions, if any.
 * @returns `isLoading`, which is `true` while at least one action is `loading`.
 */
export function useDialogLoading(actions: MaybeRefOrGetter<DialogButtonAction[] | undefined>): {
  isLoading: ComputedRef<boolean>;
} {
  const isLoading = computed(() => toValue(actions)?.some((action) => action.loading) ?? false);

  return { isLoading };
}
