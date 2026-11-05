<template>
  <skeleton-loader :loading="props.loading" type="heading" full-width>
    <v-defaults-provider :defaults>
      <v-expansion-panels :flat="outlined" :data-testid="props.dataTestid">
        <slot />
      </v-expansion-panels>
    </v-defaults-provider>
  </skeleton-loader>
</template>

<script lang="ts">
/**
 * Accordion of items (`UDetailsItem`) whose content is expanded or collapsed by
 * clicking on their titles. They start collapsed, and only one stays expanded
 * at a time.
 *
 * @example
 * ```vue
 * <template>
 *   <u-details>
 *     <u-details-item title="Title">Content</u-details-item>
 *     <u-details-item title="Other title">Other content</u-details-item>
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
import { VDefaultsProvider, VExpansionPanels } from "vuetify/components";
import SkeletonLoader from "@/components/skeleton-loader/skeleton-loader.vue";
import type { DetailsProps } from "@/components/details/types.ts";

const props = defineProps<DetailsProps>();

const outlined = computed(() => props.variant === "secondary");
// Outlines each item, which the panels only take as a class
const defaults = computed(() => ({
  VExpansionPanel: { class: outlined.value ? "border" : undefined },
}));
</script>
