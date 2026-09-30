<template>
  <v-btn
    :disabled="props.disabled"
    :loading="props.loading"
    :aria-disabled="ariaDisabled"
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
 * <template>
 *  <u-button color="danger" @click="onClick">
 *     Confirmar
 *  </u-button>
 * </template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/button | Button Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
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
// Only set while loading, which `Form` relies on to ignore submits
const ariaDisabled = computed(() => props.loading || undefined);

function onClick(event: MouseEvent) {
  // Canceling the click keeps the browser from submitting the button's form, including through
  // the click it fires on the form's submit button when `Enter` is pressed in one of its fields
  if (props.loading) event.preventDefault();
  else emit("click", event);
}
</script>
