/**
 * Props exposed by the {@link Row} component.
 */
export type RowProps = {
  /**
   * Renders the row as a list (`<ul>`), without the list's default indentation
   * and bullets, so assistive technologies announce its columns as the items
   * of a list. Use it for a grid of records that is, semantically, a list,
   * like cards of patients, and set `listItem` on each of its `UColumn`s.
   * @default false
   */
  list?: boolean;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};
