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
 *
 * @example
 * ```vue
 * <btn variant="primary" color="danger" @click="onClick">
 *   Confirmar
 * </btn>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/btn | Guia do Btn}
 */
</script>

<script setup lang="ts">
import { computed } from "vue";
import { VBtn } from "vuetify/components";
import type { BtnProps, BtnEmits } from "@/components/btn/types.ts";
import { btnVariantToVuetifyVariant, btnColorToVuetifyColor } from "@/components/btn/consts.ts";

defineOptions({
  inheritAttrs: false,
});

const {
  variant = "primary",
  color = "primary",
  disabled = false,
  loading = false,
} = defineProps<BtnProps>();

const emit = defineEmits<BtnEmits>();

const vuetifyVariant = computed(() => btnVariantToVuetifyVariant[variant]);
const vuetifyColor = computed(() => btnColorToVuetifyColor[color]);
</script>
