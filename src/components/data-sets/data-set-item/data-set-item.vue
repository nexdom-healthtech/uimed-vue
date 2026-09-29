<template>
  <v-list-item :data-testid="props.dataTestid">
    <slot />
  </v-list-item>
</template>

<script lang="ts">
/**
 * Container of a single record listed by a {@link DataSet}. Its content,
 * like a `UDataSetItemTitle`, goes in the default slot.
 *
 * @example
 * ```vue
 * <template>
 *   <u-data-set :items="patients">
 *     <template #default="{ item }">
 *       <u-data-set-item>
 *         <u-data-set-item-title :title="item.name" />
 *         {{ item.plan }}
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

<script setup lang="ts">
import { VListItem } from "vuetify/components";
import type { DataSetItemProps } from "@/components/data-sets/data-set-item/types.ts";

const props = defineProps<DataSetItemProps>();
</script>
