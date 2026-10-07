import { required } from "@/composables/inputs/rules.ts";
import MaskField from "@/components/inputs/mask-field/mask-field.vue";
import type {
  MaskFieldMask,
  MaskFieldProps,
  MaskFieldVariant,
} from "@/components/inputs/mask-field/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import { flushPromises, mount } from "@vue/test-utils";
import { VTextField } from "vuetify/components";

const variants: [MaskFieldVariant, string][] = [
  ["primary", "underlined"],
  ["secondary", "outlined"],
];

const typing: [MaskFieldMask, string, string, string][] = [
  ["cpf", "12345678909", "123.456.789-09", "12345678909"],
  ["cnpj", "12345678000195", "12.345.678/0001-95", "12345678000195"],
  ["cep", "01310100", "01310-100", "01310100"],
  ["phone", "11912345678", "(11) 91234-5678", "11912345678"],
  ["date", "31122026", "31/12/2026", "31122026"],
  ["####-##/####", "1234561234", "1234-56/1234", "1234561234"],
  ["Nº ####", "1a2b34", "Nº 1234", "1234"],
];

const testId = "mask-field-test-id";
const styleValue = "random-style";
const classValue = "random-class";

describe("MaskField", () => {
  it("should exists", () => {
    const wrapper = mountMaskField();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    const wrapper = mountMaskField();
    expect(findVTextField(wrapper).exists()).toBeTruthy();
  });

  it('should inherit "data-testid" attribute', () => {
    const wrapper = mountMaskField();
    expect(wrapper.attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountMaskField();
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).not.toBeUndefined();
    expect(wrapper.attributes("class")).not.toContain(classValue);
  });

  it("should show the numeric keyboard on a text input", () => {
    const wrapper = mountMaskField();
    const input = wrapper.find("input");

    expect(input.attributes("inputmode")).toBe("numeric");
    expect(input.attributes("type")).toBe("text");
    expect(input.attributes("maxlength")).toBeUndefined();
  });

  it("should show the numeric keyboard when the mask has letters", () => {
    const wrapper = mountMaskField({ mask: "Nº ####" });

    expect(wrapper.find("input").attributes("inputmode")).toBe("numeric");
  });

  describe("typing", () => {
    it.each(typing)(
      'should mask with "%s" the typed "%s" as "%s", emitting "%s"',
      async (mask, typed, masked, emitted) => {
        const wrapper = mountMaskField({ mask });

        for (const char of typed) {
          const input = findInput(wrapper);
          await typeText(wrapper, `${input.value}${char}`, "insertText");
        }

        expect(findInput(wrapper).value).toBe(masked);
        expect(emittedValues(wrapper)?.at(-1)).toEqual([emitted]);
        expect(findVTextField(wrapper).props("modelValue")).toBe(masked);
      },
    );

    it("should show a literal as soon as the character before it is typed", async () => {
      const wrapper = mountMaskField({ mask: "cpf", modelValue: "12" });

      await typeText(wrapper, "123", "insertText");
      expect(findInput(wrapper).value).toBe("123.");
      expect(findInput(wrapper).selectionStart).toBe(4);

      await typeText(wrapper, "123.4", "insertText");
      expect(findInput(wrapper).value).toBe("123.4");
      expect(findInput(wrapper).selectionStart).toBe(5);
    });

    it("should discard letters and symbols without emitting", async () => {
      const wrapper = mountMaskField({ mask: "cpf", modelValue: "123" });

      await typeText(wrapper, "123.a", "insertText");

      expect(findInput(wrapper).value).toBe("123.");
      expect(findInput(wrapper).selectionStart).toBe(4);
      expect(emittedValues(wrapper)).toBeUndefined();
    });

    it("should ignore a character typed at the end of a full mask", async () => {
      const wrapper = mountMaskField({ mask: "cep", modelValue: "01310100" });

      await typeText(wrapper, "01310-1009", "insertText");

      expect(findInput(wrapper).value).toBe("01310-100");
      expect(findInput(wrapper).selectionStart).toBe(9);
      expect(emittedValues(wrapper)).toBeUndefined();
    });

    it("should drop the last character when typing in the middle of a full mask", async () => {
      const wrapper = mountMaskField({ mask: "cep", modelValue: "01310100" });

      await typeText(wrapper, "013910-100", "insertText", 4);

      expect(findInput(wrapper).value).toBe("01391-010");
      expect(findInput(wrapper).selectionStart).toBe(4);
      expect(emittedValues(wrapper)).toEqual([["01391010"]]);
    });

    it("should keep the caret after the typed digit in the middle", async () => {
      const wrapper = mountMaskField({ mask: "phone", modelValue: "1191234567" });

      await typeText(wrapper, "(11) 891234-567", "insertText", 6);

      expect(findInput(wrapper).value).toBe("(11) 89123-4567");
      expect(findInput(wrapper).selectionStart).toBe(6);
      expect(emittedValues(wrapper)).toEqual([["11891234567"]]);
    });

    it("should only move the caret before a literal deleted with Backspace", async () => {
      const wrapper = mountMaskField({ mask: "cpf", modelValue: "12345678909" });

      await typeText(wrapper, "123.456.78909", "deleteContentBackward", 11);

      expect(findInput(wrapper).value).toBe("123.456.789-09");
      expect(findInput(wrapper).selectionStart).toBe(11);
      expect(emittedValues(wrapper)).toBeUndefined();

      await typeText(wrapper, "123.456.78-09", "deleteContentBackward", 10);

      expect(findInput(wrapper).value).toBe("123.456.780-9");
      expect(emittedValues(wrapper)).toEqual([["1234567809"]]);
    });

    it("should paste a value cutting the excess", async () => {
      const wrapper = mountMaskField({ mask: "cpf" });

      await typeText(wrapper, "1234567890999", "insertFromPaste");

      expect(findInput(wrapper).value).toBe("123.456.789-09");
      expect(findInput(wrapper).selectionStart).toBe(14);
      expect(emittedValues(wrapper)).toEqual([["12345678909"]]);
    });

    it("should ignore the input while composing, and mask it at the end", async () => {
      const wrapper = mountMaskField({ mask: "cpf" });
      const input = findInput(wrapper);

      await typeText(wrapper, "1234", "insertCompositionText", 4, true);

      expect(input.value).toBe("1234");
      expect(emittedValues(wrapper)).toBeUndefined();

      input.dispatchEvent(new CompositionEvent("compositionend", { bubbles: true }));
      await flushPromises();

      expect(input.value).toBe("123.4");
      expect(emittedValues(wrapper)).toEqual([["1234"]]);
    });

    it("should ignore a character composed at the end of a full mask", async () => {
      const wrapper = mountMaskField({ mask: "cep", modelValue: "01310100" });
      const input = findInput(wrapper);

      await typeText(wrapper, "01310-1009", "insertCompositionText", 10, true);
      input.dispatchEvent(new CompositionEvent("compositionend", { bubbles: true }));
      await flushPromises();

      expect(input.value).toBe("01310-100");
      expect(input.selectionStart).toBe(9);
      expect(emittedValues(wrapper)).toBeUndefined();
    });
  });

  describe("props", () => {
    describe("variant", () => {
      it.each(variants)(
        'should forward `variant="%s"` to Vuetify\'s `%s` variant',
        async (variant, vuetifyVariant) => {
          const wrapper = mountMaskField();
          await wrapper.setProps({ variant });

          expect(findVTextField(wrapper).props("variant")).toBe(vuetifyVariant);
        },
      );

      it("should default to the underlined variant when not set", () => {
        const wrapper = mountMaskField();
        expect(findVTextField(wrapper).props("variant")).toBe("underlined");
      });
    });

    describe("mask", () => {
      it("should change the mask of the current value", async () => {
        const wrapper = mountMaskField({ mask: "cpf", modelValue: "12345678" });
        expect(findVTextField(wrapper).props("modelValue")).toBe("123.456.78");

        await wrapper.setProps({ mask: "cep" });

        expect(findVTextField(wrapper).props("modelValue")).toBe("12345-678");
        expect(emittedValues(wrapper)).toBeUndefined();
      });

      it("should validate a value with more digits than the new mask as invalid", async () => {
        const wrapper = mountMaskField({ mask: "cnpj", modelValue: "12345678000195" });
        const vTextField = findVTextField(wrapper);
        expect(await vTextField.vm.validate()).toEqual([]);

        await wrapper.setProps({ mask: "cpf" });

        expect(vTextField.props("modelValue")).toBe("123.456.780-00");
        expect(vTextField.props("validationValue")).toBe("12345678000195");
        expect(await vTextField.vm.validate()).toEqual(["Valor inválido"]);
        expect(emittedValues(wrapper)).toBeUndefined();
      });
    });

    describe("modelValue", () => {
      it("should display the value masked and validate its digits", () => {
        const wrapper = mountMaskField({ mask: "cpf", modelValue: "12345678909" });
        const vTextField = findVTextField(wrapper);

        expect(vTextField.props("modelValue")).toBe("123.456.789-09");
        expect(vTextField.props("validationValue")).toBe("12345678909");
      });

      it("should display a value out of format normalized, validating it as it is", async () => {
        const wrapper = mountMaskField({ mask: "cpf", modelValue: "123.456.789-0999abc" });
        await flushPromises();
        const vTextField = findVTextField(wrapper);

        expect(vTextField.props("modelValue")).toBe("123.456.789-09");
        expect(vTextField.props("validationValue")).toBe("123.456.789-0999abc");
        expect(findInput(wrapper).value).toBe("123.456.789-09");
        expect(await vTextField.vm.validate()).toEqual(["Valor inválido"]);
        expect(emittedValues(wrapper)).toBeUndefined();
      });

      it("should be an empty string by default", () => {
        const wrapper = mountMaskField();
        const vTextField = findVTextField(wrapper);

        expect(wrapper.props("modelValue")).toBe("");
        expect(vTextField.props("modelValue")).toBe("");
        expect(vTextField.props("validationValue")).toBe("");
      });
    });

    describe("required", () => {
      it("should generate rule to underlying component", async () => {
        const wrapper = mountMaskField();
        await wrapper.setProps({ required: true });

        const vTextField = findVTextField(wrapper);

        expect(vTextField.props("rules")).toHaveLength(3);
        expect(vTextField.props("rules")).toContain(required);
        expect(await vTextField.vm.validate()).toEqual(["Campo obrigatório"]);
      });

      it("should only validate the number of digits by default", async () => {
        const wrapper = mountMaskField();
        const vTextField = findVTextField(wrapper);

        expect(vTextField.props("rules")).toHaveLength(2);
        expect(vTextField.props("rules")).not.toContain(required);
        expect(await vTextField.vm.validate()).toEqual([]);
      });
    });

    describe("incomplete value", () => {
      it("should show an error while the mask isn't full", async () => {
        const wrapper = mountMaskField({ mask: "cpf", modelValue: "12345" });
        const vTextField = findVTextField(wrapper);

        expect(await vTextField.vm.validate()).toEqual(["Valor incompleto"]);

        await wrapper.setProps({ modelValue: "123.456.789-09" });
        expect(await vTextField.vm.validate()).toEqual([]);
      });

      it("should show the error after typing", async () => {
        const wrapper = mountMaskField({ mask: "cep" });
        // Lets the validation of the mount finish, so it doesn't overwrite the one of the typing
        await flushPromises();

        await typeText(wrapper, "0131", "insertText");

        expect(wrapper.text()).toContain("Valor incompleto");
      });
    });

    describe("clearable", () => {
      it("should change modelValue to empty string when cleared", async () => {
        const wrapper = mountMaskField({ clearable: true, modelValue: "12345678909" });

        const vTextField = findVTextField(wrapper);
        expect(vTextField.props("clearable")).toBe(true);

        vTextField.vm.$emit("click:clear");

        expect(emittedValues(wrapper)).toEqual([[""]]);
      });

      it("should label the clear icon in pt-BR for screen readers", async () => {
        const wrapper = mountMaskField({ clearable: true, label: "CPF", modelValue: "123" });

        expect(wrapper.find(".v-field__clearable .v-icon").attributes("aria-label")).toBe(
          "Limpar CPF",
        );
      });
    });

    describe("disabled, loading, clearable and readonly", () => {
      it("should forward to the underlying component", async () => {
        const wrapper = mountMaskField();
        await wrapper.setProps({ disabled: true, loading: true, clearable: true, readonly: true });

        const vTextField = findVTextField(wrapper);

        expect(vTextField.props("disabled")).toBe(true);
        expect(vTextField.props("loading")).toBe(true);
        expect(vTextField.props("clearable")).toBe(true);
        expect(vTextField.props("readonly")).toBe(true);
        expect(wrapper.find("input").attributes("disabled")).toBeDefined();
      });

      it("should block edits on the native input while readonly", () => {
        const wrapper = mountMaskField({ readonly: true });
        expect(wrapper.find("input").attributes("readonly")).toBeDefined();
      });

      it("should be false by default", () => {
        const wrapper = mountMaskField();
        const vTextField = findVTextField(wrapper);

        expect(vTextField.props("disabled")).toBe(false);
        expect(vTextField.props("loading")).toBe(false);
        expect(vTextField.props("clearable")).toBe(false);
        expect(vTextField.props("readonly")).toBe(false);
      });

      it("should hide the loading indicator from assistive technologies and mark the field as busy", async () => {
        const wrapper = mountMaskField();
        await wrapper.setProps({ loading: true });

        expect(wrapper.find(".v-field").classes()).toContain("v-field--loading");
        expect(wrapper.find("[role='progressbar']").attributes("aria-hidden")).toBe("true");
        expect(wrapper.find("input").attributes("aria-busy")).toBe("true");
      });

      it("should keep the loading indicator inactive and the field not busy by default", () => {
        const wrapper = mountMaskField();

        expect(wrapper.find(".v-field").classes()).not.toContain("v-field--loading");
        expect(wrapper.find("input").attributes("aria-busy")).toBeUndefined();
      });
    });

    describe("label, placeholder and hint", () => {
      it("should forward to the underlying component", async () => {
        const label = "Label";
        const placeholder = "Placeholder";
        const hint = "Hint";

        const wrapper = mountMaskField();
        await wrapper.setProps({ label, placeholder, hint });

        const vTextField = findVTextField(wrapper);

        expect(vTextField.props("label")).toBe(label);
        expect(vTextField.props("placeholder")).toBe(placeholder);
        expect(vTextField.props("hint")).toBe(hint);
      });

      it("should use the mask as placeholder by default", async () => {
        const wrapper = mountMaskField();
        expect(wrapper.find("input").attributes("placeholder")).toBe("000.000.000-00");

        await wrapper.setProps({ mask: "Nº ####" });
        expect(wrapper.find("input").attributes("placeholder")).toBe("Nº 0000");

        await wrapper.setProps({ placeholder: "" });
        expect(wrapper.find("input").attributes("placeholder")).toBe("");
      });
    });
  });
});

function mountMaskField(props: Partial<MaskFieldProps> & { modelValue?: string } = {}) {
  return mount(MaskField, {
    props: { mask: "cpf", ...props },
    attrs: {
      "data-testid": testId,
      style: styleValue,
      class: classValue,
    },
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

type Wrapper = ReturnType<typeof mountMaskField>;

function findVTextField(wrapper: Wrapper) {
  return wrapper.findComponent(VTextField);
}

function findInput(wrapper: Wrapper) {
  return wrapper.find("input").element;
}

async function typeText(
  wrapper: Wrapper,
  value: string,
  inputType: string,
  caret = value.length,
  isComposing = false,
) {
  const input = findInput(wrapper);
  input.value = value;
  input.setSelectionRange(caret, caret);
  // Vue's invoker ignores events not newer than its listener (`e._vts <= invoker.attached`), and
  // the fake timers freeze the clock
  vi.setSystemTime(Date.now() + 1);
  input.dispatchEvent(new InputEvent("input", { inputType, isComposing, bubbles: true }));
  await flushPromises();
}

function emittedValues(wrapper: Wrapper) {
  return wrapper.emitted("update:modelValue");
}
