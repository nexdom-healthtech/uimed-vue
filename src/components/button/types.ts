import type { ColorVariant } from "@/composables/colors/types.ts";

export type ButtonVariant = "primary" | "secondary" | "ghost";

/**
 * Props exposed by the {@link Button} component.
 */
export type ButtonProps = {
  /**
   * Applies a distinct style variation to the button.
   * One of `primary`, `secondary`, or `ghost`.
   * @default "primary"
   */
  variant?: ButtonVariant;

  /**
   * Applies a distinct behavior to the button.
   * One of `button` or `submit`.
   * @default "button"
   */
  type?: "submit" | "button";

  /**
   * Applies a color to the button.
   * One of `primary`, `secondary`, `positive`, `informative`, `caution`, or `danger`.
   * @default "primary"
   */
  color?: ColorVariant;

  /**
   * Removes the ability to click or target the button.
   * @default false
   */
  disabled?: boolean;

  /**
   * Displays a loading indicator on the button, disabling interaction.
   * The button keeps its text as accessible name and is marked as busy, and
   * assistive technologies ignore the indicator.
   * @default false
   */
  loading?: boolean;

  /**
   * Stretches the button to the whole width of its parent, e.g. the only action of a form on a
   * small screen.
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Associated [form](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/form) id.
   */
  form?: string;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};

/**
 * Events emitted by the {@link Button} component.
 */
export type ButtonEmits =
  /**
   * Emitted when the button is clicked.
   * @param {MouseEvent} event - The native `MouseEvent` object associated with the click.
   * @returns void
   */
  (e: "click", event: MouseEvent) => void;
