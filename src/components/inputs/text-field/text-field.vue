<template>
  <v-text-field
    v-model="modelValue"
    :variant="vuetifyVariant"
    :type="vuetifyType"
    :prepend-inner-icon="prependIcon"
    :rules
    :data-testid="props.dataTestid"
    :disabled="props.disabled"
    :loading="props.loading"
    :readonly="props.readonly"
    :label="props.label"
    :placeholder="props.placeholder"
    :hint="props.hint"
    :clearable="computedClearable"
    @click:clear="clear"
  />
</template>

<script lang="ts">
/**
 * Text field component to be used throughout the application.
 *
 * @example
 * ```vue
 * <text-field label="E-mail" type="email" />
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
  useTextFieldRules,
  useTextFieldType,
  useTextFieldVariant,
} from "@/composables/inputs/text-field.ts";
import { VTextField } from "vuetify/components";
import { computed } from "vue";

const modelValue = defineModel<string>({ default: "" });
const props = withDefaults(defineProps<TextFieldProps>(), {
  clearable: undefined,
  type: "text",
  variant: "primary",
});

const vuetifyVariant = useTextFieldVariant(() => props.variant);
const vuetifyType = useTextFieldType(() => props.type);
const rules = useTextFieldRules(props);
const isSearchField = computed(() => props.type === "search");
const computedClearable = computed(() => props.clearable ?? isSearchField.value);
const prependIcon = computed(() => (isSearchField.value ? "mdi-magnify" : undefined));

function clear() {
  modelValue.value = "";
}
</script>
