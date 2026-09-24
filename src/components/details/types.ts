export type DetailsVariant = "primary" | "secondary";

/**
 * Props exposed by the {@link Details} component.
 */
export type DetailsProps = {
  /**
   * Applies a distinct style variation to the details.
   * One of `primary` or `secondary`.
   * @default "primary"
   */
  variant?: DetailsVariant;

  /**
   * Title displayed on the header, which expands or collapses the content
   * when clicked. The header stays clickable even without a title.
   */
  title?: string;

  /**
   * Shows a skeleton loader in place of the details while data is being
   * loaded.
   * @default false
   */
  loading?: boolean;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};
