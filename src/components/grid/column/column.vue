<template>
  <v-col cols="12" :sm="cols" :data-testid="props.dataTestid">
    <slot />
  </v-col>
</template>

<script lang="ts">
/**
 * Column component to be placed within a row.
 *
 * @example
 * ```vue
 * <container>
 *   <row>
 *     <col>
 *       <!-- uimed-components -->
 *     </col>
 *   </row>
 * </container>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/layout#linhas-e-colunas | Column Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { type ColumnProps } from "@/components/grid/column/types.ts";
import { VCol } from "vuetify/components";

const { cols = "12", ...props } = defineProps<ColumnProps>();
</script>
