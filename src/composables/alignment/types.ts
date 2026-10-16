/**
 * Horizontal alignment of a component's items: to the start, to the center or to the end,
 * following the text direction.
 */
export type AlignX = "start" | "center" | "end";

/**
 * Vertical alignment of a component's items: to the top, to the center, to the bottom, or
 * stretched to the whole height available.
 */
export type AlignY = "start" | "center" | "end" | "stretch";

export type AlignYClasses = {
  /** Vuetify's `align-*` utility class, aligning the items of each line. */
  items: string;
  /** Vuetify's `align-content-*` utility class, aligning the lines when they wrap. */
  content: string;
};
