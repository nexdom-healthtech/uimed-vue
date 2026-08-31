import { required } from "@/components/text-field/rules.ts";
import TextField from "@/components/text-field/text-field.vue";
import type { TextFieldType, TextFieldVariant } from "@/components/text-field/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import { mount } from "@vue/test-utils";
import { VTextField } from "vuetify/components";

const variants: [TextFieldVariant, string][] = [
  ["primary", "underlined"],
  ["secondary", "outlined"],
];

const types: [TextFieldType, string][] = [
  ["text", "text"],
  ["phone", "tel"],
  ["email", "email"],
  ["url", "url"],
  ["password", "password"],
  ["search", "text"],
];

const testId = "button-test-id";
const styleValue = "random-style";
const classValue = "random-class";

describe("TextField", () => {
  it("should exists", () => {
    const wrapper = mountTextField();
    expect(wrapper.exists()).toBe(true);
  });

  it("should contain primary component", () => {
    const wrapper = mountTextField();
    expect(wrapper.findComponent(VTextField).exists()).toBe(true);
  });

  it('should inherit "data-testid" attribute', () => {
    const wrapper = mountTextField();
    expect(wrapper.attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountTextField();
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).not.toBeUndefined();
    expect(wrapper.attributes("class")).not.toContain(classValue);
  });

  describe("props", () => {
    describe("variant", () => {
      it.each(variants)(
        'should forward `variant="%s"` to Vuetify\'s `%s` variant',
        async (variant, vuetifyVariant) => {
          const wrapper = mountTextField();
          await wrapper.setProps({ variant });

          expect(wrapper.findComponent(VTextField).props("variant")).toBe(vuetifyVariant);
        },
      );

      it("should default to the underlined variant when not set", () => {
        const wrapper = mountTextField();
        expect(wrapper.findComponent(VTextField).props("variant")).toBe("underlined");
      });
    });

    describe("type", () => {
      it.each(types)('should forward `type="%s"` to HTML\'s `%s` type', async (type, htmlType) => {
        const wrapper = mountTextField();
        await wrapper.setProps({ type });

        expect(wrapper.findComponent(VTextField).props("type")).toBe(htmlType);
      });

      // TODO: add validation according to types

      it("should use text with clearable for search", async () => {
        const wrapper = mountTextField();
        await wrapper.setProps({ type: "search" });

        const vTextField = findVTextField(wrapper);
        expect(vTextField.props("type")).toBe("text");
        expect(vTextField.props("clearable")).toBeTruthy();
      });

      it("should default to text type when not set", () => {
        const wrapper = mountTextField();
        expect(wrapper.findComponent(VTextField).props("type")).toBe("text");
      });
    });

    describe("required", () => {
      it("should generate rule to underlying component", async () => {
        const wrapper = mountTextField();
        await wrapper.setProps({ required: true });

        const vTextField = findVTextField(wrapper);

        expect(vTextField.props("rules")).toHaveLength(1);
        expect(vTextField.props("rules")).toContain(required);
      });

      it("shouldn't change rules by default", () => {
        const wrapper = mountTextField();
        const vTextField = findVTextField(wrapper);

        expect(vTextField.props("rules")).toHaveLength(0);
      });
    });

    describe("disabled, loading, clearable and readonly", () => {
      it("should forward to the underlying component", async () => {
        const wrapper = mountTextField();
        await wrapper.setProps({ disabled: true, loading: true, clearable: true, readonly: true });

        const vTextField = findVTextField(wrapper);

        expect(vTextField.props("disabled")).toBe(true);
        expect(vTextField.props("loading")).toBe(true);
        expect(vTextField.props("clearable")).toBe(true);
        expect(vTextField.props("readonly")).toBe(true);
      });

      it("should be false by default", () => {
        const wrapper = mountTextField();
        const vTextField = findVTextField(wrapper);

        expect(vTextField.props("disabled")).toBe(false);
        expect(vTextField.props("loading")).toBe(false);
        expect(vTextField.props("clearable")).toBe(false);
        expect(vTextField.props("readonly")).toBe(false);
      });
    });

    describe("label, placeholder and hint", () => {
      it("should forward to the underlying component", async () => {
        const label = "Label";
        const placeholder = "Placeholder";
        const hint = "Hint";

        const wrapper = mountTextField();
        await wrapper.setProps({ label, placeholder, hint });

        const vTextField = findVTextField(wrapper);

        expect(vTextField.props("label")).toBe(label);
        expect(vTextField.props("placeholder")).toBe(placeholder);
        expect(vTextField.props("hint")).toBe(hint);
      });
    });

    describe("modelValue", () => {
      it("should sync prop and input value", async () => {
        const value1 = "first";
        const modelValue = value1;

        const wrapper = mountTextField();
        await wrapper.setProps({ modelValue });

        const vTextField = findVTextField(wrapper);

        expect(vTextField.props("modelValue")).toBe(value1);

        const value2 = "second";
        await vTextField.setValue(value2);
        expect(wrapper.emitted("update:modelValue")).toBeTruthy();
        expect(wrapper.emitted("update:modelValue")).toHaveLength(1);
        expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([value2]);
      });

      it("should be an empty string by default", () => {
        const wrapper = mountTextField();
        const vTextField = findVTextField(wrapper);

        expect(wrapper.props("modelValue")).toBe("");
        expect(vTextField.props("modelValue")).toBe("");
      });
    });
  });
});

function mountTextField() {
  return mount(TextField, {
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

function findVTextField(wrapper: ReturnType<typeof mountTextField>) {
  return wrapper.findComponent(VTextField);
}
