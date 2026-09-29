<template>
  <v-list-item-title :data-testid="props.dataTestid">
    <slot>{{ props.title }}</slot>
  </v-list-item-title>
</template>

<script lang="ts">
/**
 * Title of a record listed by a {@link DataSet}, to be used inside a
 * `UDataSetItem`.
 *
 * @example
 * ```vue
 * <template>
 *   <u-data-set-item>
 *     <u-data-set-item-title title="Maria Silva" />
 *   </u-data-set-item>
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
import { VListItemTitle } from "vuetify/components";
import type {
  DataSetItemTitleProps,
  DataSetItemTitleSlots,
} from "@/components/data-sets/data-set-item-title/types.ts";

const props = defineProps<DataSetItemTitleProps>();

const slots = defineSlots<DataSetItemTitleSlots>();
</script>
