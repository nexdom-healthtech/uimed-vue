<template>
  <component
    :is="vuetifyComponent"
    v-model="modelValue"
    :variant="vuetifyVariant"
    :items="normalizedItems"
    :data-testid="props.dataTestid"
    :disabled="props.disabled"
    :loading="props.loading"
    :readonly="props.readonly"
    :label="props.label"
    :placeholder="props.placeholder"
    :hint="props.hint"
    :clearable="props.clearable"
    :multiple="isMultiple"
    item-title="label"
    :rules
    chips
  />
</template>

<script lang="ts">
/**
 * Select field component to be used throughout the application.
 *
 * @example
 * ```vue
 * <template>
 *  <u-autocomplete-field label="Country" :items="['Brazil', 'Argentina']" />
 * </template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/autocomplete-field | AutocompleteField Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts" generic="T = string, Multiple extends boolean = false">
import type {
  AutocompleteFieldProps,
  NormalizedItem,
} from "@/components/inputs/autocomplete-field/types.ts";
import { useAutocompleteRules } from "@/composables/inputs/autocomplete-field.ts";
import { useTextFieldVariant } from "@/composables/inputs/fields.ts";
import { VAutocomplete, VCombobox } from "vuetify/components";
import { computed } from "vue";

const modelValue = defineModel<Multiple extends true ? T[] : T>();
const props = withDefaults(defineProps<AutocompleteFieldProps<T, Multiple>>(), {
  variant: "primary",
  items: () => [],
});

const vuetifyVariant = useTextFieldVariant(() => props.variant);
const isMultiple = computed(() => props.multiple ?? false);
const rules = useAutocompleteRules(() => ({
  required: props.required,
  multiple: isMultiple.value,
}));

const vuetifyComponent = computed(() => (props.strict ? VAutocomplete : VCombobox));

const normalizedItems = computed<NormalizedItem<T>[]>(() => {
  return props.items.map((item) => {
    if (typeof item === "string") {
      return { label: item, value: item as T };
    }

    return item;
  });
});
</script>
