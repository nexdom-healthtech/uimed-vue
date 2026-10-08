<template>
  <v-footer :data-testid="props.dataTestid" class="justify-center text-center" app>
    {{ props.description }}
  </v-footer>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { type FooterProps } from "@/components/footer/types.ts";
import { VFooter } from "vuetify/components";

const props = defineProps<FooterProps>();
</script>
