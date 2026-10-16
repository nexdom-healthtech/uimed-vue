import type { ComponentProps } from "vue-component-type-helpers";
import type { VSkeletonLoader } from "vuetify/components";

type VSkeletonLoaderProps = ComponentProps<typeof VSkeletonLoader>;

/**
 * Props of the internal {@link SkeletonLoader} component.
 */
export type SkeletonLoaderProps = {
  /**
   * Shows the skeleton in place of the default slot while data is being
   * loaded.
   */
  loading?: boolean;

  /**
   * Shape of the skeleton, e.g. `"image"`, `"heading"`, `"list-item@6"`.
   */
  type: NonNullable<VSkeletonLoaderProps["type"]>;

  /**
   * Makes the skeleton occupy 100% of its parent's width.
   */
  fullWidth?: boolean;

  /**
   * Makes the skeleton occupy 100% of its parent's height.
   */
  fullHeight?: boolean;

  /**
   * Color of the skeleton.
   */
  color?: string;
};
