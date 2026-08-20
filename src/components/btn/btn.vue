<template>
  <v-btn
    :variant="vuetifyVariant"
    :color="vuetifyColor"
    :disabled="props.disabled"
    :loading="props.loading"
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
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { VBtn } from "vuetify/components";
import type { BtnProps, BtnEmits } from "@/components/btn/types.ts";
import { resolveBtnColor, resolveBtnVariant } from "@/components/btn/consts.ts";

const props = defineProps<BtnProps>();
const emit = defineEmits<BtnEmits>();

const vuetifyVariant = computed(() => resolveBtnVariant(props.variant));
const vuetifyColor = computed(() => resolveBtnColor(props.color));
</script>
