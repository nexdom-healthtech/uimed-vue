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
    :label="props.label"
    :placeholder="props.placeholder"
    :hint="props.hint"
    :clearable="isClearable"
    readonly
    @click:clear="clear"
  >
    <v-menu
      v-model="isMenuOpen"
      activator="parent"
      location="bottom start"
      min-width="0"
      :disabled="isMenuDisabled"
      :close-on-content-click="false"
    >
      <v-card>
        <v-locale-provider locale="pt-BR" :messages class="d-flex flex-wrap">
          <v-date-picker
            v-if="props.type !== 'time'"
            :model-value="draftDate || null"
            :min="bounds.dateMin"
            :max="bounds.dateMax"
            @update:model-value="onDateUpdate"
          />
          <v-time-picker
            v-if="props.type !== 'date'"
            :model-value="draftTime"
            :min="bounds.timeMin"
            :max="bounds.timeMax"
            format="24hr"
            @update:model-value="onTimeUpdate"
            @update:minute="closeIfComplete"
          />
        </v-locale-provider>
      </v-card>
    </v-menu>
    <template #loader="loader">
      <field-loader v-bind="loader" />
    </template>
  </v-text-field>
</template>

<script lang="ts">
/**
 * Date and/or time field component to be used throughout the application.
 *
 * Its value uses the native input formats: `YYYY-MM-DD` for `date`, `HH:mm`
 * for `time` and `YYYY-MM-DDTHH:mm` for `datetime`.
 *
 * @example
 * ```vue
 * <template>
 *  <u-date-time-field v-model="birthDate" label="Data de nascimento" type="date" />
 * <template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/date-time-field | DateTimeField Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import type { DateTimeFieldProps } from "@/components/inputs/date-time-field/types.ts";
import {
  formatDateTime,
  getDatePart,
  getTimePart,
  joinDateTime,
  useDateTimeFieldPickerBounds,
  useDateTimeFieldRules,
} from "@/composables/inputs/date-time-field.ts";
import { formatDateTime as formatDate } from "@nexdom/shared/utils";
import {
  VCard,
  VDatePicker,
  VLocaleProvider,
  VMenu,
  VTextField,
  VTimePicker,
} from "vuetify/components";
import FieldLoader from "@/components/inputs/field-loader.vue";
import { pt } from "vuetify/locale";
import { computed, ref, watch } from "vue";
import { useTextFieldVariant } from "@/composables/inputs/fields.ts";

const modelValue = defineModel<string>({ default: "" });
const props = withDefaults(defineProps<DateTimeFieldProps>(), {
  type: "datetime",
  variant: "primary",
});

const messages = { "pt-BR": pt };

const vuetifyVariant = useTextFieldVariant(() => props.variant);
const rules = useDateTimeFieldRules(props);
const displayValue = computed(() => formatDateTime(modelValue.value, props.type));
const isClearable = computed(() => props.clearable && !props.readonly);
const isMenuDisabled = computed(() => props.disabled || props.readonly);

const isMenuOpen = ref(false);
// Parts picked while the menu is open. Missing parts fall back to the current value.
const draft = ref<{ date?: string; time?: string }>({});
const draftDate = computed(() => draft.value.date ?? getDatePart(modelValue.value, props.type));
const draftTime = computed(() => draft.value.time ?? getTimePart(modelValue.value, props.type));
const draftValue = computed(() => joinDateTime(props.type, draftDate.value, draftTime.value));
const bounds = useDateTimeFieldPickerBounds(props, draftDate);

watch(isMenuOpen, () => {
  draft.value = {};
});

function onDateUpdate(date: unknown) {
  draft.value.date = formatDate(date as Date, "YYYY-MM-DD");
  commitDraft();
  closeIfComplete();
}

function onTimeUpdate(time: string | null) {
  draft.value.time = time ?? "";
  commitDraft();
}

function commitDraft() {
  if (draftValue.value) modelValue.value = draftValue.value;
}

function closeIfComplete() {
  if (draftValue.value) isMenuOpen.value = false;
}

function clear() {
  modelValue.value = "";
}
</script>
