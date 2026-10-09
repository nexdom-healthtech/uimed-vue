<template>
  <v-text-field
    v-model="modelValue"
    :variant="vuetifyVariant"
    :type="vuetifyType"
    :rules
    :data-testid="props.dataTestid"
    :disabled="props.disabled"
    :loading="props.loading"
    :aria-busy="props.loading || undefined"
    :readonly="props.readonly"
    :label="props.label"
    :placeholder="props.placeholder"
    :hint="props.hint"
    :clearable="computedClearable"
    @click:clear="clear"
  >
    <template #loader="loader">
      <field-loader v-bind="loader" />
    </template>
    <template v-if="appendIconProps" #append-inner>
      <v-icon v-bind="appendIconProps" :disabled="props.disabled" />
    </template>
  </v-text-field>
</template>

<script lang="ts">
/**
 * Text field component to be used throughout the application.
 *
 * @example
 * ```vue
 * <template>
 *  <u-text-field label="E-mail" type="email" />
 * <template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/text-field | TextField Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import type { TextFieldProps } from "@/components/inputs/text-field/types.ts";
import {
  useTextFieldAppendIcon,
  useTextFieldRules,
  useTextFieldType,
} from "@/composables/inputs/text-field.ts";
import { useTextFieldVariant } from "@/composables/inputs/fields.ts";
import { VIcon, VTextField } from "vuetify/components";
import FieldLoader from "@/components/inputs/field-loader.vue";
import { computed } from "vue";

const modelValue = defineModel<string>({ default: "" });
const props = withDefaults(defineProps<TextFieldProps>(), {
  clearable: undefined,
  type: "text",
  variant: "primary",
});

const vuetifyVariant = useTextFieldVariant(() => props.variant);
const { isPasswordVisible, iconProps: appendIconProps } = useTextFieldAppendIcon(
  () => props.type,
  () => props.disabled,
);
const vuetifyType = useTextFieldType(() => props.type, isPasswordVisible);
const rules = useTextFieldRules(props);
const computedClearable = computed(() => props.clearable ?? props.type === "search");

function clear() {
  modelValue.value = "";
}
</script>
