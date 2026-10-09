import type { ColorVariant } from "@/composables/colors/types.ts";
import type { Icon } from "@/consts/icons.ts";

/**
 * Props exposed by the {@link IconButton} component.
 */
export type IconButtonProps = {
  /**
   * Icon drawn on the button. One of the names listed on the "Ícones" guide page. Assistive
   * technologies ignore it and read `label` instead.
   *
   * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/icons | Icons Guide}
   */
  icon: Icon;

  /**
   * Accessible name of the button, read by assistive technologies instead of the icon. Describe
   * the action the button performs (e.g. "Editar paciente"), not the icon's drawing (e.g.
   * "Lápis").
   */
  label: string;

  /**
   * Applies a color to the button.
   * One of `primary`, `secondary`, `positive`, `informative`, `caution`, or `danger`.
   * @default "primary"
   */
  color?: ColorVariant;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};

/**
 * Events emitted by the {@link IconButton} component.
 */
export type IconButtonEmits =
  /**
   * Emitted when the button is clicked.
   * @param {MouseEvent} event - The native `MouseEvent` object associated with the click.
   * @returns void
   */
  (e: "click", event: MouseEvent) => void;
