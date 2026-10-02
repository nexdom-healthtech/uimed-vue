<template>
  <v-row :tag :class="[alignClass, listClasses]" :data-testid="props.dataTestid">
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
 *     <u-row align="center">
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
import { type RowAlign, type RowProps } from "@/components/grid/row/types.ts";
import { VRow } from "vuetify/components";

const props = withDefaults(defineProps<RowProps>(), {
  align: "start",
});

// VRow's own `align` prop is deprecated in favor of the `align-*` utility classes, so the
// alignment is applied through them instead.
const rowAlignToClass: Record<RowAlign, string> = {
  start: "align-start",
  center: "align-center",
  end: "align-end",
  stretch: "align-stretch",
};

const alignClass = computed(() => rowAlignToClass[props.align]);
const tag = computed(() => (props.list ? "ul" : undefined));
const listClasses = computed(() => (props.list ? "pa-0 ma-0" : undefined));
</script>
