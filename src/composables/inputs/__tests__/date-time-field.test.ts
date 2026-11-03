import type { DateTimeFieldType } from "@/components/inputs/date-time-field/types.ts";
import {
  formatDateTime,
  getDatePart,
  getTimePart,
  joinDateTime,
  parseDigits,
  toDigits,
  useDateTimeFieldInput,
  useDateTimeFieldMenu,
  useDateTimeFieldPickerBounds,
  useDateTimeFieldRules,
} from "@/composables/inputs/date-time-field.ts";
import { required } from "@/composables/inputs/rules.ts";
import type { Rule } from "@/composables/inputs/types.ts";
import { icons } from "@/consts/icons.ts";
import { mount } from "@vue/test-utils";
import { nextTick, reactive, ref } from "vue";

type RulesProps = Parameters<typeof useDateTimeFieldRules>[0];
type BoundsProps = Parameters<typeof useDateTimeFieldPickerBounds>[0];
type InputProps = Parameters<typeof useDateTimeFieldInput>[0];
type Input = ReturnType<typeof useDateTimeFieldInput>;

const inputRule: Rule = () => true;

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

  describe("toDigits", () => {
    it.each<[DateTimeFieldType, string, string]>([
      ["date", "2026-09-24", "24092026"],
      ["time", "14:30", "1430"],
      ["datetime", "2026-09-24T14:30", "240920261430"],
      ["datetime", "", ""],
    ])('should return for type "%s" and value "%s" the digits "%s"', (type, value, expected) => {
      expect(toDigits(value, type)).toBe(expected);
    });
  });

  describe("parseDigits", () => {
    it.each<[DateTimeFieldType, string, string]>([
      ["date", "24092026", "2026-09-24"],
      ["date", "01012026", "2026-01-01"],
      ["date", "31122026", "2026-12-31"],
      ["date", "31012026", "2026-01-31"],
      ["date", "30042026", "2026-04-30"],
      ["date", "28022026", "2026-02-28"],
      ["date", "29022024", "2024-02-29"],
      ["date", "29022000", "2000-02-29"],
      ["date", "31012024", "2024-01-31"],
      ["date", "30042024", "2024-04-30"],
      ["date", "01010001", "0001-01-01"],
      ["time", "1430", "14:30"],
      ["time", "0000", "00:00"],
      ["time", "2359", "23:59"],
      ["datetime", "240920261430", "2026-09-24T14:30"],
    ])('should parse for type "%s" the digits "%s" as "%s"', (type, digits, expected) => {
      expect(parseDigits(digits, type)).toBe(expected);
    });

    it.each<[DateTimeFieldType, string, string]>([
      ["date", "", "empty"],
      ["date", "2409202", "incomplete"],
      ["date", "00092026", "with day 0"],
      ["date", "32012026", "with day 32 in a month of 31 days"],
      ["date", "31042026", "with day 31 in a month of 30 days"],
      ["date", "29022026", "with February 29 in a common year"],
      ["date", "29021900", "with February 29 in a century that isn't a leap year"],
      ["date", "30022024", "with February 30 in a leap year"],
      ["date", "24002026", "with month 0"],
      ["date", "24132026", "with month 13"],
      ["date", "24090000", "with year 0"],
      ["time", "143", "incomplete"],
      ["time", "2400", "with hour 24"],
      ["time", "1460", "with minute 60"],
      ["datetime", "24092026", "without the time"],
      ["datetime", "2409202614", "with an incomplete time"],
      ["datetime", "310920261430", "with a date that doesn't exist"],
      ["datetime", "240920262500", "with a time that doesn't exist"],
    ])('should not parse for type "%s" the digits "%s" (%s)', (type, digits) => {
      expect(parseDigits(digits, type)).toBe("");
    });
  });

  describe("useDateTimeFieldRules", () => {
    it("should only have the input rule by default", () => {
      const rules = useDateTimeFieldRules(rulesProps(), inputRule);

      expect(rules.value).toEqual([inputRule]);
    });

    it("should apply the required rule before the input rule", () => {
      const rules = useDateTimeFieldRules(rulesProps({ required: true }), inputRule);

      expect(rules.value).toEqual([required, inputRule]);
    });

    it("should validate the minimum value", () => {
      const props = rulesProps({ type: "date", min: "2026-09-10" });
      const rules = useDateTimeFieldRules(props, inputRule);

      expect(rules.value).toHaveLength(2);

      const [, minRule] = rules.value;
      expect(validate(minRule, "2026-09-09")).toBe(
        "Valor anterior ao mínimo permitido (10/09/2026)",
      );
      expect(validate(minRule, "2026-09-10")).toBe(true);
      expect(validate(minRule, "2026-09-11")).toBe(true);
      expect(validate(minRule, "")).toBe(true);
    });

    it("should validate the maximum value", () => {
      const rules = useDateTimeFieldRules(rulesProps({ type: "time", max: "18:00" }), inputRule);

      expect(rules.value).toHaveLength(2);

      const [, maxRule] = rules.value;
      expect(validate(maxRule, "18:01")).toBe("Valor posterior ao máximo permitido (18:00)");
      expect(validate(maxRule, "18:00")).toBe(true);
      expect(validate(maxRule, "17:59")).toBe(true);
      expect(validate(maxRule, "")).toBe(true);
    });

    it("should combine every rule, following props changes", () => {
      const props = rulesProps();
      const rules = useDateTimeFieldRules(props, inputRule);

      props.required = true;
      props.min = "2026-09-10T08:00";
      props.max = "2026-09-20T18:00";

      expect(rules.value).toHaveLength(4);

      const [requiredRule, typedRule, minRule, maxRule] = rules.value;
      expect(requiredRule).toBe(required);
      expect(typedRule).toBe(inputRule);
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

  describe("useDateTimeFieldInput", () => {
    it("should display the value masked, validating the value itself", () => {
      const { input } = mountInput({ type: "date" }, "2026-09-24");

      expect(input.displayValue.value).toBe("24/09/2026");
      expect(input.validationValue.value).toBe("2026-09-24");
      expect(input.rule("")).toBe(true);
    });

    it.each<[DateTimeFieldType, string]>([
      ["date", "00/00/0000"],
      ["time", "00:00"],
      ["datetime", "00/00/0000 00:00"],
    ])('should use for type "%s" the placeholder "%s", unless one is given', (type, expected) => {
      const { input, props } = mountInput({ type });
      expect(input.placeholder.value).toBe(expected);

      props.placeholder = "Data";
      expect(input.placeholder.value).toBe("Data");
    });

    it("should emit a whole, existing date typed in the field", () => {
      const { input, model } = mountInput({ type: "date" });

      typeText(input, "24/09/2026");

      expect(model.value).toBe("2026-09-24");
      expect(input.displayValue.value).toBe("24/09/2026");
      expect(input.validationValue.value).toBe("2026-09-24");
      expect(input.rule("")).toBe(true);
    });

    it("should mask the digits typed in the field", async () => {
      const { input, model } = mountInput({ type: "datetime" });

      typeText(input, "240920261430");
      await nextTick();

      expect(model.value).toBe("2026-09-24T14:30");
      expect(input.displayValue.value).toBe("24/09/2026 14:30");
    });

    it("should empty the value while the typed one is incomplete, and say why", async () => {
      const { input, model } = mountInput({ type: "date" }, "2026-09-24");

      typeText(input, "24/09/202");
      await nextTick();

      expect(model.value).toBe("");
      expect(input.displayValue.value).toBe("24/09/202");
      expect(input.validationValue.value).toBe("2409202");
      expect(input.rule("")).toBe("Valor incompleto");
    });

    it("should empty the value while the typed one doesn't exist, and say why", async () => {
      const { input, model } = mountInput({ type: "time" }, "14:30");

      typeText(input, "25:00");
      await nextTick();

      expect(model.value).toBe("");
      expect(input.displayValue.value).toBe("25:00");
      expect(input.rule("")).toBe("Valor inválido");
    });

    it("should say why a typed date and time doesn't exist, by the digits of its own mask", () => {
      const { input } = mountInput({ type: "datetime" });

      typeText(input, "24/09/2026 25:00");

      expect(input.rule("")).toBe("Valor inválido");
    });

    it("should not emit while the typed text doesn't change the value", () => {
      const { input, emitted } = mountInput({ type: "date" }, "2026-09-24");

      typeText(input, "24/09/2026");

      expect(emitted).toEqual([]);
    });

    it("should accept a value typed through a composition, as on mobile keyboards", () => {
      const { input, model } = mountInput({ type: "time" });

      input.onCompositionEnd({ target: inputWith("1430") } as unknown as CompositionEvent);

      expect(model.value).toBe("14:30");
    });

    it("should wait for a composition to end before emitting", () => {
      const { input, model } = mountInput({ type: "time" });

      input.onInput({ target: inputWith("1430"), isComposing: true } as unknown as InputEvent);

      expect(model.value).toBe("");
    });

    it("should be valid while empty", () => {
      const { input } = mountInput();

      expect(input.rule("")).toBe(true);
      expect(input.validationValue.value).toBe("");
    });

    it("should display a value from the pickers or the app instead of the typed one", async () => {
      const { input, model } = mountInput({ type: "date" });

      typeText(input, "24/09");
      model.value = "2026-10-05";
      await nextTick();

      expect(input.displayValue.value).toBe("05/10/2026");
      expect(input.rule("")).toBe(true);
    });

    it("should display the value in the new type's mask", async () => {
      const { input, props } = mountInput({ type: "datetime" }, "2026-09-24T14:30");

      props.type = "date";
      await nextTick();

      expect(input.displayValue.value).toBe("24/09/2026");
    });

    it("should empty the value and the typed text when cleared", () => {
      const { input, model } = mountInput({ type: "date" });

      typeText(input, "24/09");
      input.clear();

      expect(model.value).toBe("");
      expect(input.displayValue.value).toBe("");
      expect(input.rule("")).toBe(true);
    });
  });

  describe("useDateTimeFieldMenu", () => {
    it("should identify the input with a unique id and position the menu below it", () => {
      const { menu } = mountMenu();

      expect(menu.inputId).toBe("test-0");
      expect(menu.target).toBe("#test-0");
    });

    it.each<[DateTimeFieldType, string, string]>([
      ["date", icons.calendar, "Selecionar data"],
      ["time", icons.clock, "Selecionar horário"],
      ["datetime", icons.calendar, "Selecionar data e horário"],
    ])(
      'should draw for type "%s" an icon that opens a dialog, named after what it picks',
      (type, icon, label) => {
        const { menu, fieldType } = mountMenu();

        fieldType.value = type;

        expect(menu.iconProps.value).toStrictEqual({
          icon,
          "aria-label": label,
          "aria-haspopup": "dialog",
        });
      },
    );

    it("should describe the content as a dialog named by the label, when there's one", () => {
      const { menu, label } = mountMenu();

      expect(menu.contentProps.value).toEqual({
        role: "dialog",
        "aria-labelledby": "test-0-label",
      });

      label.value = false;
      expect(menu.contentProps.value).toEqual({ role: "dialog", "aria-labelledby": undefined });
    });

    it.each(["Enter", " "])('should open the menu with "%s" on the icon', (key) => {
      const { menu, isOpen } = mountMenu();
      const event = new KeyboardEvent("keydown", { key, cancelable: true });
      const stopPropagation = vi.spyOn(event, "stopPropagation");

      menu.onKeydown(event);

      expect(isOpen.value).toBe(true);
      expect(event.defaultPrevented).toBe(true);
      expect(stopPropagation).toHaveBeenCalledOnce();
    });

    it("should ignore other keys on the icon", () => {
      const { menu, isOpen } = mountMenu();
      const event = new KeyboardEvent("keydown", { key: "Tab", cancelable: true });

      menu.onKeydown(event);

      expect(isOpen.value).toBe(false);
      expect(event.defaultPrevented).toBe(false);
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

function mountMenu() {
  const isOpen = ref(false);
  const fieldType = ref<DateTimeFieldType>("datetime");
  const label = ref(true);
  let menu: ReturnType<typeof useDateTimeFieldMenu> | undefined;

  mount(
    {
      setup() {
        menu = useDateTimeFieldMenu(isOpen, fieldType, label);
        return () => null;
      },
    },
    { global: { config: { idPrefix: "test" } } },
  );

  if (!menu) throw new Error("The composable wasn't called");
  return { menu, isOpen, fieldType, label };
}

/**
 * Calls the composable inside a component, with a model that records the values the composable
 * emits, as `defineModel` would.
 */
function mountInput(props: Partial<InputProps> = {}, value = "") {
  const reactiveProps = reactive<InputProps>({ type: "datetime", ...props });
  const model = ref(value);
  const emitted: Array<string> = [];
  const recordingModel = {
    get value() {
      return model.value;
    },
    set value(newValue: string) {
      emitted.push(newValue);
      model.value = newValue;
    },
  };
  let input: Input | undefined;

  mount({
    setup() {
      input = useDateTimeFieldInput(reactiveProps, recordingModel as typeof model);
      return () => null;
    },
  });

  if (!input) throw new Error("The composable wasn't called");
  return { input, model, emitted, props: reactiveProps };
}

function inputWith(text: string) {
  const element = document.createElement("input");
  element.value = text;
  return element;
}

/** Puts the text in the input at once, as an `input` event of a paste would bring it. */
function typeText(input: Input, text: string) {
  const event = { target: inputWith(text), isComposing: false, inputType: "insertFromPaste" };
  input.onInput(event as unknown as InputEvent);
}

function rulesProps(props: Partial<RulesProps> = {}): RulesProps {
  return reactive<RulesProps>({ required: false, type: "datetime", ...props });
}

function boundsProps(props: Partial<BoundsProps> = {}): BoundsProps {
  return reactive<BoundsProps>({ type: "datetime", ...props });
}

function validate(rule: Rule, value: string) {
  return rule(value);
}
