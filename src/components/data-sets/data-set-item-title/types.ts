/**
 * Props exposed by the {@link DataSetItemTitle} component.
 */
export type DataSetItemTitleProps = {
  /**
   * Text displayed as the record's title. Replaced by the default slot, when
   * provided.
   */
  title?: string;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};

/**
 * Slots exposed by the {@link DataSetItemTitle} component.
 */
export type DataSetItemTitleSlots = {
  /**
   * Content displayed as the record's title, replacing the `title` prop.
   */
  default?: () => unknown;
};
