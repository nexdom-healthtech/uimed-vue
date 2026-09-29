import type { DataSetColumns, DataSetProps } from "@/components/data-sets/data-set/types.ts";
import type { ColumnProps } from "@/components/grid/column/types.ts";
import {
  computed,
  onScopeDispose,
  ref,
  toValue,
  watch,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import type { VDataIterator } from "vuetify/components";

type VDataIteratorProps = ComponentProps<typeof VDataIterator>;
type VuetifyFilterKeys = VDataIteratorProps["filterKeys"];
type ColumnCols = NonNullable<ColumnProps["cols"]>;

/**
 * Width, out of the grid's 12 columns, taken by each record so that
 * `columns` records fit side by side on a row.
 */
const dataSetColumnsToColumnCols: Record<DataSetColumns, ColumnCols> = {
  1: "12",
  2: "6",
  3: "4",
  4: "3",
  6: "2",
};

/**
 * Minimum width, in pixels, of each record's card. Fewer records are placed
 * side by side when the data set isn't wide enough to keep its cards at least
 * this wide.
 */
const minDataSetItemWidth = 240;

/**
 * Space, in pixels, between two cards of the same row: the default gutter of
 * `URow`/`UColumn` (Vuetify's `v-row` with its default density puts a 24px
 * gap between its columns). `n` cards side by side take `n` card widths plus
 * `n - 1` gaps, so they fit in `width` pixels when
 * `n * (minDataSetItemWidth + gap) <= width + gap`.
 */
const dataSetItemGap = 24;

/**
 * Supported numbers of records per row, from the largest to the smallest.
 */
const dataSetColumnsOptions: DataSetColumns[] = [6, 4, 3, 2, 1];

/**
 * Number of records to place side by side: the largest supported amount, up
 * to `columns`, that keeps each card at least {@link minDataSetItemWidth}
 * pixels wide, besides the {@link dataSetItemGap} between cards, in a data set
 * `width` pixels wide, but never less than one.
 * While the width is unknown (`0`, e.g. before the first measure or during
 * server-side rendering), `columns` is used as is.
 */
export function getDataSetFittingColumns(columns: DataSetColumns, width: number): DataSetColumns {
  if (!width) return columns;
  const fittingColumns = Math.min(
    columns,
    Math.floor((width + dataSetItemGap) / (minDataSetItemWidth + dataSetItemGap)),
  );
  return dataSetColumnsOptions.find((option) => option <= fittingColumns) ?? 1;
}

/**
 * Reactive version of {@link getDataSetFittingColumns}.
 */
export function useDataSetFittingColumns(
  columns: MaybeRefOrGetter<DataSetColumns>,
  width: MaybeRefOrGetter<number>,
): ComputedRef<DataSetColumns> {
  return computed(() => getDataSetFittingColumns(toValue(columns), toValue(width)));
}

/**
 * Width, in pixels, of the given element, kept up to date with a
 * `ResizeObserver`. It's `0` while there's no element, e.g. before it's
 * mounted, and the observer is disconnected when the element changes or the
 * calling scope is disposed.
 */
export function useDataSetWidth(
  element: MaybeRefOrGetter<Element | null | undefined>,
): Ref<number> {
  const width = ref(0);
  let observer: ResizeObserver | undefined;

  function disconnect() {
    observer?.disconnect();
    observer = undefined;
  }

  watch(
    () => toValue(element),
    (currentElement) => {
      disconnect();
      width.value = 0;
      if (!currentElement) return;

      observer = new ResizeObserver(([entry]) => {
        width.value = entry.contentRect.width;
      });
      observer.observe(currentElement);
    },
    { immediate: true },
  );

  onScopeDispose(disconnect);

  return width;
}

/**
 * Maps the number of records per row to the width of each record's grid
 * column.
 */
export function useDataSetColumnCols(
  columns: MaybeRefOrGetter<DataSetColumns>,
): ComputedRef<ColumnCols> {
  return computed(() => dataSetColumnsToColumnCols[toValue(columns)]);
}

/**
 * Maps the record properties considered by the search to Vuetify's filter
 * keys. An empty list means every property, just like an undefined one.
 */
export function useDataSetFilterKeys<T extends object>(
  searchKeys: MaybeRefOrGetter<DataSetProps<T>["searchKeys"]>,
): ComputedRef<VuetifyFilterKeys> {
  return computed(() => {
    const keys = toValue(searchKeys);
    return keys?.length ? keys : undefined;
  });
}

/**
 * Up to this many pages, every page button is shown. Vuetify's automatic
 * sizing collapses 3 pages into `1 … 2 … 3` in containers narrower than
 * ~336px, although showing every page never takes more room than its
 * collapsed form (`1 … x … 5`, 5 buttons) up to this amount.
 */
const maxAlwaysVisiblePages = 5;

/**
 * Number of page buttons to show for `pageCount` pages: every page up to
 * {@link maxAlwaysVisiblePages}, otherwise `undefined` to let Vuetify fit them
 * to the available width.
 */
export function getDataSetTotalVisible(pageCount: number): number | undefined {
  return pageCount <= maxAlwaysVisiblePages ? pageCount : undefined;
}

/**
 * Goes back to the first page whenever the search changes. It must run before
 * the new search reaches Vuetify's iterator, which would otherwise clamp the
 * outdated page to the last one of the filtered records.
 */
export function useDataSetSearchPageReset(search: MaybeRefOrGetter<string>, page: Ref<number>) {
  watch(
    () => toValue(search),
    () => {
      page.value = 1;
    },
  );
}
