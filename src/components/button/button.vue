<template>
  <v-btn
    :disabled="props.disabled"
    :loading="props.loading"
    :data-testid="props.dataTestid"
    :variant
    :color
    :type
    :form
    @click="onClick"
  >
    <slot />
  </v-btn>
</template>

<script lang="ts">
/**
 * Button component to be used throughout the application.
 *
 * @example
 * ```vue
 * <u-button color="danger" @click="onClick">
 *   Confirmar
 * </u-button>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/button | Button Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { VBtn } from "vuetify/components";
import type { ButtonProps, ButtonEmits } from "@/components/button/types.ts";
import { useButtonForm, useButtonType, useButtonVariant } from "@/composables/button/button.ts";
import useVuetifyColor from "@/composables/colors/use-vuetify-color.ts";

const props = defineProps<ButtonProps>();
const emit = defineEmits<ButtonEmits>();

const variant = useButtonVariant(() => props.variant);
const color = useVuetifyColor(() => props.color);
const type = useButtonType(() => props.type);
const form = useButtonForm(() => props.form);

function onClick(event: MouseEvent) {
  emit("click", event);
}
</script>
