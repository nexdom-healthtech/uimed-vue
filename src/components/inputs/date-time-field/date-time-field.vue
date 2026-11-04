<template>
  <v-text-field
    :id="inputId"
    ref="textField"
    :model-value="displayValue"
    :validation-value="validationValue"
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
    :clearable="isClearable"
    type="text"
    inputmode="numeric"
    @update:model-value="keepFieldControlled"
    @input="onInput"
    @compositionend="onCompositionEnd"
    @click:clear="clear"
    @update:focused="onFocusChange"
  >
    <template #append-inner>
      <v-menu
        ref="menu"
        v-model="isMenuOpen"
        :target="fieldElement"
        :content-props
        location="bottom start"
        min-width="0"
        :disabled="isMenuDisabled"
        :close-on-content-click="false"
      >
        <!-- A click on the icon also focuses the input, which opens the menu: the icon only opens
        it, without toggling it closed -->
        <template #activator="{ props: activatorProps }">
          <v-icon
            v-bind="{ ...activatorProps, ...iconProps, onClick: open }"
            :disabled="isMenuDisabled"
            @keydown="onKeydown"
            @blur="onFocusChange(false)"
          />
        </template>
        <v-card>
          <v-locale-provider locale="pt-BR" :messages class="d-flex flex-wrap">
            <v-date-picker
              v-if="props.type !== 'time'"
              :model-value="draftDate || null"
              :min="bounds.dateMin"
              :max="bounds.dateMax"
              hide-header
              @update:model-value="onDateUpdate"
            />
            <v-time-picker
              v-if="props.type !== 'date'"
              :model-value="draftTime"
              :min="bounds.timeMin"
              :max="bounds.timeMax"
              format="24hr"
              hide-title
              @update:model-value="onTimeUpdate"
              @update:minute="closeIfComplete"
            />
          </v-locale-provider>
        </v-card>
      </v-menu>
    </template>
    <template #loader="loader">
      <field-loader v-bind="loader" />
    </template>
  </v-text-field>
</template>

<script lang="ts">
/**
 * Date and/or time field component to be used throughout the application. The
 * user types the value, masked as it's displayed, or picks it in the pickers
 * shown below the field while it has the focus, or opened by the icon inside it.
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
  getDatePart,
  getTimePart,
  joinDateTime,
  useDateTimeFieldInput,
  useDateTimeFieldMenu,
  useDateTimeFieldPickerBounds,
  useDateTimeFieldRules,
} from "@/composables/inputs/date-time-field.ts";
import { formatDateTime as formatDate } from "@nexdom/shared/utils";
import {
  VCard,
  VDatePicker,
  VIcon,
  VLocaleProvider,
  VMenu,
  VTextField,
  VTimePicker,
} from "vuetify/components";
import FieldLoader from "@/components/inputs/field-loader.vue";
import { pt } from "vuetify/locale";
import { computed, ref, useTemplateRef, watch } from "vue";
import { useTextFieldVariant } from "@/composables/inputs/fields.ts";

const modelValue = defineModel<string>({ default: "" });
const props = withDefaults(defineProps<DateTimeFieldProps>(), {
  type: "datetime",
  variant: "primary",
});

const messages = { "pt-BR": pt };

const vuetifyVariant = useTextFieldVariant(() => props.variant);
const {
  displayValue,
  placeholder,
  validationValue,
  rule: inputRule,
  onInput,
  onCompositionEnd,
  clear,
} = useDateTimeFieldInput(props, modelValue);
const rules = useDateTimeFieldRules(props, inputRule);
const isClearable = computed(() => props.clearable && !props.readonly);
const isMenuDisabled = computed(() => props.disabled || props.readonly);
const textField = useTemplateRef<InstanceType<typeof VTextField>>("textField");
const menu = useTemplateRef<InstanceType<typeof VMenu>>("menu");
// The whole field, with its messages, so the menu doesn't cover them
const fieldElement = computed<HTMLElement | undefined>(() => textField.value?.$el);

const isMenuOpen = ref(false);
// Parts picked while the menu is open. Missing parts fall back to the current value.
const draft = ref<{ date?: string; time?: string }>({});
const draftDate = computed(() => draft.value.date ?? getDatePart(modelValue.value, props.type));
const draftTime = computed(() => draft.value.time ?? getTimePart(modelValue.value, props.type));
const draftValue = computed(() => joinDateTime(props.type, draftDate.value, draftTime.value));
const bounds = useDateTimeFieldPickerBounds(props, draftDate);
const { inputId, iconProps, contentProps, open, onKeydown, onFocusChange } = useDateTimeFieldMenu(
  isMenuOpen,
  () => props.type,
  () => !!props.label,
  isMenuDisabled,
  () => [fieldElement.value, menu.value?.contentEl],
);

watch(isMenuOpen, () => {
  draft.value = {};
});

function keepFieldControlled() {
  // Vuetify only uses `model-value` as the source of the text when there's an update listener;
  // without it, it keeps and re-renders the raw text the user typed
}

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
</script>
