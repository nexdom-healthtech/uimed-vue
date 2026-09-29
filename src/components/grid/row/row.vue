<template>
  <v-row :tag :class="listClasses" :data-testid="props.dataTestid">
    <slot />
  </v-row>
</template>

<script lang="ts">
/**
 * Row component to be placed within a container.
 *
 * @example
 * ```vue
 * <template>
 *   <u-container>
 *    <u-row>
 *       <!-- uimed-column -->
 *     </u-row>
 *   </u-container>
 * </template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/layout | Row Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { type RowProps } from "@/components/grid/row/types.ts";
import { VRow } from "vuetify/components";

const props = defineProps<RowProps>();

const tag = computed(() => (props.list ? "ul" : undefined));
const listClasses = computed(() => (props.list ? "pa-0 ma-0" : undefined));
</script>
