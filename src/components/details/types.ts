export type DetailsVariant = "primary" | "secondary";

/**
 * Props exposed by the {@link Details} component.
 */
export type DetailsProps = {
  /**
   * Applies a distinct style variation to all the items.
   * One of `primary` or `secondary`.
   * @default "primary"
   */
  variant?: DetailsVariant;

  /**
   * Shows a skeleton loader in place of the items while data is being
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
 * Props exposed by the {@link DetailsItem} component.
 */
export type DetailsItemProps = {
  /**
   * Title displayed on the item's header, which expands or collapses its
   * content when clicked. The header stays clickable even without a title.
   */
  title?: string;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};
