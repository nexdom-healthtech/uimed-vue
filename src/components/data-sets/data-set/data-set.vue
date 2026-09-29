<template>
  <v-skeleton-loader :loading="props.loading" type="card" width="100%">
    <v-data-iterator
      ref="iterator"
      v-model:page="page"
      :items="props.items"
      :items-per-page="props.itemsPerPage"
      :search
      :filter-keys="filterKeys"
      :data-testid="props.dataTestid"
    >
      <template #header>
        <TextField v-if="props.searchable" v-model="search" type="search" label="Pesquisar" />
      </template>

      <template #default="{ items: pageItems }">
        <Row>
          <Column v-for="(pageItem, index) in pageItems" :key="index" :cols="columnCols">
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
  </v-skeleton-loader>
</template>

<script lang="ts">
/**
 * Data set component to list records as a responsive grid of cards, with
 * client-side pagination and an optional search field. Each record of the
 * current page is rendered by the default slot, usually with `UDataSetItem`.
 *
 * @example
 * ```vue
 * <template>
 *   <u-data-set :items="patients" :columns="4" searchable>
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
import { VDataIterator, VEmptyState, VPagination, VSkeletonLoader } from "vuetify/components";
import Column from "@/components/grid/column/column.vue";
import Row from "@/components/grid/row/row.vue";
import TextField from "@/components/inputs/text-field/text-field.vue";
import type { DataSetProps, DataSetSlots } from "@/components/data-sets/data-set/types.ts";
import {
  getDataSetTotalVisible,
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
const filterKeys = useDataSetFilterKeys(() => props.searchKeys);
useDataSetSearchPageReset(search, page);
</script>
