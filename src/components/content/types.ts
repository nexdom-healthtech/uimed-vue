import type { BtnProps } from "@/components/btn/types.ts";

export type ContentSetVariant = "primary" | "secondary";

/**
 * Props exposed by the {@link ContentSet} component.
 */
export type ContentSetProps = {
  /**
   * Applies a distinct style variation to the content set.
   * One of `primary` or `secondary`.
   * @default "primary"
   */
  variant?: ContentSetVariant;

  /**
   * Title displayed at the top of the content set.
   */
  title?: string;

  /**
   * Subtitle displayed below the title.
   */
  subtitle?: string;

  /**
   * List of actions displayed at the bottom of the content set, inside
   * `v-card-actions`. When undefined or empty, no actions area is rendered.
   */
  actions?: ContentSetAction[];

  /**
   * Makes the content set occupy 100% of its parent's width.
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Makes the content set occupy 100% of its parent's height.
   * @default false
   */
  fullHeight?: boolean;

  /**
   * Shows a skeleton loader in place of the content while data is being
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
 * A single action rendered inside {@link ContentSet}'s actions area.
 */
export interface ContentSetAction extends BtnProps {
  /**
   * Text displayed on the action button.
   */
  label: string;

  /**
   * Called when the action button is clicked.
   */
  onClick?: (event: MouseEvent) => void;
}
