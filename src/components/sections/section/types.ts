import type { ButtonProps } from "@/components/button/types.ts";

export type SectionVariant = "primary" | "secondary";

export type SectionTextAlign = "start" | "center" | "end";

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
   * Horizontal alignment of the section's title, subtitle, content and actions.
   * Available options are:
   * - `"start"`: aligns the text to the start (left in left-to-right languages)
   *   and keeps the actions at the end;
   * - `"center"`: centers the text and the actions;
   * - `"end"`: aligns the text and the actions to the end.
   *
   * Uses `start`/`end` instead of `left`/`right`, so it follows the text
   * direction in right-to-left languages. Nested components inherit the
   * alignment, unless they define their own.
   * @default "start"
   */
  textAlign?: SectionTextAlign;

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
   *
   * Inside a `URow`, set its `alignY` to `"stretch"` so the section takes the height of the
   * tallest column on the same line.
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
