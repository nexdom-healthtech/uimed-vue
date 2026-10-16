/**
 * Props exposed by the {@link UTable} component.
 */
export type TableProps = {
  /**
   * Optional column headers. When not provided or empty, no `<thead>` is
   * rendered in horizontal mode. In vertical mode, headers (when non-empty)
   * are used as labels for rows. When `vertical` is true and `headers` is
   * `undefined`, the component falls back to horizontal mode (single table,
   * plain rows). When `vertical` is true and `headers` is an empty array,
   * vertical mode is still used, but rows are rendered without labels (a
   * single `<td>` per row).
   */
  headers?: string[];

  /**
   * Optional rows of data. Each entry is a list of string cell values.
   * In horizontal mode, each item becomes one `<tr>` with cells as `<td>`.
   * In vertical mode with headers, renders one `v-table` per item with one `<tr>`
   * per header (th + td for that item's value). In vertical mode with an empty
   * `headers` array, renders one `v-table` per item with one `<tr>` per cell
   * value (a single `<td>`, no `<th>`). No padding or truncation applied —
   * cells are rendered exactly as provided, even if rows have different lengths.
   */
  items?: string[][];

  /**
   * Changes table layout when true. When enabled with a non-empty `headers`
   * array, renders one `v-table` per item in `items`, with each table showing
   * that item's values vertically (one row per header). When enabled with an
   * empty `headers` array, still renders one `v-table` per item, but each row
   * only has the item's value (no header label). When `headers` is
   * `undefined`, falls back to horizontal layout (single table, plain rows)
   * regardless of this prop.
   * @default false
   */
  vertical?: boolean;

  /**
   * Shows a skeleton loader in place of the table content while data is being
   * loaded.
   * @default false
   */
  loading?: boolean;

  /**
   * Component id to use on automated tests. In vertical mode with multiple
   * items, each table gets a suffixed id: `${dataTestid}-${index}`. With a
   * single table (non-vertical or vertical with one item), the unsuffixed id
   * is used. When undefined, no data-testid attribute is set.
   */
  dataTestid?: string;
};
