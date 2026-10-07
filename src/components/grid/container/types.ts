/**
 * Props exposed by the {@link Container} component.
 */
export type ContainerProps = {
  /**
   * Stretches the container to the whole height of its parent, which must have a height of its
   * own, e.g. the content area of `UMain`.
   * @default false
   */
  fullHeight?: boolean;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};
