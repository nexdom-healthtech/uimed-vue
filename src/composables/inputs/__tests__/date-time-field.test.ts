import type { DateTimeFieldType } from "@/components/inputs/date-time-field/types.ts";
import {
  formatDateTime,
  getDatePart,
  getTimePart,
  joinDateTime,
  toIsoDate,
  useDateTimeFieldPickerBounds,
  useDateTimeFieldRules,
} from "@/composables/inputs/date-time-field.ts";
import { required } from "@/composables/inputs/rules.ts";
import type { Rule } from "@/composables/inputs/types.ts";
import { reactive, ref } from "vue";

type RulesProps = Parameters<typeof useDateTimeFieldRules>[0];
type BoundsProps = Parameters<typeof useDateTimeFieldPickerBounds>[0];

describe("date-time-field", () => {
  describe("getDatePart", () => {
    it.each<[DateTimeFieldType, string, string]>([
      ["date", "2026-09-24", "2026-09-24"],
      ["date", "", ""],
      ["time", "14:30", ""],
      ["datetime", "2026-09-24T14:30", "2026-09-24"],
      ["datetime", "", ""],
    ])('should extract from type "%s" and value "%s" the date "%s"', (type, value, expected) => {
      expect(getDatePart(value, type)).toBe(expected);
    });
  });

  describe("getTimePart", () => {
    it.each<[DateTimeFieldType, string, string]>([
      ["date", "2026-09-24", ""],
      ["time", "14:30", "14:30"],
      ["time", "", ""],
      ["datetime", "2026-09-24T14:30", "14:30"],
      ["datetime", "2026-09-24", ""],
      ["datetime", "", ""],
    ])('should extract from type "%s" and value "%s" the time "%s"', (type, value, expected) => {
      expect(getTimePart(value, type)).toBe(expected);
    });
  });

  describe("joinDateTime", () => {
    it.each<[DateTimeFieldType, string, string, string]>([
      ["date", "2026-09-24", "14:30", "2026-09-24"],
      ["date", "", "14:30", ""],
      ["time", "2026-09-24", "14:30", "14:30"],
      ["time", "2026-09-24", "", ""],
      ["datetime", "2026-09-24", "14:30", "2026-09-24T14:30"],
      ["datetime", "2026-09-24", "", ""],
      ["datetime", "", "14:30", ""],
      ["datetime", "", "", ""],
    ])(
      'should join for type "%s" the date "%s" and time "%s" as "%s"',
      (type, date, time, expected) => {
        expect(joinDateTime(type, date, time)).toBe(expected);
      },
    );
  });

  describe("toIsoDate", () => {
    it("should use local date components, padded to two digits", () => {
      expect(toIsoDate(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
      expect(toIsoDate(new Date(2026, 8, 24, 0, 0))).toBe("2026-09-24");
      expect(toIsoDate(new Date(2026, 11, 31, 23, 59))).toBe("2026-12-31");
    });
  });

  describe("formatDateTime", () => {
    it.each<[DateTimeFieldType, string, string]>([
      ["date", "2026-09-24", "24/09/2026"],
      ["date", "", ""],
      ["time", "14:30", "14:30"],
      ["time", "", ""],
      ["datetime", "2026-09-24T14:30", "24/09/2026 14:30"],
      ["datetime", "", ""],
    ])('should format type "%s" and value "%s" as "%s"', (type, value, expected) => {
      expect(formatDateTime(value, type)).toBe(expected);
    });
  });

  describe("useDateTimeFieldRules", () => {
    it("should have no rules by default", () => {
      const rules = useDateTimeFieldRules(rulesProps());

      expect(rules.value).toHaveLength(0);
    });

    it("should apply the required rule", () => {
      const rules = useDateTimeFieldRules(rulesProps({ required: true }));

      expect(rules.value).toHaveLength(1);
      expect(rules.value).toContain(required);
    });

    it("should validate the minimum value", () => {
      const rules = useDateTimeFieldRules(rulesProps({ type: "date", min: "2026-09-10" }));

      expect(rules.value).toHaveLength(1);

      const [minRule] = rules.value;
      expect(validate(minRule, "2026-09-09")).toBe(
        "Valor anterior ao mínimo permitido (10/09/2026)",
      );
      expect(validate(minRule, "2026-09-10")).toBe(true);
      expect(validate(minRule, "2026-09-11")).toBe(true);
      expect(validate(minRule, "")).toBe(true);
    });

    it("should validate the maximum value", () => {
      const rules = useDateTimeFieldRules(rulesProps({ type: "time", max: "18:00" }));

      expect(rules.value).toHaveLength(1);

      const [maxRule] = rules.value;
      expect(validate(maxRule, "18:01")).toBe("Valor posterior ao máximo permitido (18:00)");
      expect(validate(maxRule, "18:00")).toBe(true);
      expect(validate(maxRule, "17:59")).toBe(true);
      expect(validate(maxRule, "")).toBe(true);
    });

    it("should combine every rule, following props changes", () => {
      const props = rulesProps();
      const rules = useDateTimeFieldRules(props);

      props.required = true;
      props.min = "2026-09-10T08:00";
      props.max = "2026-09-20T18:00";

      expect(rules.value).toHaveLength(3);

      const [requiredRule, minRule, maxRule] = rules.value;
      expect(requiredRule).toBe(required);
      expect(validate(minRule, "2026-09-10T07:59")).toBe(
        "Valor anterior ao mínimo permitido (10/09/2026 08:00)",
      );
      expect(validate(minRule, "2026-09-10T08:00")).toBe(true);
      expect(validate(maxRule, "2026-09-20T18:01")).toBe(
        "Valor posterior ao máximo permitido (20/09/2026 18:00)",
      );
      expect(validate(maxRule, "2026-09-20T18:00")).toBe(true);
    });
  });

  describe("useDateTimeFieldPickerBounds", () => {
    it("should have no bounds by default", () => {
      const bounds = useDateTimeFieldPickerBounds(boundsProps(), "");

      expect(bounds.value).toEqual({ dateMin: "", dateMax: "", timeMin: "", timeMax: "" });
    });

    it("should only apply date bounds for date type", () => {
      const props = boundsProps({ type: "date", min: "2026-09-10", max: "2026-09-20" });
      const bounds = useDateTimeFieldPickerBounds(props, "2026-09-10");

      expect(bounds.value).toEqual({
        dateMin: "2026-09-10",
        dateMax: "2026-09-20",
        timeMin: "",
        timeMax: "",
      });
    });

    it("should only apply time bounds for time type", () => {
      const props = boundsProps({ type: "time", min: "08:00", max: "18:00" });
      const selectedDate = ref("");
      const bounds = useDateTimeFieldPickerBounds(props, selectedDate);

      expect(bounds.value).toEqual({
        dateMin: "",
        dateMax: "",
        timeMin: "08:00",
        timeMax: "18:00",
      });

      selectedDate.value = "2026-09-10";
      expect(bounds.value.timeMin).toBe("08:00");
      expect(bounds.value.timeMax).toBe("18:00");
    });

    it("should apply datetime time bounds only on the bound's own date", () => {
      const props = boundsProps({ min: "2026-09-10T08:00", max: "2026-09-20T18:00" });
      const selectedDate = ref("");
      const bounds = useDateTimeFieldPickerBounds(props, selectedDate);

      expect(bounds.value).toEqual({
        dateMin: "2026-09-10",
        dateMax: "2026-09-20",
        timeMin: "",
        timeMax: "",
      });

      selectedDate.value = "2026-09-10";
      expect(bounds.value.timeMin).toBe("08:00");
      expect(bounds.value.timeMax).toBe("");

      selectedDate.value = "2026-09-15";
      expect(bounds.value.timeMin).toBe("");
      expect(bounds.value.timeMax).toBe("");

      selectedDate.value = "2026-09-20";
      expect(bounds.value.timeMin).toBe("");
      expect(bounds.value.timeMax).toBe("18:00");
    });
  });
});

function rulesProps(props: Partial<RulesProps> = {}): RulesProps {
  return reactive<RulesProps>({ required: false, type: "datetime", ...props });
}

function boundsProps(props: Partial<BoundsProps> = {}): BoundsProps {
  return reactive<BoundsProps>({ type: "datetime", ...props });
}

function validate(rule: Rule, value: string) {
  return rule(value);
}
