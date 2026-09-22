<template>
  <v-row :data-testid="props.dataTestid">
    <slot />
  </v-row>
</template>

<script lang="ts">
/**
 * Row component to be placed within a container.
 *
 * @example
 * ```vue
 * <u-container>
 *   <u-row>
 *     <!-- uimed-column -->
 *   </u-row>
 * </u-container>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/layout | Row Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { type RowProps } from "@/components/grid/row/types.ts";
import { VRow } from "vuetify/components";

const props = defineProps<RowProps>();
</script>
