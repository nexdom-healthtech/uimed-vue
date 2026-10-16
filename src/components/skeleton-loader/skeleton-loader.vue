<template>
  <v-skeleton-loader
    :loading="props.loading"
    :type="props.type"
    :color="props.color"
    :class="[widthClass, heightClass]"
    v-bind="loadingAttrs"
  >
    <slot />
  </v-skeleton-loader>
</template>

<script lang="ts">
/**
 * Internal skeleton shown in place of content while it loads, announced to
 * screen readers in both client and server rendering. Components that show a
 * loading skeleton use it instead of Vuetify's skeleton loader.
 *
 * @example
 * ```vue
 * <template>
 *   <skeleton-loader :loading="props.loading" type="card" full-width>
 *     <v-card>Content</v-card>
 *   </skeleton-loader>
 * </template>
 * ```
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useLocale } from "vuetify";
import { VSkeletonLoader } from "vuetify/components";
import type { SkeletonLoaderProps } from "@/components/skeleton-loader/types.ts";
import { useFullHeight, useFullWidth } from "@/composables/dimensions/dimensions.ts";

const props = defineProps<SkeletonLoaderProps>();

const { t } = useLocale();
const widthClass = useFullWidth(() => props.fullWidth);
const heightClass = useFullHeight(() => props.fullHeight);

// The base skeleton sets `ariaLabel`/`ariaLive` in camelCase, which the server
// renderer writes as the invalid `arialabel`/`arialive` attributes (#109). Unset
// them and pass the hyphenated attributes, which both renderers write as is.
// They only reach the DOM while the skeleton is shown, never the slot content.
// If a Vuetify update makes the pt-BR announcement test fail, Vuetify likely
// sets the hyphenated attributes itself now: remove this component then.
const loadingAttrs = computed(() => ({
  ariaLabel: undefined,
  ariaLive: undefined,
  "aria-label": t("$vuetify.loading"),
  "aria-live": "polite",
}));
</script>
