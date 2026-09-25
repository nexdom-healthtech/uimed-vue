import type { TextFieldVariant } from "@/components/inputs/text-field/types.ts";

/**
 * Autocomplete/Combobox item type that can be either a string or an object with label and value.
 */
export type AutocompleteItem<T = string> = string | { label: string; value: T };

/**
 * Props exposed by the {@link AutocompleteField} component.
 */
export type AutocompleteFieldProps<T = string, Multiple extends boolean = false> = {
  /**
   * Applies a distinct style variation to the field.
   * One of `primary` or `secondary`.
   * @default "primary"
   */
  variant?: TextFieldVariant;

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
   * Add rules to require field to be filled before form submission.
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

  /**
   * Used to prevent user from adding new values to the list.
   * @default false
   */
  strict?: boolean;

  /**
   * Allow selecting/typing more than one value.
   *
   * Passing the literal `true` narrows `modelValue` and `update:modelValue`
   * to `T[]` instead of `T`.
   * @default false
   */
  multiple?: Multiple;

  /**
   * List of autocomplete items. Can be strings or objects with label and value.
   * @default []
   */
  items?: AutocompleteItem<T>[];
};

export type NormalizedItem<TValue> = {
  label: string;
  value: TValue;
};
