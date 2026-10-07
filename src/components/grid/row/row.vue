<template>
  <v-row
    :tag
    :class="[alignXClass, alignYClass, fullHeightClasses, listClasses]"
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
import { type RowAlignX, type RowAlignY, type RowProps } from "@/components/grid/row/types.ts";
import { VRow } from "vuetify/components";

const props = withDefaults(defineProps<RowProps>(), {
  alignX: "start",
  alignY: "start",
});

// VRow's own `justify` and `align` props are deprecated in favor of the `justify-*` and
// `align-*` utility classes, so the alignment is applied through them instead.
const rowAlignXToClass: Record<RowAlignX, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

const rowAlignYToClass: Record<RowAlignY, string> = {
  start: "align-start",
  center: "align-center",
  end: "align-end",
  stretch: "align-stretch",
};

// A full height row has room left over around its lines of columns (e.g. stacked below the `sm`
// breakpoint). By default the lines would share that room and drift apart, so `align-content-*`
// keeps them together, placed as `alignY` asks. VRow has no height prop, hence `fill-height`.
const rowAlignYToContentClass: Record<RowAlignY, string> = {
  start: "align-content-start",
  center: "align-content-center",
  end: "align-content-end",
  stretch: "align-content-stretch",
};

const alignXClass = computed(() => rowAlignXToClass[props.alignX]);
const alignYClass = computed(() => rowAlignYToClass[props.alignY]);
const fullHeightClasses = computed(() =>
  props.fullHeight ? ["fill-height", rowAlignYToContentClass[props.alignY]] : undefined,
);
const tag = computed(() => (props.list ? "ul" : undefined));
const listClasses = computed(() => (props.list ? "pa-0 ma-0" : undefined));
</script>
