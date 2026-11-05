<template>
  <v-expansion-panel :data-testid="props.dataTestid">
    <v-expansion-panel-title>{{ props.title }}</v-expansion-panel-title>
    <v-expansion-panel-text>
      <slot />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts">
/**
 * Item of a `UDetails`, with a title that expands or collapses its content
 * when clicked. It must be placed inside a `UDetails`.
 *
 * @example
 * ```vue
 * <template>
 *   <u-details>
 *     <u-details-item title="Title">Content</u-details-item>
 *   </u-details>
 * </template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/details | Details Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { VExpansionPanel, VExpansionPanelText, VExpansionPanelTitle } from "vuetify/components";
import type { DetailsItemProps } from "@/components/details/types.ts";

const props = defineProps<DetailsItemProps>();
</script>
