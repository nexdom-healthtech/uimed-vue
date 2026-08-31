export type TextFieldVariant = "primary" | "secondary";
export type TextFieldType = "text" | "phone" | "email" | "url" | "password" | "search";

/**
 * Props exposed by the {@link TextField} component.
 */
export type TextFieldProps = {
  /**
   * Applies a distinct style variation to the field.
   * One of `primary` or `secondary`.
   * @default "primary"
   */
  variant?: TextFieldVariant;

  /**
   * Applies a distinct behavior to the field.
   * One of `text`, `phone`, `email`, `url`, `password` or `search`.
   * @default "text"
   */
  type?: TextFieldType;

  /**
   * Removes the ability to click or target the field.
   * @default false
   */
  disabled?: boolean;

  /**
   * Displays a loading indicator on the input.
   * @default false
   */
  loading?: boolean;

  /**
   * Displays clear action.
   * @default false
   */
  clearable?: boolean;

  /**
   * Prevent value changes.
   * @default false
   */
  readonly?: boolean;

  /**
   * Add `rules` to require field to be filled before form submission.
   * @default false
   */
  required?: boolean;

  /**
   * Field label.
   */
  label?: string;

  /**
   * Field placeholder.
   */
  placeholder?: string;

  /**
   * Field message to show and direct user to fill field correctly.
   *
   * This message will be replaced when there's an error message to be shown.
   */
  hint?: string;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};
