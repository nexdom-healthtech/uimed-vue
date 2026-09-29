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
   * Maximum number of records shown per page. Page controls are only shown
   * when there's more than one page.
   * @default 10
   */
  itemsPerPage?: number;

  /**
   * Shows a search field above the records, bound to `v-model:search`.
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
   * Renders each record of the current page, usually with `UDataSetItem`.
   * @param props.item The original record, from `items`.
   * @param props.index Position of the record inside the current page.
   */
  default?: (props: { item: T; index: number }) => unknown;
};
