<template>
  <v-app :data-testid="props.dataTestid">
    <slot />
  </v-app>
</template>

<script lang="ts">
/**
 * Root component to be placed at the top of the component tree.
 *
 * @example
 * ```vue
 * <root>
 *   <!-- uimed-components -->
 * </root>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/root | Root Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { type RootProps } from "@/components/root/types.ts";
import { VApp } from "vuetify/components";

const props = defineProps<RootProps>();
</script>
