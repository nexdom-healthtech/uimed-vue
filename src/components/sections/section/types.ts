import type { ButtonProps } from "@/components/button/types.ts";

export type SectionVariant = "primary" | "secondary";

/**
 * Props exposed by the {@link Section} component.
 */
export type SectionProps = {
  /**
   * Applies a distinct style variation to the section.
   * One of `primary` or `secondary`.
   * @default "primary"
   */
  variant?: SectionVariant;

  /**
   * Title displayed at the top of the section.
   */
  title?: string;

  /**
   * Subtitle displayed below the title.
   */
  subtitle?: string;

  /**
   * List of actions displayed at the bottom of the section, inside
   * `v-card-actions`. When undefined or empty, no actions area is rendered.
   */
  actions?: SectionAction[];

  /**
   * Makes the section occupy 100% of its parent's width.
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Makes the section occupy 100% of its parent's height.
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
 * A single action rendered inside {@link Section}'s actions area.
 */
export interface SectionAction extends ButtonProps {
  /**
   * Text displayed on the action button.
   */
  label: string;

  /**
   * Called when the action button is clicked.
   */
  onClick?: (event: MouseEvent) => void;
}
