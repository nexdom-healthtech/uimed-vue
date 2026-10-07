import type {
  DateTimeFieldProps,
  DateTimeFieldType,
} from "@/components/inputs/date-time-field/types.ts";
import { useRules } from "@/composables/inputs/fields.ts";
import type { Rule } from "@/composables/inputs/types.ts";
import { computed, toValue, useId, type ComputedRef, type MaybeRefOrGetter, type Ref } from "vue";

type BoundProps = Required<Pick<DateTimeFieldProps, "type">> &
  Pick<DateTimeFieldProps, "min" | "max">;

type PickerBounds = {
  dateMin: string;
  dateMax: string;
  timeMin: string;
  timeMax: string;
};

type DateTimeFieldMenu = {
  /** Id of the field's input, which activates the menu. */
  inputId: string;
  /** Selector of the menu's activator, or nothing while the menu can't open. */
  activator: ComputedRef<string | undefined>;
  /** Attributes of the input, describing it as a control that opens a dialog. */
  activatorProps: Record<string, string | undefined>;
  /** Attributes of the menu's content, describing it as a dialog named by the field's label. */
  contentProps: ComputedRef<Record<string, string | undefined>>;
  /** Opens the menu, unless it can't open. */
  open: () => void;
};

/**
 * The menu's content is a dialog with the pickers. `aria-owns` is removed since the input can't
 * own the content, and the menu still adds `aria-expanded` and `aria-controls`.
 */
const activatorProps = {
  role: "combobox",
  "aria-haspopup": "dialog",
  "aria-owns": undefined,
};

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

export function useDateTimeFieldRules(
  props: Required<Pick<DateTimeFieldProps, "required">> & BoundProps,
): ComputedRef<Array<Rule>> {
  const defaultRules = useRules(props);

  return computed(() => {
    const rules = [...defaultRules.value];

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
 * Makes the field's input the activator of the pickers' menu, so the menu's attributes are on an
 * element whose role accepts them.
 * @param isOpen - Whether the menu is open.
 * @param isDisabled - Whether the menu can't open, as when the field is disabled or readonly.
 * @param hasLabel - Whether the field has a label, which names the menu's dialog.
 */
export function useDateTimeFieldMenu(
  isOpen: Ref<boolean>,
  isDisabled: MaybeRefOrGetter<boolean>,
  hasLabel: MaybeRefOrGetter<boolean>,
): DateTimeFieldMenu {
  const inputId = `date-time-field-${useId()}`;

  const activator = computed(() => (toValue(isDisabled) ? undefined : `#${inputId}`));
  const contentProps = computed(() => ({
    role: "dialog",
    "aria-labelledby": toValue(hasLabel) ? `${inputId}-label` : undefined,
  }));

  function open() {
    if (!toValue(isDisabled)) isOpen.value = true;
  }

  return { inputId, activator, activatorProps, contentProps, open };
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
