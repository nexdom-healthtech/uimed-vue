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

      <!--
        MD3 cards have a 16px padding and 8px between actions; actions are end-aligned for
        consistency with dialogs. The card already sets the 8px gap, and `SectionContent` provides
        the spacing above the actions, but no prop sets the paddings or the alignment, hence the
        classes.
      -->
      <v-card-actions v-if="showActions" class="mt-auto justify-end px-4 pt-0 pb-4">
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
 * <template>
 *   <u-section title="Title" subtitle="Subtitle">
 *     Content
 *   </u-section>
 * <template>
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
