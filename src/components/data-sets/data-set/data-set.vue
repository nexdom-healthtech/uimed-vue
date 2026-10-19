<template>
  <skeleton-loader :loading="props.loading" type="card" full-width>
    <!-- The bar and the records take a line each of the same row, so the grid spaces them as it
         spaces its lines. The bar stays out of the iterator's header, where nothing would space
         it from the records -->
    <Row :data-testid="props.dataTestid">
      <Column v-if="props.actions?.length || props.searchable">
        <DataSetBar
          v-model="search"
          :actions="props.actions"
          :searchable="props.searchable"
          :cols="barColumnCols"
        />
      </Column>
      <Column>
        <v-data-iterator
          ref="iterator"
          v-model:page="page"
          :items="props.items"
          :items-per-page="props.itemsPerPage"
          :search
          :filter-keys="filterKeys"
        >
          <template #default="{ items: pageItems }">
            <!-- Stretched, so the items of the same line (e.g. full-height cards) share its height -->
            <Row list align-y="stretch">
              <Column
                v-for="(pageItem, index) in pageItems"
                :key="index"
                :cols="columnCols"
                list-item
              >
                <slot :item="pageItem.raw" :index />
              </Column>
            </Row>
          </template>

          <template #no-data>
            <v-empty-state :text="props.noDataText" />
          </template>

          <template #footer="{ pageCount }">
            <v-pagination
              v-if="pageCount > 1"
              v-model="page"
              :length="pageCount"
              :total-visible="getDataSetTotalVisible(pageCount)"
            />
          </template>
        </v-data-iterator>
      </Column>
    </Row>
  </skeleton-loader>
</template>

<script lang="ts">
/**
 * Data set component to list records as a responsive grid of cards, with
 * client-side pagination, and an optional bar above the records with actions
 * about the list and a search field. Each record of the current page is
 * rendered by the default slot, usually with `UDataSetItem`.
 *
 * @example
 * ```vue
 * <template>
 *   <u-data-set
 *     :items="patients"
 *     :columns="4"
 *     :actions="[{ label: 'Novo paciente', onClick: create }]"
 *     searchable
 *   >
 *     <template #default="{ item }">
 *       <u-data-set-item :title="item.name" :subtitle="item.plan" />
 *     </template>
 *   </u-data-set>
 * </template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/data-set | DataSet Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts" generic="T extends object">
import { useTemplateRef, type ComponentPublicInstance } from "vue";
import { VDataIterator, VEmptyState, VPagination } from "vuetify/components";
import DataSetBar from "@/components/data-sets/data-set-bar.vue";
import Column from "@/components/grid/column/column.vue";
import Row from "@/components/grid/row/row.vue";
import SkeletonLoader from "@/components/skeleton-loader/skeleton-loader.vue";
import type { DataSetProps, DataSetSlots } from "@/components/data-sets/data-set/types.ts";
import {
  getDataSetTotalVisible,
  useDataSetBarCols,
  useDataSetColumnCols,
  useDataSetFilterKeys,
  useDataSetFittingColumns,
  useDataSetSearchPageReset,
  useDataSetWidth,
} from "@/composables/data-set/data-set.ts";

const props = withDefaults(defineProps<DataSetProps<T>>(), {
  columns: 3,
  itemsPerPage: 10,
  noDataText: "Nenhum registro encontrado.",
});
const slots = defineSlots<DataSetSlots<T>>();

const page = defineModel<number>("page", { default: 1 });
const search = defineModel<string>("search", { default: "" });

const iterator = useTemplateRef<ComponentPublicInstance>("iterator");
const width = useDataSetWidth(() => iterator.value?.$el);
const fittingColumns = useDataSetFittingColumns(() => props.columns, width);
const columnCols = useDataSetColumnCols(fittingColumns);
const barColumnCols = useDataSetBarCols(width);
const filterKeys = useDataSetFilterKeys(() => props.searchKeys);
useDataSetSearchPageReset(search, page);
</script>
