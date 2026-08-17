<template>
  <v-btn
    :variant="vuetifyVariant"
    :color="vuetifyColor"
    :disabled="disabled"
    :loading="loading"
    @click="$emit('click', $event)"
  >
    <template #default>
      <slot name="default" />
    </template>
  </v-btn>
</template>

<script lang="ts">
 /**
 * Button component to be used throughout the application.
 */
</script>

<script setup lang="ts">
import { computed } from "vue";
import { VBtn } from "vuetify/components";
import type { ButtonProps, ButtonEmits } from "@/components/btn/types.ts";
import { btnVariantToVuetifyVariant, btnColorToVuetifyColor } from "@/components/btn/types.ts";

defineOptions({
  inheritAttrs: false,
});

const {
  variant = "primary",
  color = "primary",
  disabled = false,
  loading = false,
} = defineProps<ButtonProps>();

const emit = defineEmits<ButtonEmits>();

const vuetifyVariant = computed(() => btnVariantToVuetifyVariant[variant]);
const vuetifyColor = computed(() => btnColorToVuetifyColor[color]);
</script>
