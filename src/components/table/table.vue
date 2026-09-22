<template>
  <v-skeleton-loader :loading="props.loading" :type>
    <template v-if="props.vertical">
      <v-table
        v-for="(item, itemIndex) in itemRows"
        :key="itemIndex"
        :data-testid="getVerticalTableTestId(itemIndex)"
      >
        <tbody>
          <template v-if="hasHeaders">
            <tr v-for="(header, headerIndex) in props.headers" :key="headerIndex">
              <th scope="row">{{ header }}</th>
              <td>{{ item[headerIndex] }}</td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="(cell, cellIndex) in item" :key="cellIndex">
              <td>{{ cell }}</td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </template>
    <template v-else>
      <v-table :data-testid="props.dataTestid">
        <thead v-if="hasHeaders && !props.vertical">
          <tr>
            <th v-for="(header, index) in props.headers" :key="index" scope="col">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in itemRows" :key="rowIndex">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
          </tr>
        </tbody>
      </v-table>
    </template>
  </v-skeleton-loader>
</template>

<script lang="ts">
/**
 * Component to present data using tables. All content is data-driven via props
 * — no slots. Supports both horizontal (default) and vertical layouts.
 *
 * @example
 * ```vue
 * <template>
 *   <u-table :headers="['Nome', 'Idade']" :items="[['Ana', '30'], ['Bruno', '25']]" />
 * </template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/table | Table Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { VTable, VSkeletonLoader } from "vuetify/components";
import type { TableProps } from "@/components/table/types.ts";

const props = defineProps<TableProps>();

const hasHeaders = computed(() => !!props.headers?.length);
const itemRows = computed(() => props.items ?? []);
const type = computed(() => {
  if (hasHeaders.value && !props.vertical) return "table-thead, table-tbody";
  return "table-tbody";
});

function getVerticalTableTestId(index: number): string | undefined {
  if (!props.dataTestid) return undefined;
  if (itemRows.value.length === 1) return props.dataTestid;
  return `${props.dataTestid}-${index}`;
}
</script>
