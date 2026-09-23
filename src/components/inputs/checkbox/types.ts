/**
 * Props exposed by the {@link Checkbox} component.
 */
export type CheckboxProps = {
  /**
   * Field label.
   */
  label?: string;

  /**
   * Removes the ability to click or target the checkbox.
   * @default false
   */
  disabled?: boolean;

  /**
   * Prevent value changes.
   * @default false
   */
  readonly?: boolean;

  /**
   * Value applied to the model when the checkbox is checked.
   * @default true
   */
  trueValue?: any;

  /**
   * Value applied to the model when the checkbox is unchecked.
   * @default false
   */
  falseValue?: any;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};
