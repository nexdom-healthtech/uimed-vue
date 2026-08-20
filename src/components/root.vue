<template>
  <VApp>
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
import { VApp } from "vuetify/components";
</script>
