<template>
  <v-text-field
    :model-value="displayValue"
    :validation-value="modelValue"
    :variant="vuetifyVariant"
    :rules
    :data-testid="props.dataTestid"
    :disabled="props.disabled"
    :loading="props.loading"
    :aria-busy="props.loading || undefined"
    :readonly="props.readonly"
    :label="props.label"
    :placeholder
    :hint="props.hint"
    :clearable="props.clearable"
    type="text"
    inputmode="numeric"
    @update:model-value="keepFieldControlled"
    @input="onInput"
    @compositionend="onCompositionEnd"
    @click:clear="clear"
  >
    <template #loader="loader">
      <field-loader v-bind="loader" />
    </template>
  </v-text-field>
</template>

<script lang="ts">
/**
 * Text field that masks the value while the user types, such as CPF, CNPJ,
 * CEP, phone or a custom mask. Its value holds only the digits, without the
 * mask's literals.
 *
 * @example
 * ```vue
 * <template>
 *  <u-mask-field v-model="cpf" label="CPF" mask="cpf" />
 *  <u-mask-field v-model="protocol" label="Protocolo" mask="####-##/####" />
 * </template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/mask-field | MaskField Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import type { MaskFieldProps } from "@/components/inputs/mask-field/types.ts";
import { useMaskField } from "@/composables/inputs/mask-field.ts";
import { useTextFieldVariant } from "@/composables/inputs/fields.ts";
import { VTextField } from "vuetify/components";
import FieldLoader from "@/components/inputs/field-loader.vue";

const modelValue = defineModel<string>({ default: "" });
const props = withDefaults(defineProps<MaskFieldProps>(), {
  variant: "primary",
});

const vuetifyVariant = useTextFieldVariant(() => props.variant);
const { displayValue, placeholder, rules, onInput, onCompositionEnd } = useMaskField(
  props,
  modelValue,
);

function keepFieldControlled() {
  // Vuetify only uses `model-value` as the source of the text when there's an update listener;
  // without it, it keeps and re-renders the raw text the user typed
}

function clear() {
  modelValue.value = "";
}
</script>
