<template>
  <v-card-text>
    <slot />
  </v-card-text>
</template>

<script lang="ts">
/**
 * Proxy component for Vuetify's `v-card-text`, used to structure content
 * displayed inside a {@link Section}.
 *
 * @example
 * ```vue
 * <template>
 *   <u-section title="Title">
 *     <u-section-content>Content</u-section-content>
 *   </u-section>
 * </template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/section | Section Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { VCardText } from "vuetify/components";
</script>
