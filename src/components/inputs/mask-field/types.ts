import type { TextFieldVariant } from "@/components/inputs/text-field/types.ts";

export type MaskFieldVariant = TextFieldVariant;

/**
 * Masks the library provides:
 *
 * - `cpf`: `###.###.###-##` (e.g. `123.456.789-09`);
 * - `cnpj`: `##.###.###/####-##` (e.g. `12.345.678/0001-95`);
 * - `cep`: `#####-###` (e.g. `01310-100`);
 * - `phone`: `(##) #####-####` (e.g. `(11) 91234-5678`);
 * - `date`: `##/##/####` (e.g. `31/12/2026`), formatting only.
 */
export type MaskFieldPreset = "cpf" | "cnpj" | "cep" | "phone" | "date";

/**
 * A preset name, or the mask itself, where `#` is a digit (0–9) and any other
 * character, letters included, is a literal inserted automatically (e.g.
 * `####-##/####` or `Nº ####`).
 *
 * A custom mask must contain at least one `#`, so a misspelled preset (e.g.
 * `"cpff"`) is a type error.
 *
 * @example
 * ```ts
 * const preset: MaskFieldMask = "cpf";
 * const custom: MaskFieldMask = "####-##/####";
 * const withLetters: MaskFieldMask = "Nº ####";
 * ```
 */
export type MaskFieldMask = MaskFieldPreset | `${string}#${string}`;

/**
 * Props exposed by the {@link MaskField} component.
 */
export type MaskFieldProps = {
  /**
   * Applies a distinct style variation to the field.
   * One of `primary` or `secondary`.
   * @default "primary"
   */
  variant?: MaskFieldVariant;

  /**
   * Mask applied to the value while the user types. One of the presets
   * (`cpf`, `cnpj`, `cep`, `phone` or `date`), or the mask itself, where `#`
   * is a digit (0–9) and any other character, letters included, is a literal
   * inserted automatically (e.g. `####-##/####` or `Nº ####`). A custom mask
   * must contain at least one `#`.
   *
   * Only digits are accepted, up to the number of `#` in the mask, and the
   * `v-model` holds only the digits (e.g. `12345678909` for `cpf`). A literal
   * the user could also type, such as a fixed digit (`0800 ###-####`), isn't
   * supported: where the literal is expected, the same character is read as
   * the literal.
   *
   * The `cpf` and `cnpj` masks don't validate check digits, and `cnpj` only
   * accepts digits (not the alphanumeric CNPJ).
   *
   * Changing it keeps the `v-model`: a value that doesn't fit the new mask
   * (e.g. longer than it) is displayed cut and fails validation with "Valor
   * inválido".
   */
  mask: MaskFieldMask;

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
   * Field placeholder. Defaults to the mask, with `0` in place of each `#`,
   * e.g. `000.000.000-00` for `cpf` and `Nº 0000` for `Nº ####`.
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
