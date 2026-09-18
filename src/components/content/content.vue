<template>
  <v-card-text>
    <slot />
  </v-card-text>
</template>

<script lang="ts">
/**
 * Proxy component for Vuetify's `v-card-text`, used to structure content
 * displayed inside a {@link ContentSet}.
 *
 * @example
 * ```vue
 * <content-set title="Title">
 *   <content>Content</content>
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
import { VCardText } from "vuetify/components";
</script>
