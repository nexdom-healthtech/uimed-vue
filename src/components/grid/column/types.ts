/**
 * Props exposed by the {@link Col} component.
 */
export type ColumnProps = {
  /**
   * Number of columns to stretch the component.
   * Available options are:
   * - `"auto"`: which won't try to stretch the component
   * - `"1"` to `"12"`.
   * @default "12"
   */
  cols?: Cols;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};

type Cols = "auto" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";
