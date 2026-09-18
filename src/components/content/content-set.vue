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
        <btn
          v-for="({ label, onClick, ...action }, index) in props.actions"
          :key="index"
          v-bind="action"
          @click="onClick"
        >
          {{ label }}
        </btn>
      </v-card-actions>
    </v-card>
  </v-skeleton-loader>
</template>

<script lang="ts">
/**
 * Content set component to group related content and actions, to be used
 * throughout the application.
 *
 * @example
 * ```vue
 * <content-set title="Title" subtitle="Subtitle">
 *   Content
 * </content-set>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/content-set | ContentSet Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { VCard, VCardActions, VSkeletonLoader } from "vuetify/components";
import Btn from "@/components/btn/btn.vue";
import type { ContentSetProps } from "@/components/content/types.ts";
import { useContentSetVariant } from "@/composables/content-set.ts";

const props = defineProps<ContentSetProps>();

const variant = useContentSetVariant(() => props.variant);
const title = computed(() => props.title || undefined);
const subtitle = computed(() => props.subtitle || undefined);
const width = computed(() => (props.fullWidth ? "100%" : undefined));
const height = computed(() => (props.fullHeight ? "100%" : undefined));
const showActions = computed(() => !!props.actions?.length);
const skeletonType = computed(() => (showActions.value ? "image, actions" : "image"));
</script>
