<template>
  <v-snackbar-queue
    v-model="messages"
    display-strategy="overflow"
    location="top end"
    total-visible="3"
    collapsed
    closable
    timer
  >
    <template v-slot:actions="{ props }">
      <v-icon-btn
        v-bind="props"
        aria-label="Fechar"
        icon="$close"
        size="small"
        variant="text"
      ></v-icon-btn>
    </template>
  </v-snackbar-queue>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { messages } from "@/composables/dialogs/use-toast.ts";
import { VSnackbarQueue, VIconBtn } from "vuetify/components";
</script>
