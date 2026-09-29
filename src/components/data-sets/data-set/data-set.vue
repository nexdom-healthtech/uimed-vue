<template>
  <v-skeleton-loader :loading="props.loading" type="list-item-two-line@3" width="100%">
    <v-data-iterator
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
        <v-list>
          <template v-for="(pageItem, index) in pageItems" :key="index">
            <slot :item="pageItem.raw" :index />
          </template>
        </v-list>
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
 * Data set component to list records, with client-side pagination and an
 * optional search field. Each record of the current page is rendered by the
 * default slot, usually with `UDataSetItem` and `UDataSetItemTitle`.
 *
 * @example
 * ```vue
 * <template>
 *   <u-data-set :items="patients" searchable>
 *     <template #default="{ item }">
 *       <u-data-set-item>
 *         <u-data-set-item-title :title="item.name" />
 *       </u-data-set-item>
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
import {
  VDataIterator,
  VEmptyState,
  VList,
  VPagination,
  VSkeletonLoader,
} from "vuetify/components";
import TextField from "@/components/inputs/text-field/text-field.vue";
import type { DataSetProps, DataSetSlots } from "@/components/data-sets/data-set/types.ts";
import {
  getDataSetTotalVisible,
  useDataSetFilterKeys,
  useDataSetSearchPageReset,
} from "@/composables/data-set/data-set.ts";

const props = withDefaults(defineProps<DataSetProps<T>>(), {
  itemsPerPage: 10,
  noDataText: "Nenhum registro encontrado.",
});
const slots = defineSlots<DataSetSlots<T>>();

const page = defineModel<number>("page", { default: 1 });
const search = defineModel<string>("search", { default: "" });

const filterKeys = useDataSetFilterKeys(() => props.searchKeys);
useDataSetSearchPageReset(search, page);
</script>
