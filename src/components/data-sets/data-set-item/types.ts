import type { SectionAction, SectionVariant } from "@/components/sections/section/types.ts";

/**
 * Props exposed by the {@link DataSetItem} component.
 */
export type DataSetItemProps = {
  /**
   * Title displayed at the top of the record's card.
   */
  title?: string;

  /**
   * Short description displayed below the title.
   */
  subtitle?: string;

  /**
   * Applies a distinct style variation to the record's card, just like on
   * `USection`. One of `primary` or `secondary`.
   * @default "primary"
   */
  variant?: SectionVariant;

  /**
   * Actions of the record, like "Editar" and "Excluir", displayed at the
   * bottom of its card, just like on `USection`. When undefined or empty, no
   * actions area is rendered.
   */
  actions?: SectionAction[];

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};

/**
 * Slots exposed by the {@link DataSetItem} component.
 */
export type DataSetItemSlots = {
  /**
   * Details of the record, displayed below the title and subtitle, like a
   * vertical `UTable` with some of its fields.
   */
  default?: () => unknown;
};
