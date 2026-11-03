import type {
  DateTimeFieldProps,
  DateTimeFieldType,
} from "@/components/inputs/date-time-field/types.ts";
import type { MaskFieldMask } from "@/components/inputs/mask-field/types.ts";
import { useRules } from "@/composables/inputs/fields.ts";
import { getMaskTokens, useMaskField } from "@/composables/inputs/mask-field.ts";
import type { Rule } from "@/composables/inputs/types.ts";
import { icons } from "@/consts/icons.ts";
import {
  computed,
  ref,
  toValue,
  useId,
  watch,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";

type BoundProps = Required<Pick<DateTimeFieldProps, "type">> &
  Pick<DateTimeFieldProps, "min" | "max">;

type PickerBounds = {
  dateMin: string;
  dateMax: string;
  timeMin: string;
  timeMax: string;
};

type DateTimeFieldMenu = {
  /** Id of the field's input. */
  inputId: string;
  /** Selector of the input, the element the menu is positioned below. */
  target: string;
  /** Attributes of the icon that opens the menu, named after what its pickers pick. */
  iconProps: ComputedRef<{ icon: string; "aria-label": string; "aria-haspopup": "dialog" }>;
  /** Attributes of the menu's content, describing it as a dialog named by the field's label. */
  contentProps: ComputedRef<Record<string, string | undefined>>;
  /** Opens the menu with `Enter` or space on the icon, which only responds to clicks otherwise. */
  onKeydown: (event: KeyboardEvent) => void;
};

type DateTimeFieldInput = {
  /** The typed value, masked (e.g. `24/09/2026`). */
  displayValue: ComputedRef<string>;
  /** The given placeholder, or the mask with `0` in place of each digit (e.g. `00/00/0000`). */
  placeholder: ComputedRef<string>;
  /** Value the rules validate: the `v-model`, or the typed digits while they aren't a value. */
  validationValue: ComputedRef<string>;
  /** Fails while the typed digits are incomplete or aren't an existing date or time. */
  rule: Rule;
  onInput: (event: InputEvent) => void;
  onCompositionEnd: (event: CompositionEvent) => void;
  /** Empties the value and the typed digits. */
  clear: () => void;
};

/** Masks of the typed value of each type, where `#` is a digit. */
export const dateTimeFieldMasks: Record<DateTimeFieldType, MaskFieldMask> = {
  date: "##/##/####",
  time: "##:##",
  datetime: "##/##/#### ##:##",
};

/** Names of the icon that opens the pickers of each type, after what they pick. */
const pickerLabels: Record<DateTimeFieldType, string> = {
  date: "Selecionar data",
  time: "Selecionar horário",
  datetime: "Selecionar data e horário",
};

/** Days of each month, from January, in a year that isn't a leap year. */
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Extracts the date part (`YYYY-MM-DD`) of a value, or an empty string when
 * the type has no date.
 */
export function getDatePart(value: string, type: DateTimeFieldType): string {
  return type === "time" ? "" : value.split("T")[0];
}

/**
 * Extracts the time part (`HH:mm`) of a value, or an empty string when the
 * value has no time.
 */
export function getTimePart(value: string, type: DateTimeFieldType): string {
  if (type === "time") return value;

  const [, time = ""] = value.split("T");
  return time;
}

/**
 * Builds a value for the given type, or an empty string while any required
 * part is missing.
 */
export function joinDateTime(type: DateTimeFieldType, date: string, time: string): string {
  if (type === "date") return date;
  if (type === "time") return time;

  return date && time ? `${date}T${time}` : "";
}

/**
 * Formats a value to be displayed in pt-BR, like `24/09/2026`, `14:30` or
 * `24/09/2026 14:30`.
 */
export function formatDateTime(value: string, type: DateTimeFieldType): string {
  const date = getDatePart(value, type).split("-").reverse().join("/");
  const time = getTimePart(value, type);

  return [date, time].filter(Boolean).join(" ");
}

/**
 * Returns the digits of a value as the field displays it (e.g. `24092026` for
 * `2026-09-24`).
 */
export function toDigits(value: string, type: DateTimeFieldType): string {
  return formatDateTime(value, type).replaceAll(/\D/g, "");
}

/**
 * Returns the value of the digits typed in the field (e.g. `2026-09-24` for
 * `24092026`), or an empty string while they're incomplete or aren't an
 * existing date or time (e.g. `31/02/2026` or `25:00`).
 */
export function parseDigits(digits: string, type: DateTimeFieldType): string {
  if (type === "time") return parseTime(digits);

  return joinDateTime(type, parseDate(digits.slice(0, 8)), parseTime(digits.slice(8)));
}

/**
 * @param inputRule - Rule of the typed value, checked after `required` and before the limits.
 */
export function useDateTimeFieldRules(
  props: Required<Pick<DateTimeFieldProps, "required">> & BoundProps,
  inputRule: Rule,
): ComputedRef<Array<Rule>> {
  const defaultRules = useRules(props);

  return computed(() => {
    const rules = [...defaultRules.value, inputRule];

    if (props.min) rules.push(minRule(props.min, props.type));
    if (props.max) rules.push(maxRule(props.max, props.type));

    return rules;
  });
}

/**
 * Computes the limits of each picker. For `datetime`, time limits only apply
 * when the selected date is the limit's own date.
 */
export function useDateTimeFieldPickerBounds(
  props: BoundProps,
  selectedDate: MaybeRefOrGetter<string>,
): ComputedRef<PickerBounds> {
  return computed(() => {
    const min = props.min ?? "";
    const max = props.max ?? "";
    const date = toValue(selectedDate);

    return {
      dateMin: getDatePart(min, props.type),
      dateMax: getDatePart(max, props.type),
      timeMin: getTimeBound(min, props.type, date),
      timeMax: getTimeBound(max, props.type, date),
    };
  });
}

/**
 * Keeps the typed value masked and in sync with the `v-model`, which only
 * takes a whole, existing date or time: it's emptied while the typed digits
 * are incomplete or invalid, and the rule says why.
 */
export function useDateTimeFieldInput(
  props: Required<Pick<DateTimeFieldProps, "type">> & Pick<DateTimeFieldProps, "placeholder">,
  model: Ref<string>,
): DateTimeFieldInput {
  const digits = ref(toDigits(model.value, props.type));
  const typedValue = computed(() => parseDigits(digits.value, props.type));
  const mask = useMaskField(
    {
      get mask() {
        return dateTimeFieldMasks[props.type];
      },
      get placeholder() {
        return props.placeholder;
      },
    },
    digits,
  );

  // A value from the pickers or from the app replaces the typed one, unless it's the typed one
  watch(
    () => model.value,
    () => {
      if (model.value !== typedValue.value) digits.value = toDigits(model.value, props.type);
    },
  );

  const validationValue = computed(() => model.value || digits.value);

  const rule: Rule = () => {
    if (!digits.value || typedValue.value) return true;

    const isComplete = digits.value.length === getMaskTokens(dateTimeFieldMasks[props.type]).length;
    return isComplete ? "Valor inválido" : "Valor incompleto";
  };

  function emitTypedValue() {
    if (typedValue.value !== model.value) model.value = typedValue.value;
  }

  function onInput(event: InputEvent) {
    mask.onInput(event);
    emitTypedValue();
  }

  function onCompositionEnd(event: CompositionEvent) {
    mask.onCompositionEnd(event);
    emitTypedValue();
  }

  function clear() {
    digits.value = "";
    model.value = "";
  }

  return {
    displayValue: mask.displayValue,
    placeholder: mask.placeholder,
    validationValue,
    rule,
    onInput,
    onCompositionEnd,
    clear,
  };
}

/**
 * Makes an icon inside the field the activator of the pickers' menu, positioned below the input,
 * so the input stays a plain field the user types in.
 * @param isOpen - Whether the menu is open.
 * @param type - The field's type, which names the icon and sets its drawing.
 * @param hasLabel - Whether the field has a label, which names the menu's dialog.
 */
export function useDateTimeFieldMenu(
  isOpen: Ref<boolean>,
  type: MaybeRefOrGetter<DateTimeFieldType>,
  hasLabel: MaybeRefOrGetter<boolean>,
): DateTimeFieldMenu {
  const inputId = useId();

  const iconProps = computed(() => ({
    icon: toValue(type) === "time" ? icons.clock : icons.calendar,
    "aria-label": pickerLabels[toValue(type)],
    // The menu's content is a dialog with the pickers, not a menu
    "aria-haspopup": "dialog" as const,
  }));
  const contentProps = computed(() => ({
    role: "dialog",
    "aria-labelledby": toValue(hasLabel) ? `${inputId}-label` : undefined,
  }));

  function onKeydown(event: KeyboardEvent) {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    event.stopPropagation();
    isOpen.value = true;
  }

  return { inputId, target: `#${inputId}`, iconProps, contentProps, onKeydown };
}

function parseDate(digits: string): string {
  if (digits.length < 8) return "";

  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4));
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const lastDay = month === 2 && isLeapYear ? 29 : daysInMonth[month - 1];

  if (year < 1 || !lastDay || day < 1 || day > lastDay) return "";

  return `${digits.slice(4)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`;
}

function parseTime(digits: string): string {
  if (digits.length < 4) return "";

  const hours = Number(digits.slice(0, 2));
  const minutes = Number(digits.slice(2));

  return hours < 24 && minutes < 60 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : "";
}

function getTimeBound(bound: string, type: DateTimeFieldType, selectedDate: string): string {
  if (type === "datetime" && getDatePart(bound, type) !== selectedDate) return "";

  return getTimePart(bound, type);
}

function minRule(min: string, type: DateTimeFieldType): Rule {
  const message = `Valor anterior ao mínimo permitido (${formatDateTime(min, type)})`;
  return (value) => !value || value >= min || message;
}

function maxRule(max: string, type: DateTimeFieldType): Rule {
  const message = `Valor posterior ao máximo permitido (${formatDateTime(max, type)})`;
  return (value) => !value || value <= max || message;
}
