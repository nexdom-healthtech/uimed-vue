import type { ColumnProps } from "@/components/grid/column/types.ts";
import type { SectionAction } from "@/components/sections/section/types.ts";

/**
 * Props exposed by the internal {@link DataSetBar} component.
 */
export type DataSetBarProps = {
  /**
   * Actions about the whole list, rendered as buttons at the start of the bar.
   */
  actions?: SectionAction[];

  /**
   * Whether the search field is rendered at the end of the bar.
   */
  searchable?: boolean;

  /**
   * Width, out of the bar's 12 columns, of the actions and of the search field
   * when both are rendered: `"6"` to share a line, or `"12"` to take a line
   * each, when the bar is too narrow for the search field to fit in half of it.
   */
  cols: Extract<ColumnProps["cols"], "6" | "12">;
};
