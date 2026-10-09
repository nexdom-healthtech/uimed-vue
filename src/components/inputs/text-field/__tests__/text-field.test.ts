import { email, phone, required, url } from "@/composables/inputs/rules.ts";
import TextField from "@/components/inputs/text-field/text-field.vue";
import type { TextFieldType, TextFieldVariant } from "@/components/inputs/text-field/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import { mount } from "@vue/test-utils";
import { VTextField } from "vuetify/components";
import type { Rule } from "@/composables/inputs/types.ts";
import { nextTick } from "vue";

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

const ruledTypes: [TextFieldType, Rule][] = [
  ["phone", phone],
  ["email", email],
  ["url", url],
];

const unruledTypes = types.filter(
  ([type]) => !ruledTypes.some(([ruledType]) => ruledType === type),
);

const testId = "button-test-id";
const styleValue = "random-style";
const classValue = "random-class";

describe("TextField", () => {
  it("should exists", () => {
    const wrapper = mountTextField();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    const wrapper = mountTextField();
    expect(wrapper.findComponent(VTextField).exists()).toBeTruthy();
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

      it.each(ruledTypes)('should apply rule for type "%s"', async (type, rule) => {
        const wrapper = mountTextField();
        await wrapper.setProps({ type });

        const vTextField = findVTextField(wrapper);

        expect(vTextField.props("rules")).toHaveLength(1);
        expect(vTextField.props("rules")).toContain(rule);
      });

      it.each(unruledTypes)(`shouldn't apply rule for type "%s"`, async (type) => {
        const wrapper = mountTextField();
        await wrapper.setProps({ type });

        const vTextField = findVTextField(wrapper);

        expect(vTextField.props("rules")).toHaveLength(0);
      });

      it("should use text with clearable for search", async () => {
        const wrapper = mountTextField();
        const vTextField = findVTextField(wrapper);
        expect(wrapper.find(".v-field__append-inner .v-icon").exists()).toBe(false);
        expect(vTextField.props("clearable")).toBeFalsy();

        await wrapper.setProps({ type: "search" });

        expect(vTextField.props("type")).toBe("text");
        expect(wrapper.find(".v-field__append-inner .mdi-magnify").exists()).toBe(true);
        expect(vTextField.props("clearable")).toBeTruthy();
      });

      it("should default to text type when not set", () => {
        const wrapper = mountTextField();
        expect(wrapper.findComponent(VTextField).props("type")).toBe("text");
      });

      describe("password toggle", () => {
        it.each(types.filter(([type]) => type !== "password"))(
          'should not render the toggle for type "%s"',
          async (type) => {
            const wrapper = mountTextField();
            await wrapper.setProps({ type });

            expect(findPasswordToggle(wrapper).exists()).toBe(false);
          },
        );

        it("should keep the search icon decorative and out of the tab order", async () => {
          const wrapper = mountTextField();
          await wrapper.setProps({ type: "search" });

          const icon = wrapper.find(".v-field__append-inner .v-icon");
          expect(icon.classes()).toContain("mdi-magnify");
          expect(icon.attributes("aria-hidden")).toBe("true");
          expect(icon.attributes("role")).toBeUndefined();
          expect(icon.attributes("tabindex")).toBeUndefined();
          expect(icon.attributes("aria-label")).toBeUndefined();
          expect(findPasswordToggle(wrapper).exists()).toBe(false);
        });

        it("should render a labeled, unpressed toggle with the show icon for password", async () => {
          const wrapper = mountTextField();
          await wrapper.setProps({ type: "password" });

          const toggle = findPasswordToggle(wrapper);
          expect(toggle.classes()).toContain("v-icon");
          expect(toggle.element.parentElement?.classList).toContain("v-field__append-inner");
          expect(toggle.attributes("aria-label")).toBe("Mostrar senha");
          expect(toggle.attributes("aria-pressed")).toBe("false");
          expect(toggle.attributes("aria-hidden")).toBe("false");
          expect(toggle.attributes("tabindex")).toBe("0");
          expect(toggle.classes()).toContain("mdi-eye");
        });

        it.each(["Enter", " "])('should toggle the password on "%s"', async (key) => {
          const wrapper = mountTextField();
          await wrapper.setProps({ type: "password" });

          await findPasswordToggle(wrapper).trigger("keydown", { key });

          expect(wrapper.find("input").attributes("type")).toBe("text");
          expect(findPasswordToggle(wrapper).attributes("aria-pressed")).toBe("true");
        });

        it("should show and hide the password when clicked", async () => {
          const wrapper = mountTextField();
          await wrapper.setProps({ type: "password", modelValue: "segredo" });

          await findPasswordToggle(wrapper).trigger("click");

          expect(findVTextField(wrapper).props("type")).toBe("text");
          expect(wrapper.find("input").attributes("type")).toBe("text");
          expect(findPasswordToggle(wrapper).attributes("aria-pressed")).toBe("true");
          expect(findPasswordToggle(wrapper).attributes("aria-label")).toBe("Mostrar senha");
          expect(findPasswordToggle(wrapper).classes()).toContain("mdi-eye-off");

          await findPasswordToggle(wrapper).trigger("click");

          expect(wrapper.find("input").attributes("type")).toBe("password");
          expect(findPasswordToggle(wrapper).attributes("aria-pressed")).toBe("false");
          expect(findPasswordToggle(wrapper).classes()).toContain("mdi-eye");
          expect(wrapper.props("modelValue")).toBe("segredo");
        });

        it("should hide the password again when the type changes away from and back to password", async () => {
          const wrapper = mountTextField();
          await wrapper.setProps({ type: "password" });
          await findPasswordToggle(wrapper).trigger("click");

          await wrapper.setProps({ type: "text" });
          expect(wrapper.find("input").attributes("type")).toBe("text");
          expect(findPasswordToggle(wrapper).exists()).toBe(false);

          await wrapper.setProps({ type: "password" });
          expect(wrapper.find("input").attributes("type")).toBe("password");
          expect(findPasswordToggle(wrapper).attributes("aria-pressed")).toBe("false");
        });

        it("should disable the toggle when disabled, keeping the password hidden", async () => {
          const wrapper = mountTextField();
          await wrapper.setProps({ type: "password", disabled: true });

          const toggle = findPasswordToggle(wrapper);
          expect(toggle.classes()).toContain("v-icon--disabled");
          expect(toggle.attributes("tabindex")).toBe("-1");

          await toggle.trigger("click");
          expect(wrapper.find("input").attributes("type")).toBe("password");

          await toggle.trigger("keydown", { key: "Enter" });
          expect(wrapper.find("input").attributes("type")).toBe("password");
        });

        it("should keep the toggle active when readonly or loading", async () => {
          const wrapper = mountTextField();
          await wrapper.setProps({ type: "password", readonly: true, loading: true });

          const toggle = findPasswordToggle(wrapper);
          expect(toggle.classes()).not.toContain("v-icon--disabled");
          expect(toggle.attributes("tabindex")).toBe("0");

          await toggle.trigger("click");
          expect(wrapper.find("input").attributes("type")).toBe("text");
        });

        it("should keep the password visible when the field is cleared", async () => {
          const wrapper = mountTextField();
          await wrapper.setProps({ type: "password", clearable: true, modelValue: "segredo" });
          await findPasswordToggle(wrapper).trigger("click");

          findVTextField(wrapper).vm.$emit("click:clear");
          await nextTick();

          expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([""]);
          expect(wrapper.find("input").attributes("type")).toBe("text");
          expect(findPasswordToggle(wrapper).attributes("aria-pressed")).toBe("true");
        });
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

    describe("clearable", () => {
      it("should change modelValue to empty string when cleared", async () => {
        const modelValue = "Testing...";

        const wrapper = mountTextField();
        await wrapper.setProps({ clearable: true, modelValue });

        expect(wrapper.props("modelValue")).toBe(modelValue);

        const vTextField = findVTextField(wrapper);
        vTextField.vm.$emit("click:clear");

        expect(wrapper.emitted("update:modelValue")).toBeTruthy();
        expect(wrapper.emitted("update:modelValue")).toHaveLength(1);
        expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([""]);
      });

      it("should label the clear icon in pt-BR for screen readers", async () => {
        const wrapper = mountTextField();
        await wrapper.setProps({ clearable: true, label: "Nome", modelValue: "Maria" });

        expect(wrapper.find(".v-field__clearable .v-icon").attributes("aria-label")).toBe(
          "Limpar Nome",
        );
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

      it("should hide the loading indicator from assistive technologies and mark the field as busy", async () => {
        const wrapper = mountTextField();
        await wrapper.setProps({ loading: true });

        expect(wrapper.find(".v-field").classes()).toContain("v-field--loading");
        expect(wrapper.find("[role='progressbar']").attributes("aria-hidden")).toBe("true");
        expect(wrapper.find("input").attributes("aria-busy")).toBe("true");
      });

      it("should keep the loading indicator inactive and the field not busy by default", () => {
        const wrapper = mountTextField();

        expect(wrapper.find(".v-field").classes()).not.toContain("v-field--loading");
        expect(wrapper.find("input").attributes("aria-busy")).toBeUndefined();
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

function findPasswordToggle(wrapper: ReturnType<typeof mountTextField>) {
  return wrapper.find("[role='button'][aria-label='Mostrar senha']");
}
