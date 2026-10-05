<template>
  <v-btn
    :disabled="isDisabled"
    :loading="props.loading"
    :data-testid="props.dataTestid"
    :variant
    :color
    :type
    :form
    :class="widthClass"
    @click="onClick"
  >
    <slot />
    <template #loader>
      <v-progress-circular indeterminate width="2" aria-hidden="true" />
    </template>
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
import { VBtn, VProgressCircular } from "vuetify/components";
import type { ButtonProps, ButtonEmits } from "@/components/button/types.ts";
import { useButtonForm, useButtonType, useButtonVariant } from "@/composables/button/button.ts";
import useVuetifyColor from "@/composables/colors/use-vuetify-color.ts";
import { useFullWidth } from "@/composables/dimensions/dimensions.ts";

const props = defineProps<ButtonProps>();
const emit = defineEmits<ButtonEmits>();

const variant = useButtonVariant(() => props.variant);
const color = useVuetifyColor(() => props.color);
const type = useButtonType(() => props.type);
const form = useButtonForm(() => props.form);
const widthClass = useFullWidth(() => props.fullWidth);
// Disabling the button while loading keeps it from being clicked and from submitting its form,
// including through the implicit submission of pressing `Enter` in one of the form's fields
const isDisabled = computed(() => props.disabled || props.loading);

function onClick(event: MouseEvent) {
  emit("click", event);
}
</script>
