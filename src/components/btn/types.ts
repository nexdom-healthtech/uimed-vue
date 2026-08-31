export type BtnVariant = "primary" | "secondary" | "ghost";
export type BtnColor = "primary" | "secondary" | "positive" | "informative" | "caution" | "danger";

/**
 * Props exposed by the {@link Btn} component.
 */
export type BtnProps = {
  /**
   * Applies a distinct style variation to the button.
   * One of `primary`, `secondary`, or `ghost`.
   * @default "primary"
   */
  variant?: BtnVariant;

  /**
   * Applies a distinct behavior to the button.
   * One of `button` or `submit`.
   * @default "action"
   */
  type?: "submit" | "button";

  /**
   * Applies a color to the button.
   * One of `primary`, `secondary`, `positive`, `informative`, `caution`, or `danger`.
   * @default "primary"
   */
  color?: BtnColor;

  /**
   * Removes the ability to click or target the button.
   * @default false
   */
  disabled?: boolean;

  /**
   * Displays a loading indicator on the button, disabling interaction.
   * @default false
   */
  loading?: boolean;

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
 * Events emitted by the {@link Btn} component.
 */
export type BtnEmits = {
  /**
   * Emitted when the button is clicked.
   * @param {MouseEvent} event - The native `MouseEvent` object associated with the click.
   * @returns void
   */
  (e: "click", event: MouseEvent): void;
};
