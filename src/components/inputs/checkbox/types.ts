/**
 * Props exposed by the {@link Checkbox} component.
 */
export type CheckboxProps<T = boolean> = {
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
  trueValue?: T;

  /**
   * Value applied to the model when the checkbox is unchecked.
   * @default false
   */
  falseValue?: T;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};
