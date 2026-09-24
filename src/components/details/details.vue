<template>
  <v-skeleton-loader :loading="props.loading" type="heading" width="100%">
    <v-expansion-panels :flat="outlined" :data-testid="props.dataTestid">
      <v-expansion-panel :class="{ border: outlined }">
        <v-expansion-panel-title>{{ props.title }}</v-expansion-panel-title>
        <v-expansion-panel-text>
          <slot />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-skeleton-loader>
</template>

<script lang="ts">
/**
 * Details component to show content that can be expanded or collapsed by
 * clicking on its title. Starts collapsed.
 *
 * @example
 * ```vue
 * <template>
 *   <u-details title="Title">
 *     Content
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
import { computed } from "vue";
import {
  VExpansionPanel,
  VExpansionPanels,
  VExpansionPanelText,
  VExpansionPanelTitle,
  VSkeletonLoader,
} from "vuetify/components";
import type { DetailsProps } from "@/components/details/types.ts";

const props = defineProps<DetailsProps>();

const outlined = computed(() => props.variant === "secondary");
</script>
