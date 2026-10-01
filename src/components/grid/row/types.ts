/**
 * Props exposed by the {@link Row} component.
 */
export type RowProps = {
  /**
   * Vertical alignment of the row's columns, relative to the tallest column on the same line.
   * Available options are:
   * - `"start"`: aligns the columns to the top;
   * - `"center"`: centers the columns vertically;
   * - `"end"`: aligns the columns to the bottom;
   * - `"stretch"`: stretches every column to the height of the tallest one.
   *
   * Use `"stretch"` to keep side by side columns at the same height, e.g. cards made of
   * `USection`s with `fullHeight`.
   *
   * Columns sit side by side only from the `sm` breakpoint up. Below it, each column takes a
   * whole line, so the alignment has no visible effect.
   * @default "start"
   */
  align?: RowAlign;

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

export type RowAlign = "start" | "center" | "end" | "stretch";
