<template>
  <v-container :data-testid="props.dataTestid" fluid>
    <slot />
  </v-container>
</template>

<script lang="ts">
/**
 * Container component to be placed at the top of the component tree.
 *
 * @example
 * ```vue
 * <container>
 *   <!-- uimed-components -->
 * </container>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/layout#container | Container Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { type ContainerProps } from "@/components/grid/container/types";
import { VContainer } from "vuetify/components";

const props = defineProps<ContainerProps>();
</script>
