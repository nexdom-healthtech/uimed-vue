import type { SectionAction } from "@/components/sections/section/types.ts";

/**
 * Number of records shown side by side on each row of a {@link DataSet}.
 */
export type DataSetColumns = 1 | 2 | 3 | 4 | 6;

/**
 * Props exposed by the {@link DataSet} component.
 */
export type DataSetProps<T extends object> = {
  /**
   * Records to be listed. Each record of the current page is passed, as is,
   * to the default slot.
   * @default []
   */
  items?: T[];

  /**
   * Maximum number of records shown side by side on each row of the grid.
   * One of `1`, `2`, `3`, `4` or `6`.
   *
   * It's reduced to the largest of these values that keeps each record's card
   * at least 240px wide within the data set's own width, so narrow
   * containers, like dialogs or side panels, show fewer records per row, down
   * to a single one. On extra small screens, each record always takes the
   * full width.
   * @default 3
   */
  columns?: DataSetColumns;

  /**
   * Maximum number of records shown per page. Page controls are only shown
   * when there's more than one page.
   * @default 10
   */
  itemsPerPage?: number;

  /**
   * List of actions about the whole list, such as creating a record, displayed
   * as buttons at the start of the bar above the records, before the search
   * field. Same shape as `USection`'s actions.
   *
   * With the search field, the actions take the first half of the bar,
   * wrapping within it, or a line of their own when the data set isn't wide
   * enough for two records side by side. On extra small screens, each action
   * takes a line of its own and the full width. When undefined or empty, and
   * `searchable` is false, no bar is rendered.
   */
  actions?: SectionAction[];

  /**
   * Shows a search field at the end of the bar above the records, bound to
   * `v-model:search`. It's 240px wide, the same as a card's minimum width. On
   * extra small screens, it takes a line of its own and the full width.
   * @default false
   */
  searchable?: boolean;

  /**
   * Record properties considered by the search. When undefined or empty,
   * every property of the record is considered.
   */
  searchKeys?: Array<Extract<keyof T, string>>;

  /**
   * Message shown when there are no records to list, either because `items`
   * is empty or because no record matches the search.
   * @default "Nenhum registro encontrado."
   */
  noDataText?: string;

  /**
   * Shows a skeleton loader in place of the records while data is being
   * loaded.
   * @default false
   */
  loading?: boolean;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};

/**
 * Slots exposed by the {@link DataSet} component.
 */
export type DataSetSlots<T extends object> = {
  /**
   * Renders each record of the current page in its own grid column, usually
   * with `UDataSetItem`.
   * @param props.item The original record, from `items`.
   * @param props.index Position of the record inside the current page.
   */
  default?: (props: { item: T; index: number }) => unknown;
};
