import type { ButtonProps } from "@/components/button/types.ts";

export type DialogSize = "small" | "medium" | "large";

/**
 * Props exposed by the {@link Dialog} component.
 */
export type DialogProps = {
  /**
   * Plain text displayed as the dialog's title, in a single line. HTML isn't interpreted.
   * Also used as the dialog's accessible name. Without it, the content is the accessible name.
   */
  title?: string;

  /**
   * Buttons displayed at the bottom of the dialog, right-aligned, in the given order.
   * Place the main action last. When undefined or empty, no actions area is rendered.
   * Clicking an action doesn't close the dialog: set `v-model` to `false` in `onClick`.
   */
  actions?: DialogButtonAction[];

  /**
   * Maximum width of the dialog.
   * One of `small` (400px), `medium` (560px), or `large` (800px).
   * @default "medium"
   */
  size?: DialogSize;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};

/**
 * A single action rendered inside {@link Dialog}'s actions area. Same shape as `USection`'s
 * actions.
 */
export interface DialogButtonAction extends ButtonProps {
  /**
   * Text displayed on the action button.
   */
  label: string;

  /**
   * Called when the action button is clicked. Not called while the action is `disabled` or
   * `loading`. The dialog stays open.
   */
  onClick?: (event: MouseEvent) => void;
}

/**
 * Options the internal `DialogHost` provides to its {@link Dialog}. Not part of the public API.
 */
export interface DialogHostContext {
  /**
   * Role of the dialog on display, `alertdialog` for confirmations. The dialog falls back to
   * `dialog` when it's `undefined`.
   */
  role: () => "dialog" | "alertdialog" | undefined;

  /**
   * Prevents closing the dialog with `Esc`, a click outside or the browser's back button while it
   * returns `true`, e.g. while a confirmed action runs.
   */
  persistent: () => boolean;

  /**
   * Called at the end of every leave transition of the dialog, whatever closed it.
   */
  afterLeave: () => void;
}
