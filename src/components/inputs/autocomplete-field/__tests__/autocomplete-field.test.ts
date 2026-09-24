import { mount } from "@vue/test-utils";
import { VAutocomplete, VCombobox } from "vuetify/components";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import AutocompleteField from "@/components/inputs/autocomplete-field/autocomplete-field.vue";
import { createAutocompleteRequiredRule } from "@/composables/inputs/autocomplete-field.ts";
import type { TextFieldVariant } from "@/components/inputs/text-field/types.ts";

const variants: [TextFieldVariant, string][] = [
  ["primary", "underlined"],
  ["secondary", "outlined"],
];

const testId = "autocomplete-field-test-id";
const styleValue = "random-style";
const classValue = "random-class";

describe("AutocompleteField", () => {
  it("should exist", () => {
    const wrapper = mountAutocompleteField();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain either v-autocomplete or v-combobox component", () => {
    const wrapper = mountAutocompleteField();
    const hasAutocomplete = wrapper.findComponent(VAutocomplete).exists();
    const hasCombobox = wrapper.findComponent(VCombobox).exists();
    expect(hasAutocomplete || hasCombobox).toBeTruthy();
  });

  it('should inherit "data-testid" attribute', () => {
    const wrapper = mountAutocompleteField();
    expect(wrapper.attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountAutocompleteField();
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).not.toBeUndefined();
    expect(wrapper.attributes("class")).not.toContain(classValue);
  });

  describe("props", () => {
    describe("strict", () => {
      it("should render v-autocomplete when strict is true", async () => {
        const wrapper = mountAutocompleteField();
        await wrapper.setProps({ strict: true });

        expect(wrapper.findComponent(VAutocomplete).exists()).toBeTruthy();
        expect(wrapper.findComponent(VCombobox).exists()).toBeFalsy();
      });

      it("should render v-combobox when strict is false", async () => {
        const wrapper = mountAutocompleteField();
        await wrapper.setProps({ strict: false });

        expect(wrapper.findComponent(VCombobox).exists()).toBeTruthy();
        expect(wrapper.findComponent(VAutocomplete).exists()).toBeFalsy();
      });

      it("should default to false (v-combobox)", () => {
        const wrapper = mountAutocompleteField();
        expect(wrapper.findComponent(VCombobox).exists()).toBeTruthy();
      });
    });

    describe("variant", () => {
      it.each(variants)(
        'should forward `variant="%s"` to Vuetify\'s `%s` variant',
        async (variant, vuetifyVariant) => {
          const wrapper = mountAutocompleteField();
          await wrapper.setProps({ variant });

          const component = findVuetifyComponent(wrapper);
          expect(component.props("variant")).toBe(vuetifyVariant);
        },
      );

      it("should default to the underlined variant when not set", () => {
        const wrapper = mountAutocompleteField();
        const component = findVuetifyComponent(wrapper);
        expect(component.props("variant")).toBe("underlined");
      });
    });

    describe("items", () => {
      it("should normalize string items to objects with label and value", async () => {
        const items = ["Apple", "Banana", "Cherry"];
        const wrapper = mountAutocompleteField();
        await wrapper.setProps({ items });

        const component = findVuetifyComponent(wrapper);
        const normalizedItems = component.props("items") ?? [];

        expect(normalizedItems).toHaveLength(3);
        normalizedItems.forEach((item: any, index: number) => {
          expect(item.label).toBe(items[index]);
          expect(item.value).toBe(items[index]);
        });
      });

      it("should use object items as-is", async () => {
        const items = [
          { label: "Option 1", value: "opt1" },
          { label: "Option 2", value: "opt2" },
        ];
        const wrapper = mountAutocompleteField();
        await wrapper.setProps({ items });

        const component = findVuetifyComponent(wrapper);
        const passedItems = component.props("items");

        expect(passedItems).toEqual(items);
      });

      it("should use item-title and item-value props", async () => {
        const wrapper = mountAutocompleteField();
        const component = findVuetifyComponent(wrapper);

        expect(component.props("itemTitle")).toBe("label");
        expect(component.props("itemValue")).toBe("value");
      });

      it("should default to empty array", () => {
        const wrapper = mountAutocompleteField();
        const component = findVuetifyComponent(wrapper);
        expect(component.props("items")).toEqual([]);
      });
    });

    describe("multiple", () => {
      it("should be forwarded to the underlying component", async () => {
        const wrapper = mountAutocompleteField();
        await wrapper.setProps({ multiple: true });

        const component = findVuetifyComponent(wrapper);
        expect(component.props("multiple")).toBe(true);
      });

      it("should default to false", () => {
        const wrapper = mountAutocompleteField();
        const component = findVuetifyComponent(wrapper);
        expect(component.props("multiple")).toBe(false);
      });
    });

    describe("chips", () => {
      it("should always be true", async () => {
        const wrapper = mountAutocompleteField();
        const component = findVuetifyComponent(wrapper);
        expect(component.props("chips")).toBe(true);
      });
    });

    describe("required", () => {
      it("should generate rule to underlying component when required is true", async () => {
        const wrapper = mountAutocompleteField();
        await wrapper.setProps({ required: true });

        const component = findVuetifyComponent(wrapper);
        expect(component.props("rules")).toHaveLength(1);
      });

      it("should not add rules when required is false", () => {
        const wrapper = mountAutocompleteField();
        const component = findVuetifyComponent(wrapper);
        expect(component.props("rules")).toHaveLength(0);
      });

      it("rule should pass any value when required is false", async () => {
        const wrapper = mountAutocompleteField();
        await wrapper.setProps({ required: false, multiple: false });

        // Get rules from component to verify they work correctly
        const component = findVuetifyComponent(wrapper);
        const rules = component.props("rules") as any[];
        expect(rules).toHaveLength(0);
      });

      describe("single value (multiple=false)", () => {
        it("should treat undefined as invalid", async () => {
          const wrapper = mountAutocompleteField();
          await wrapper.setProps({ required: true, multiple: false });

          const component = findVuetifyComponent(wrapper);
          const rules = component.props("rules") as any[];

          expect(rules).toHaveLength(1);
          const result = rules[0](undefined);
          expect(result).toBe("Campo obrigatório");
        });

        it("should treat empty string as invalid", async () => {
          const wrapper = mountAutocompleteField();
          await wrapper.setProps({ required: true, multiple: false });

          const component = findVuetifyComponent(wrapper);
          const rules = component.props("rules") as any[];

          const result = rules[0]("");
          expect(result).toBe("Campo obrigatório");
        });

        it("should treat non-empty value as valid", async () => {
          const wrapper = mountAutocompleteField();
          await wrapper.setProps({ required: true, multiple: false });

          const component = findVuetifyComponent(wrapper);
          const rules = component.props("rules") as any[];

          const result = rules[0]("some value");
          expect(result).toBe(true);
        });

        it("should treat a whitespace-only value as invalid", async () => {
          const wrapper = mountAutocompleteField();
          await wrapper.setProps({ required: true, multiple: false });

          const component = findVuetifyComponent(wrapper);
          const rules = component.props("rules") as any[];

          const result = rules[0]("   ");
          expect(result).toBe("Campo obrigatório");
        });
      });

      describe("multiple values (multiple=true)", () => {
        it("should treat empty array as invalid", async () => {
          const wrapper = mountAutocompleteField();
          await wrapper.setProps({ required: true, multiple: true });

          const component = findVuetifyComponent(wrapper);
          const rules = component.props("rules") as any[];

          expect(rules).toHaveLength(1);
          const result = rules[0]([]);
          expect(result).toBe("Campo obrigatório");
        });

        it("should treat non-empty array as valid", async () => {
          const wrapper = mountAutocompleteField();
          await wrapper.setProps({ required: true, multiple: true });

          const component = findVuetifyComponent(wrapper);
          const rules = component.props("rules") as any[];

          const result = rules[0](["item1", "item2"]);
          expect(result).toBe(true);
        });

        it("should treat undefined as invalid (empty)", async () => {
          const wrapper = mountAutocompleteField();
          await wrapper.setProps({ required: true, multiple: true });

          const component = findVuetifyComponent(wrapper);
          const rules = component.props("rules") as any[];

          const result = rules[0](undefined);
          expect(result).toBe("Campo obrigatório");
        });
      });
    });

    describe("disabled, loading, clearable and readonly", () => {
      it("should forward to the underlying component", async () => {
        const wrapper = mountAutocompleteField();
        await wrapper.setProps({
          disabled: true,
          loading: true,
          clearable: true,
          readonly: true,
        });

        const component = findVuetifyComponent(wrapper);

        expect(component.props("disabled")).toBe(true);
        expect(component.props("loading")).toBe(true);
        expect(component.props("clearable")).toBe(true);
        expect(component.props("readonly")).toBe(true);
      });

      it("should be false by default", () => {
        const wrapper = mountAutocompleteField();
        const component = findVuetifyComponent(wrapper);

        expect(component.props("disabled")).toBe(false);
        expect(component.props("loading")).toBe(false);
        expect(component.props("clearable")).toBe(false);
        expect(component.props("readonly")).toBe(false);
      });
    });

    describe("label, placeholder and hint", () => {
      it("should forward to the underlying component", async () => {
        const label = "Label";
        const placeholder = "Placeholder";
        const hint = "Hint";

        const wrapper = mountAutocompleteField();
        await wrapper.setProps({ label, placeholder, hint });

        const component = findVuetifyComponent(wrapper);

        expect(component.props("label")).toBe(label);
        expect(component.props("placeholder")).toBe(placeholder);
        expect(component.props("hint")).toBe(hint);
      });
    });

    describe("modelValue", () => {
      it("should sync prop to underlying component for single values", async () => {
        const value1 = "first";

        const wrapper = mountAutocompleteField();
        await wrapper.setProps({ modelValue: value1 });

        const component = findVuetifyComponent(wrapper);
        expect(component.props("modelValue")).toBe(value1);

        // Verify the wrapper also has the correct value
        expect(wrapper.props("modelValue")).toBe(value1);
      });

      it("should sync prop to underlying component for array values (multiple)", async () => {
        const value1 = ["first", "second"];

        const wrapper = mountAutocompleteField();
        await wrapper.setProps({ modelValue: value1, multiple: true });

        const component = findVuetifyComponent(wrapper);
        expect(component.props("modelValue")).toEqual(value1);

        // Verify the wrapper also has the correct value
        expect(wrapper.props("modelValue")).toEqual(value1);
      });

      it("should be undefined by default", () => {
        const wrapper = mountAutocompleteField();
        const component = findVuetifyComponent(wrapper);

        expect(wrapper.props("modelValue")).toBeUndefined();
        // Vuetify's components convert undefined to null
        expect(component.props("modelValue")).toBeNull();
      });

      it("should emit update:modelValue with a single value when the underlying component updates", async () => {
        const value = "Brasil";

        const wrapper = mountAutocompleteField();
        const component = findVuetifyComponent(wrapper);
        component.vm.$emit("update:modelValue", value);
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted("update:modelValue")).toBeTruthy();
        expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([value]);
      });

      it("should emit update:modelValue with an array when multiple and the underlying component updates", async () => {
        const value = ["Brasil", "Portugal"];

        const wrapper = mountAutocompleteField();
        await wrapper.setProps({ multiple: true });

        const component = findVuetifyComponent(wrapper);
        component.vm.$emit("update:modelValue", value);
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted("update:modelValue")).toBeTruthy();
        expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([value]);
      });
    });
  });
});

function mountAutocompleteField() {
  return mount(AutocompleteField, {
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

function findVuetifyComponent(wrapper: ReturnType<typeof mountAutocompleteField>) {
  const autocomplete = wrapper.findComponent(VAutocomplete);
  if (autocomplete.exists()) return autocomplete;

  return wrapper.findComponent(VCombobox) as unknown as typeof autocomplete;
}

describe("createAutocompleteRequiredRule", () => {
  describe("when required is false", () => {
    it("should return true for any value", () => {
      const rule = createAutocompleteRequiredRule({ required: false, multiple: false });
      expect(rule(undefined)).toBe(true);
      expect(rule(null)).toBe(true);
      expect(rule("")).toBe(true);
      expect(rule("value")).toBe(true);
    });

    it("should return true for arrays when multiple is false", () => {
      const rule = createAutocompleteRequiredRule({ required: false, multiple: false });
      expect(rule([])).toBe(true);
      expect(rule(["value"])).toBe(true);
    });
  });

  describe("when required is true and multiple is false", () => {
    it("should handle null values", () => {
      const rule = createAutocompleteRequiredRule({ required: true, multiple: false });
      expect(rule(null)).toBe("Campo obrigatório");
      expect(rule("valid")).toBe(true);
    });
  });

  describe("when required is true and multiple is true", () => {
    it("should handle non-array values as empty", () => {
      const rule = createAutocompleteRequiredRule({ required: true, multiple: true });
      // Non-array values are treated as empty arrays
      expect(rule(null)).toBe("Campo obrigatório");
      expect(rule(undefined)).toBe("Campo obrigatório");
      expect(rule("string")).toBe("Campo obrigatório");
      expect(rule(123 as any)).toBe("Campo obrigatório");
    });
  });
});
