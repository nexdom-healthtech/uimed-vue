<template>
  <v-skeleton-loader :loading="props.loading" :type="skeletonType" :width :height>
    <v-card
      :title
      :subtitle
      :variant
      :width
      :height
      :data-testid="props.dataTestid"
      class="d-flex flex-column"
    >
      <slot />

      <v-card-actions v-if="showActions" class="mt-auto">
        <Button
          v-for="({ label, onClick, ...action }, index) in props.actions"
          :key="index"
          v-bind="action"
          @click="onClick"
        >
          {{ label }}
        </Button>
      </v-card-actions>
    </v-card>
  </v-skeleton-loader>
</template>

<script lang="ts">
/**
 * Section component to group related content and actions, to be used
 * throughout the application.
 *
 * @example
 * ```vue
 * <section title="Title" subtitle="Subtitle">
 *   Content
 * </section>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/section | Section Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { VCard, VCardActions, VSkeletonLoader } from "vuetify/components";
import Button from "@/components/button/button.vue";
import type { SectionProps } from "@/components/sections/section/types.ts";
import { useSectionVariant } from "@/composables/section/section.ts";

const props = defineProps<SectionProps>();

const variant = useSectionVariant(() => props.variant);
const title = computed(() => props.title || undefined);
const subtitle = computed(() => props.subtitle || undefined);
const width = computed(() => (props.fullWidth ? "100%" : undefined));
const height = computed(() => (props.fullHeight ? "100%" : undefined));
const showActions = computed(() => !!props.actions?.length);
const skeletonType = computed(() => (showActions.value ? "image, actions" : "image"));
</script>
