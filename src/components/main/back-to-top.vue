<template>
  <v-fab
    :active="props.active"
    :icon="icons.backToTop"
    color="tertiary"
    location="bottom end"
    app
    @click="emit('click')"
  >
    <v-icon :icon="icons.backToTop" />
    <!-- The FAB gives its attributes to its wrapper instead of its button, so the button can't take
    an aria-label: its name is a text that only screen readers read, which no prop provides -->
    <span class="d-sr-only">Retornar ao topo</span>
  </v-fab>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import type { BackToTopEmits, BackToTopProps } from "@/components/main/types.ts";
import { icons } from "@/consts/icons.ts";
import { VFab, VIcon } from "vuetify/components";

const props = defineProps<BackToTopProps>();
const emit = defineEmits<BackToTopEmits>();
</script>
