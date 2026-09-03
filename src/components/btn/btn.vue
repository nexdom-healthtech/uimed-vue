020
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
import { useBtnForm, useBtnType, useBtnVariant } from "@/composables/btn.ts";
import useVuetifyColor from "@/composables/colors/use-vuetify-color.ts";

const props = defineProps<BtnProps>();
const emit = defineEmits<BtnEmits>();

const variant = useBtnVariant(() => props.variant);
const color = useVuetifyColor(() => props.color);
const type = useBtnType(() => props.type);
const form = useBtnForm(() => props.form);

function onClick(event: MouseEvent) {
  emit("click", event);
}
</script>
