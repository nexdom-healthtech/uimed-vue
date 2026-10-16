import type { TextFieldVariant } from "@/components/inputs/text-field/types.ts";

export type DateTimeFieldVariant = TextFieldVariant;
export type DateTimeFieldType = "date" | "time" | "datetime";

/**
 * Props exposed by the {@link DateTimeField} component.
 */
export type DateTimeFieldProps = {
  /**
   * Applies a distinct style variation to the field.
   * One of `primary` or `secondary`.
   * @default "primary"
   */
  variant?: DateTimeFieldVariant;

  /**
   * Defines which pickers are available and the format of the value.
   *
   * - `date`: value formatted as `YYYY-MM-DD` (e.g. `2026-09-24`);
   * - `time`: value formatted as `HH:mm`, 24h (e.g. `14:30`);
   * - `datetime`: value formatted as `YYYY-MM-DDTHH:mm` (e.g. `2026-09-24T14:30`).
   * @default "datetime"
   */
  type?: DateTimeFieldType;

  /**
   * Minimum allowed value, in the same format as the value for the current `type`.
   *
   * Earlier options can't be picked, and an earlier value shows an error message.
   * For `datetime`, the time limit only applies to the minimum's own date.
   */
  min?: string;

  /**
   * Maximum allowed value, in the same format as the value for the current `type`.
   *
   * Later options can't be picked, and a later value shows an error message.
   * For `datetime`, the time limit only applies to the maximum's own date.
   */
  max?: string;

  /**
   * Removes the ability to click or target the field.
   * @default false
   */
  disabled?: boolean;

  /**
   * Displays a loading indicator on the input. The field keeps its label as
   * accessible name and is marked as busy, and assistive technologies ignore
   * the indicator.
   * @default false
   */
  loading?: boolean;

  /**
   * Displays clear action, which is hidden while the field is `readonly`.
   * @default false
   */
  clearable?: boolean;

  /**
   * Prevent value changes. The pickers won't open.
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
