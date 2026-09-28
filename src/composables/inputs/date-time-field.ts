import type {
  DateTimeFieldProps,
  DateTimeFieldType,
} from "@/components/inputs/date-time-field/types.ts";
import type { Rule } from "@/composables/inputs/types.ts";
import useRules from "@/composables/inputs/use-rules.ts";
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";

type BoundProps = Required<Pick<DateTimeFieldProps, "type">> &
  Pick<DateTimeFieldProps, "min" | "max">;

type PickerBounds = {
  dateMin: string;
  dateMax: string;
  timeMin: string;
  timeMax: string;
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
 * Converts a date to `YYYY-MM-DD` using its local components, so there's no
 * timezone shift.
 */
export function toIsoDate(date: Date): string {
  const month = padTwoDigits(date.getMonth() + 1);
  const day = padTwoDigits(date.getDate());

  return `${date.getFullYear()}-${month}-${day}`;
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

function padTwoDigits(value: number): string {
  return String(value).padStart(2, "0");
}
