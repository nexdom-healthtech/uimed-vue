import { required } from "@/composables/inputs/rules.ts";
import DateTimeField from "@/components/inputs/date-time-field/date-time-field.vue";
import type {
  DateTimeFieldProps,
  DateTimeFieldType,
  DateTimeFieldVariant,
} from "@/components/inputs/date-time-field/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import { flushPromises, mount } from "@vue/test-utils";
import { VDatePicker, VLocaleProvider, VMenu, VTextField, VTimePicker } from "vuetify/components";

const variants: [DateTimeFieldVariant, string][] = [
  ["primary", "underlined"],
  ["secondary", "outlined"],
];

const pickersByType: [DateTimeFieldType, boolean, boolean][] = [
  ["date", true, false],
  ["time", false, true],
  ["datetime", true, true],
];

const displayByType: [DateTimeFieldType, string, string][] = [
  ["date", "2026-09-24", "24/09/2026"],
  ["time", "14:30", "14:30"],
  ["datetime", "2026-09-24T14:30", "24/09/2026 14:30"],
];

const testId = "date-time-field-test-id";
const styleValue = "random-style";
const classValue = "random-class";

describe("DateTimeField", () => {
  it("should exists", () => {
    const wrapper = mountDateTimeField();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    const wrapper = mountDateTimeField();
    expect(findVTextField(wrapper).exists()).toBeTruthy();
  });

  it('should inherit "data-testid" attribute', () => {
    const wrapper = mountDateTimeField();
    expect(wrapper.attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountDateTimeField();
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).not.toBeUndefined();
    expect(wrapper.attributes("class")).not.toContain(classValue);
  });

  it("should prevent typing, since values come from the pickers", () => {
    const wrapper = mountDateTimeField();
    expect(findVTextField(wrapper).props("readonly")).toBe(true);
  });

  describe("menu", () => {
    it("should be closed by default", () => {
      const wrapper = mountDateTimeField();
      const vMenu = findVMenu(wrapper);

      expect(vMenu.props("modelValue")).toBe(false);
      expect(vMenu.props("disabled")).toBe(false);
      expect(vMenu.props("closeOnContentClick")).toBe(false);
      expect(vMenu.props("target")).toBe("parent");
    });

    it("should be activated by the input, described as a control that opens a dialog", () => {
      const wrapper = mountDateTimeField({ label: "Data" });
      const inputId = findVTextField(wrapper).props("id");
      const vMenu = findVMenu(wrapper);

      expect(inputId).toBeTruthy();
      expect(vMenu.props("activator")).toBe(`#${inputId}`);
      expect(vMenu.props("activatorProps")).toStrictEqual({
        role: "combobox",
        "aria-haspopup": "dialog",
        "aria-owns": undefined,
      });
      expect(vMenu.props("contentProps")).toStrictEqual({
        role: "dialog",
        "aria-labelledby": `${inputId}-label`,
      });
    });

    it("should not name the dialog when the field has no label", () => {
      const wrapper = mountDateTimeField();
      expect(findVMenu(wrapper).props("contentProps")).toStrictEqual({
        role: "dialog",
        "aria-labelledby": undefined,
      });
    });

    it("should open when the field is clicked outside the input", async () => {
      const wrapper = mountDateTimeField();

      findVTextField(wrapper).vm.$emit("click:control", new MouseEvent("click"));
      await flushPromises();

      expect(findVMenu(wrapper).props("modelValue")).toBe(true);
    });

    it("should open when the field is clicked", async () => {
      const wrapper = mountDateTimeField();
      await flushPromises();

      await clickField(wrapper);

      expect(findVMenu(wrapper).props("modelValue")).toBe(true);
    });

    describe("accessibility", () => {
      it("should set the menu's attributes on the input, not on the field", async () => {
        const wrapper = mountDateTimeField({ label: "Data" }, true);
        await flushPromises();

        const input = wrapper.find("input");
        expect(input.attributes("role")).toBe("combobox");
        expect(input.attributes("aria-haspopup")).toBe("dialog");
        expect(input.attributes("aria-expanded")).toBe("false");
        expect(input.attributes("aria-controls")).toBe(findVMenu(wrapper).vm.id);
        expect(input.attributes()).not.toHaveProperty("aria-owns");
        expect(fieldAriaAttributes(wrapper)).toEqual([]);

        await input.trigger("click");
        await flushPromises();
        expect(input.attributes("aria-expanded")).toBe("true");

        const dialog = document.querySelector(".v-overlay__content");
        expect(dialog?.getAttribute("role")).toBe("dialog");
        expect(dialog?.getAttribute("aria-labelledby")).toBe(`${input.attributes("id")}-label`);
        expect(document.getElementById(`${input.attributes("id")}-label`)?.textContent).toBe(
          "Data",
        );
      });

      it.each<keyof DateTimeFieldProps>(["readonly", "disabled"])(
        "should keep the input a plain field while %s",
        async (prop) => {
          const wrapper = mountDateTimeField({ [prop]: true }, true);
          await flushPromises();

          const input = wrapper.find("input");
          expect(findVMenu(wrapper).props("activator")).toBeUndefined();
          expect(input.attributes("role")).toBeUndefined();
          expect(input.attributes("aria-haspopup")).toBeUndefined();
          expect(input.attributes("aria-expanded")).toBeUndefined();
          expect(fieldAriaAttributes(wrapper)).toEqual([]);
        },
      );

      it("should remove the menu's attributes when it can't open anymore", async () => {
        const wrapper = mountDateTimeField({}, true);
        await flushPromises();

        const input = wrapper.find("input");
        expect(input.attributes("role")).toBe("combobox");

        await wrapper.setProps({ readonly: true });
        await flushPromises();
        expect(input.attributes("role")).toBeUndefined();
        expect(input.attributes("aria-expanded")).toBeUndefined();
      });
    });

    it("should display the pickers in pt-BR", async () => {
      const wrapper = mountDateTimeField();
      await openMenu(wrapper);

      const vLocaleProvider = wrapper.findComponent(VLocaleProvider);
      expect(vLocaleProvider.props("locale")).toBe("pt-BR");
      expect(vLocaleProvider.props("messages")).toHaveProperty(["pt-BR", "datePicker", "title"]);
      expect(wrapper.findComponent(VDatePicker).text()).toContain("Selecione a data");
    });

    it.each(pickersByType)(
      'should show for type "%s" the date picker (%s) and the time picker (%s)',
      async (type, hasDatePicker, hasTimePicker) => {
        const wrapper = mountDateTimeField({ type });
        await openMenu(wrapper);

        expect(findVDatePicker(wrapper).exists()).toBe(hasDatePicker);
        expect(findVTimePicker(wrapper).exists()).toBe(hasTimePicker);
      },
    );

    it("should use the 24 hours format on the time picker", async () => {
      const wrapper = mountDateTimeField({ type: "time" });
      await openMenu(wrapper);

      expect(findVTimePicker(wrapper).props("format")).toBe("24hr");
    });

    it("should default to the datetime type when not set", async () => {
      const wrapper = mountDateTimeField();
      await openMenu(wrapper);

      expect(findVDatePicker(wrapper).exists()).toBe(true);
      expect(findVTimePicker(wrapper).exists()).toBe(true);
    });
  });

  describe("selection", () => {
    it("should select a date", async () => {
      const wrapper = mountDateTimeField({ type: "date" });
      await openMenu(wrapper);

      await pickDate(wrapper, new Date(2026, 8, 24));

      expect(emittedValues(wrapper)).toEqual([["2026-09-24"]]);
      expect(findVMenu(wrapper).props("modelValue")).toBe(false);

      await wrapper.setProps({ modelValue: "2026-09-24" });
      expect(findVTextField(wrapper).props("modelValue")).toBe("24/09/2026");
    });

    it("should use the picked date's local components, padded to two digits", async () => {
      const wrapper = mountDateTimeField({ type: "date" });
      await openMenu(wrapper);

      await pickDate(wrapper, new Date(2026, 0, 5, 23, 59));

      expect(emittedValues(wrapper)).toEqual([["2026-01-05"]]);
    });

    it("should select a time, closing only after the minute is picked", async () => {
      const wrapper = mountDateTimeField({ type: "time" });
      await openMenu(wrapper);

      await pickTime(wrapper, "14:30");

      expect(emittedValues(wrapper)).toEqual([["14:30"]]);
      expect(findVMenu(wrapper).props("modelValue")).toBe(true);

      await pickMinute(wrapper, 30);
      expect(findVMenu(wrapper).props("modelValue")).toBe(false);

      await wrapper.setProps({ modelValue: "14:30" });
      expect(findVTextField(wrapper).props("modelValue")).toBe("14:30");
    });

    it("should select a date, then a time", async () => {
      const wrapper = mountDateTimeField();
      await openMenu(wrapper);

      await pickDate(wrapper, new Date(2026, 8, 24));

      expect(emittedValues(wrapper)).toBeUndefined();
      expect(findVMenu(wrapper).props("modelValue")).toBe(true);
      expect(findVDatePicker(wrapper).props("modelValue")).toBe("2026-09-24");

      await pickMinute(wrapper, 0);
      expect(findVMenu(wrapper).props("modelValue")).toBe(true);

      await pickTime(wrapper, "14:30");
      expect(emittedValues(wrapper)).toEqual([["2026-09-24T14:30"]]);
      expect(findVTimePicker(wrapper).props("modelValue")).toBe("14:30");

      await pickMinute(wrapper, 30);
      expect(findVMenu(wrapper).props("modelValue")).toBe(false);

      await wrapper.setProps({ modelValue: "2026-09-24T14:30" });
      expect(findVTextField(wrapper).props("modelValue")).toBe("24/09/2026 14:30");
    });

    it("should select a time, then a date", async () => {
      const wrapper = mountDateTimeField();
      await openMenu(wrapper);

      await pickTime(wrapper, "14:30");
      await pickMinute(wrapper, 30);

      expect(emittedValues(wrapper)).toBeUndefined();
      expect(findVMenu(wrapper).props("modelValue")).toBe(true);

      await pickDate(wrapper, new Date(2026, 8, 24));

      expect(emittedValues(wrapper)).toEqual([["2026-09-24T14:30"]]);
      expect(findVMenu(wrapper).props("modelValue")).toBe(false);
    });

    it("should keep the current time when a new date is picked", async () => {
      const wrapper = mountDateTimeField({ modelValue: "2026-09-24T14:30" });
      await openMenu(wrapper);

      expect(findVDatePicker(wrapper).props("modelValue")).toBe("2026-09-24");
      expect(findVTimePicker(wrapper).props("modelValue")).toBe("14:30");

      await pickDate(wrapper, new Date(2026, 8, 25));

      expect(emittedValues(wrapper)).toEqual([["2026-09-25T14:30"]]);
      expect(findVMenu(wrapper).props("modelValue")).toBe(false);
    });

    it("should ignore an emptied time", async () => {
      const wrapper = mountDateTimeField({ modelValue: "2026-09-24T14:30" });
      await openMenu(wrapper);

      await pickTime(wrapper, null);

      expect(emittedValues(wrapper)).toBeUndefined();
      expect(findVTimePicker(wrapper).props("modelValue")).toBe("");
    });

    it("should discard an incomplete selection when the menu is reopened", async () => {
      const wrapper = mountDateTimeField();
      await openMenu(wrapper);

      expect(findVDatePicker(wrapper).props("modelValue")).toBeNull();
      expect(findVTimePicker(wrapper).props("modelValue")).toBe("");

      await pickDate(wrapper, new Date(2026, 8, 24));
      await findVMenu(wrapper).setValue(false);
      await openMenu(wrapper);

      expect(findVDatePicker(wrapper).props("modelValue")).toBeNull();
      expect(emittedValues(wrapper)).toBeUndefined();
    });
  });

  describe("props", () => {
    describe("variant", () => {
      it.each(variants)(
        'should forward `variant="%s"` to Vuetify\'s `%s` variant',
        async (variant, vuetifyVariant) => {
          const wrapper = mountDateTimeField();
          await wrapper.setProps({ variant });

          expect(findVTextField(wrapper).props("variant")).toBe(vuetifyVariant);
        },
      );

      it("should default to the underlined variant when not set", () => {
        const wrapper = mountDateTimeField();
        expect(findVTextField(wrapper).props("variant")).toBe("underlined");
      });
    });

    describe("modelValue", () => {
      it.each(displayByType)(
        'should display for type "%s" the value "%s" as "%s"',
        (type, modelValue, displayValue) => {
          const wrapper = mountDateTimeField({ type, modelValue });
          const vTextField = findVTextField(wrapper);

          expect(vTextField.props("modelValue")).toBe(displayValue);
          expect(vTextField.props("validationValue")).toBe(modelValue);
        },
      );

      it("should be an empty string by default", () => {
        const wrapper = mountDateTimeField();
        const vTextField = findVTextField(wrapper);

        expect(wrapper.props("modelValue")).toBe("");
        expect(vTextField.props("modelValue")).toBe("");
        expect(vTextField.props("validationValue")).toBe("");
      });
    });

    describe("required", () => {
      it("should generate rule to underlying component", async () => {
        const wrapper = mountDateTimeField();
        await wrapper.setProps({ required: true });

        const vTextField = findVTextField(wrapper);

        expect(vTextField.props("rules")).toHaveLength(1);
        expect(vTextField.props("rules")).toContain(required);
        expect(await vTextField.vm.validate()).toEqual(["Campo obrigatório"]);
      });

      it("shouldn't change rules by default", () => {
        const wrapper = mountDateTimeField();
        expect(findVTextField(wrapper).props("rules")).toHaveLength(0);
      });
    });

    describe("min and max", () => {
      it("should show an error when the value is out of range", async () => {
        const wrapper = mountDateTimeField({
          type: "date",
          min: "2026-09-10",
          max: "2026-09-20",
          modelValue: "2026-09-15",
        });
        await flushPromises();

        expect(findVTextField(wrapper).props("rules")).toHaveLength(2);
        expect(wrapper.text()).not.toContain("permitido");

        await wrapper.setProps({ modelValue: "2026-09-21" });
        await flushPromises();
        expect(wrapper.text()).toContain("Valor posterior ao máximo permitido (20/09/2026)");

        await wrapper.setProps({ modelValue: "2026-09-09" });
        await flushPromises();
        expect(wrapper.text()).toContain("Valor anterior ao mínimo permitido (10/09/2026)");
      });

      it("should limit the date picker", async () => {
        const wrapper = mountDateTimeField({ type: "date", min: "2026-09-10", max: "2026-09-20" });
        await openMenu(wrapper);

        const vDatePicker = findVDatePicker(wrapper);
        expect(vDatePicker.props("min")).toBe("2026-09-10");
        expect(vDatePicker.props("max")).toBe("2026-09-20");
      });

      it("should limit the time picker", async () => {
        const wrapper = mountDateTimeField({ type: "time", min: "08:00", max: "18:00" });
        await openMenu(wrapper);

        const vTimePicker = findVTimePicker(wrapper);
        expect(vTimePicker.props("min")).toBe("08:00");
        expect(vTimePicker.props("max")).toBe("18:00");
      });

      it("should limit the time picker only on the limit's own date for datetime", async () => {
        const wrapper = mountDateTimeField({ min: "2026-09-10T08:00", max: "2026-09-20T18:00" });
        await openMenu(wrapper);

        expect(findVDatePicker(wrapper).props("min")).toBe("2026-09-10");
        expect(findVDatePicker(wrapper).props("max")).toBe("2026-09-20");
        expect(findVTimePicker(wrapper).props("min")).toBe("");

        await pickDate(wrapper, new Date(2026, 8, 10));
        expect(findVTimePicker(wrapper).props("min")).toBe("08:00");
        expect(findVTimePicker(wrapper).props("max")).toBe("");
      });
    });

    describe("readonly and disabled", () => {
      it.each<keyof DateTimeFieldProps>(["readonly", "disabled"])(
        "should not open the menu while %s",
        async (prop) => {
          const wrapper = mountDateTimeField({ [prop]: true });
          await flushPromises();

          expect(findVMenu(wrapper).props("disabled")).toBe(true);

          await clickField(wrapper);
          expect(findVMenu(wrapper).props("modelValue")).toBe(false);

          findVTextField(wrapper).vm.$emit("click:control", new MouseEvent("click"));
          await flushPromises();
          expect(findVMenu(wrapper).props("modelValue")).toBe(false);
        },
      );

      it("should forward disabled to the underlying component", async () => {
        const wrapper = mountDateTimeField();
        await wrapper.setProps({ disabled: true });

        expect(findVTextField(wrapper).props("disabled")).toBe(true);
      });

      it("should hide the clear action while readonly", async () => {
        const wrapper = mountDateTimeField({ clearable: true, readonly: true });
        expect(findVTextField(wrapper).props("clearable")).toBe(false);
      });
    });

    describe("clearable", () => {
      it("should change modelValue to empty string when cleared", async () => {
        const wrapper = mountDateTimeField({ clearable: true, modelValue: "2026-09-24T14:30" });

        const vTextField = findVTextField(wrapper);
        expect(vTextField.props("clearable")).toBe(true);

        vTextField.vm.$emit("click:clear");

        expect(emittedValues(wrapper)).toEqual([[""]]);
      });
    });

    describe("disabled, loading, clearable and readonly", () => {
      it("should be false by default", () => {
        const wrapper = mountDateTimeField();
        const vTextField = findVTextField(wrapper);

        expect(vTextField.props("disabled")).toBe(false);
        expect(vTextField.props("loading")).toBe(false);
        expect(vTextField.props("clearable")).toBe(false);
        expect(findVMenu(wrapper).props("disabled")).toBe(false);
      });

      it("should forward loading to the underlying component", async () => {
        const wrapper = mountDateTimeField();
        await wrapper.setProps({ loading: true });

        expect(findVTextField(wrapper).props("loading")).toBe(true);
      });

      it("should hide the loading indicator from assistive technologies and mark the field as busy", async () => {
        const wrapper = mountDateTimeField();
        await wrapper.setProps({ loading: true });

        expect(wrapper.find(".v-field").classes()).toContain("v-field--loading");
        expect(wrapper.find("[role='progressbar']").attributes("aria-hidden")).toBe("true");
        expect(wrapper.find("input").attributes("aria-busy")).toBe("true");
      });

      it("should keep the loading indicator inactive and the field not busy by default", () => {
        const wrapper = mountDateTimeField();

        expect(wrapper.find(".v-field").classes()).not.toContain("v-field--loading");
        expect(wrapper.find("input").attributes("aria-busy")).toBeUndefined();
      });
    });

    describe("label, placeholder and hint", () => {
      it("should forward to the underlying component", async () => {
        const label = "Label";
        const placeholder = "Placeholder";
        const hint = "Hint";

        const wrapper = mountDateTimeField();
        await wrapper.setProps({ label, placeholder, hint });

        const vTextField = findVTextField(wrapper);

        expect(vTextField.props("label")).toBe(label);
        expect(vTextField.props("placeholder")).toBe(placeholder);
        expect(vTextField.props("hint")).toBe(hint);
      });
    });
  });
});

const attachedWrappers: Array<{ unmount: () => void }> = [];

afterEach(() => {
  attachedWrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  document.body.innerHTML = "";
});

function mountDateTimeField(
  props: DateTimeFieldProps & { modelValue?: string } = {},
  attachToDocument = false,
) {
  const wrapper = mount(DateTimeField, {
    props,
    attachTo: attachToDocument ? document.body : undefined,
    attrs: {
      "data-testid": testId,
      style: styleValue,
      class: classValue,
    },
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
  if (attachToDocument) attachedWrappers.push(wrapper);

  return wrapper;
}

type Wrapper = ReturnType<typeof mountDateTimeField>;

function findVTextField(wrapper: Wrapper) {
  return wrapper.findComponent(VTextField);
}

function findVMenu(wrapper: Wrapper) {
  return wrapper.findComponent(VMenu);
}

function findVDatePicker(wrapper: Wrapper) {
  return wrapper.findComponent(VDatePicker);
}

function findVTimePicker(wrapper: Wrapper) {
  return wrapper.findComponent(VTimePicker);
}

function fieldAriaAttributes(wrapper: Wrapper) {
  return Object.keys(wrapper.find(".v-field").attributes()).filter((name) =>
    name.startsWith("aria-"),
  );
}

async function clickField(wrapper: Wrapper) {
  await wrapper.find(".v-field__field").trigger("click");
}

async function openMenu(wrapper: Wrapper) {
  await findVMenu(wrapper).setValue(true);
  await flushPromises();
}

async function pickDate(wrapper: Wrapper, date: Date) {
  findVDatePicker(wrapper).vm.$emit("update:modelValue", date);
  await flushPromises();
}

async function pickTime(wrapper: Wrapper, time: string | null) {
  findVTimePicker(wrapper).vm.$emit("update:modelValue", time);
  await flushPromises();
}

async function pickMinute(wrapper: Wrapper, minute: number) {
  findVTimePicker(wrapper).vm.$emit("update:minute", minute);
  await flushPromises();
}

function emittedValues(wrapper: Wrapper) {
  return wrapper.emitted("update:modelValue");
}
