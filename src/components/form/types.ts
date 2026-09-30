/**
 * Props exposed by the {@link Form} component.
 */
export type FormProps = {
  /**
   * Id to set on `form` native element.
   */
  id?: string;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};

/**
 * Events emitted by the {@link Form} component.
 */
export type FormEmits =
  /**
   * Emitted when the form is submitted. Not emitted while one of the form's submit buttons,
   * including the ones outside it linked by `form`, is `loading`.
   * @param {SubmitEvent} event - The native `SubmitEvent` object associated with the form, **already default prevented**.
   * @returns void
   */
  (e: "submit", event: SubmitEvent) => void;
