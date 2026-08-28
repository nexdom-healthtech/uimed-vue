<template>
  <v-btn
    :variant="vuetifyVariant"
    :color="vuetifyColor"
    :disabled="props.disabled"
    :loading="props.loading"
    :data-testid="props.dataTestid"
    @click="onClick"
  >
    <slot name="default" />
  </v-btn>
</template>

<script lang="ts">
/**
 * Button component to be used throughout the application.
 *
 * @example
 * ```vue
 * <btn color="danger" @click="onClick">
 *   Confirmar
 * </btn>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/btn | Btn Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { VBtn } from "vuetify/components";
import type { BtnProps, BtnEmits } from "@/components/btn/types.ts";
import { useBtnColor, useBtnVariant } from "@/components/btn/composables.ts";

const props = defineProps<BtnProps>();
const emit = defineEmits<BtnEmits>();

const vuetifyVariant = useBtnVariant(() => props.variant);
const vuetifyColor = useBtnColor(() => props.color);

function onClick(event: MouseEvent) {
  emit("click", event);
}
</script>
