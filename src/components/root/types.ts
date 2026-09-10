import type { AppBarProps } from "@/components/app-bar/types.ts";

/**
 * Props exposed by the {@link Root} component.
 */
export type RootProps = {
  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;

  /**
   * App bar properties.
   */
  appBar?: AppBarProps;
};
