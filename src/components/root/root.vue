<template>
  <VApp :data-testid="props.dataTestid">
    <slot />
  </VApp>
</template>

<script lang="ts">
/**
 * Root component to be placed at the top of the component tree.
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
