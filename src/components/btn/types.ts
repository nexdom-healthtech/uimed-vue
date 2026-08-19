/**
 * Style variation for the {@link Btn} component.
 * {@link btnVariantToVuetifyVariant} for the mapping applied when rendering.
 */
export type BtnVariant = "primary" | "secondary" | "ghost";

/**
 * Color palette for the {@link Btn} component.
 * {@link btnColorToVuetifyColor} for the mapping applied when rendering.
 */
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
  click: (event: MouseEvent) => void;
};
