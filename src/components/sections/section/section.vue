<template>
  <skeleton-loader
    :loading="props.loading"
    :type="skeletonType"
    :full-width="props.fullWidth"
    :full-height="props.fullHeight"
  >
    <!-- The card and its actions have no alignment props, so `textAlign` uses utility classes -->
    <v-card
      :title
      :subtitle
      :variant
      :data-testid="props.dataTestid"
      :class="['d-flex flex-column', widthClass, heightClass, textAlignClasses.content]"
    >
      <slot />

      <v-card-actions v-if="showActions" :class="['mt-auto', textAlignClasses.actions]">
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
  </skeleton-loader>
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
import { VCard, VCardActions } from "vuetify/components";
import Button from "@/components/button/button.vue";
import SkeletonLoader from "@/components/skeleton-loader/skeleton-loader.vue";
import type { SectionProps } from "@/components/sections/section/types.ts";
import { useSectionTextAlign, useSectionVariant } from "@/composables/section/section.ts";
import { useFullHeight, useFullWidth } from "@/composables/dimensions/dimensions.ts";

const props = defineProps<SectionProps>();

const variant = useSectionVariant(() => props.variant);
const textAlignClasses = useSectionTextAlign(() => props.textAlign);
const title = computed(() => props.title || undefined);
const subtitle = computed(() => props.subtitle || undefined);
const widthClass = useFullWidth(() => props.fullWidth);
const heightClass = useFullHeight(() => props.fullHeight);
const showActions = computed(() => !!props.actions?.length);
const skeletonType = computed(() => (showActions.value ? "image, actions" : "image"));
</script>
