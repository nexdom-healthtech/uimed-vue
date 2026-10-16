import type { MaybeRefOrGetter } from "vue";
import type { ColorVariant } from "@/composables/colors/types.ts";

/**
 * Values compared by `useUnsavedChanges`.
 */
export interface UnsavedChangesValues<T> {
  /**
   * Original (last saved) value. To mark the form as saved, assign it a copy of the current value.
   */
  previous: MaybeRefOrGetter<T>;

  /**
   * Current value of the form.
   */
  current: MaybeRefOrGetter<T>;
}

/**
 * Options of `useUnsavedChanges`.
 */
export interface UnsavedChangesOptions {
  /**
   * Plain text displayed as the confirmation dialog's title. HTML isn't interpreted.
   * @default "Alterações não salvas"
   */
  title?: string;

  /**
   * Plain text displayed as the confirmation dialog's message. HTML isn't interpreted.
   * @default "Existem alterações que ainda não foram salvas. Deseja sair sem salvar?"
   */
  message?: string;

  /**
   * Text displayed on the button which leaves the page.
   * @default "Sair sem salvar"
   */
  confirmText?: string;

  /**
   * Text displayed on the button which cancels the navigation.
   * @default "Continuar editando"
   */
  cancelText?: string;

  /**
   * Applies a color to the button which leaves the page.
   * One of `primary`, `secondary`, `positive`, `informative`, `caution`, or `danger`.
   * @default "danger"
   */
  color?: ColorVariant;

  /**
   * Also asks for the browser's native confirmation on reload (F5), tab close or leaving the app
   * through an external link.
   * @default true
   */
  beforeUnload?: boolean;
}
