<template>
  <v-text-field
    v-model="modelValue"
    :variant="vuetifyVariant"
    :type="vuetifyType"
    :append-inner-icon="appendIcon"
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
import { useTextFieldRules, useTextFieldType } from "@/composables/inputs/text-field.ts";
import { useTextFieldVariant } from "@/composables/inputs/fields.ts";
import { VTextField } from "vuetify/components";
import FieldLoader from "@/components/inputs/field-loader.vue";
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
const appendIcon = computed(() => (isSearchField.value ? "mdi-magnify" : undefined));

function clear() {
  modelValue.value = "";
}
</script>
