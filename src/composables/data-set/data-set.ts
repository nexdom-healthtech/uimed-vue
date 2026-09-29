import type { DataSetProps } from "@/components/data-sets/data-set/types.ts";
import { computed, toValue, watch, type ComputedRef, type MaybeRefOrGetter, type Ref } from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import type { VDataIterator } from "vuetify/components";

type VDataIteratorProps = ComponentProps<typeof VDataIterator>;
type VuetifyFilterKeys = VDataIteratorProps["filterKeys"];

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
