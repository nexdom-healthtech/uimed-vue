<template>
  <v-checkbox-btn
    v-model="modelValue"
    :true-value="props.trueValue"
    :false-value="props.falseValue"
    :data-testid="props.dataTestid"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :label="props.label"
    class="flex-0-1"
    hide-details
  />
</template>

<script lang="ts">
/**
 * Checkbox component to be used throughout the application.
 *
 * @example
 * ```vue
 * <template>
 *  <u-checkbox label="Aceito os termos" />
 * </template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/checkbox | Checkbox Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts" generic="T = any">
import type { CheckboxProps } from "@/components/inputs/checkbox/types.ts";
import { VCheckboxBtn } from "vuetify/components";

const props = withDefaults(defineProps<CheckboxProps<T | boolean>>(), {
  trueValue: true,
  falseValue: false,
});
const modelValue = defineModel<T>({ default: (props: CheckboxProps<T>) => props.falseValue! });
</script>
