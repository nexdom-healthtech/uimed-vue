/**
 * Props exposed by the {@link Frm} component.
 */
export type FrmProps = {
  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};

/**
 * Events emitted by the {@link Frm} component.
 */
export type FrmEmits = {
  /**
   * Emitted when the form is submitted.
   * @param {SubmitEvent} event - The native `SubmitEvent` object associated with the form, **already default prevented**.
   * @returns void
   */
  (e: "submit", event: SubmitEvent): void;
};
