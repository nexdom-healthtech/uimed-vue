<template>
  <v-row
    :tag
    :class="[alignXClass, alignYClasses.items, heightClass, alignContentClass, listClasses]"
    :data-testid="props.dataTestid"
  >
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
 *     <u-row align-x="center" align-y="center">
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
import { useAlignX, useAlignY } from "@/composables/alignment/alignment.ts";
import { useFullHeight } from "@/composables/dimensions/dimensions.ts";

const props = defineProps<RowProps>();

// VRow's own `justify` and `align` props are deprecated in favor of the `justify-*` and
// `align-*` utility classes, so the alignment is applied through them instead.
const alignXClass = useAlignX(() => props.alignX);
const alignYClasses = useAlignY(() => props.alignY);
const heightClass = useFullHeight(() => props.fullHeight);
// A full height row has room left over around its lines of columns (e.g. stacked below the `sm`
// breakpoint). By default the lines would share that room and drift apart, so `align-content-*`
// keeps them together, placed as `alignY` asks.
const alignContentClass = computed(() =>
  props.fullHeight ? alignYClasses.value.content : undefined,
);
const tag = computed(() => (props.list ? "ul" : undefined));
const listClasses = computed(() => (props.list ? "pa-0 ma-0" : undefined));
</script>
