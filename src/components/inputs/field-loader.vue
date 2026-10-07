<template>
  <v-progress-linear
    :active="props.isActive"
    :color="props.color"
    height="2"
    indeterminate
    aria-hidden="true"
  />
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { VProgressLinear } from "vuetify/components";

const props = defineProps<{
  /**
   * Color given by the field's loader slot: the field's color, or the error
   * color when the field is invalid.
   */
  color?: string;

  /**
   * Whether the field is loading.
   */
  isActive: boolean;
}>();
</script>
