import Checkbox from "@/components/inputs/checkbox/checkbox.vue";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import { mount } from "@vue/test-utils";
import type { ComponentProps } from "vue-component-type-helpers";
import { VCheckboxBtn } from "vuetify/components";

const testId = "checkbox-test-id";
const styleValue = "random-style";
const classValue = "random-class";

describe("Checkbox", () => {
  it("should exists", () => {
    const wrapper = mountCheckbox();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    const wrapper = mountCheckbox();
    const vCheckbox = findVCheckbox(wrapper);
    expect(vCheckbox.exists()).toBeTruthy();
    expect(vCheckbox.attributes("class")).toContain("flex-0-1");
  });

  it('should inherit "data-testid" attribute', () => {
    const wrapper = mountCheckbox();
    expect(wrapper.attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountCheckbox();
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).not.toBeUndefined();
    expect(wrapper.attributes("class")).not.toContain(classValue);
  });

  describe("props", () => {
    describe("label", () => {
      it("should forward to the underlying component", async () => {
        const label = "Aceito os termos";
        const wrapper = mountCheckbox();
        await wrapper.setProps({ label });

        expect(findVCheckbox(wrapper).props("label")).toBe(label);
      });
    });

    describe("disabled and readonly", () => {
      it("should forward to the underlying component", async () => {
        const wrapper = mountCheckbox();
        await wrapper.setProps({ disabled: true, readonly: true });

        const vCheckbox = findVCheckbox(wrapper);
        expect(vCheckbox.props("disabled")).toBe(true);
        expect(vCheckbox.props("readonly")).toBe(true);
      });

      it("should be false by default", () => {
        const wrapper = mountCheckbox();
        const vCheckbox = findVCheckbox(wrapper);

        expect(vCheckbox.props("disabled")).toBe(false);
        expect(vCheckbox.props("readonly")).toBe(false);
      });
    });

    describe("trueValue and falseValue", () => {
      it("should forward custom values to the underlying component", async () => {
        const wrapper = mountCheckbox();
        await wrapper.setProps({ trueValue: "yes", falseValue: "no" });

        const vCheckbox = findVCheckbox(wrapper);
        expect(vCheckbox.props("trueValue")).toBe("yes");
        expect(vCheckbox.props("falseValue")).toBe("no");
      });

      it("should toggle modelValue to true/false by default when unset", async () => {
        const wrapper = mountCheckbox();
        const vCheckbox = findVCheckbox(wrapper);

        await vCheckbox.setValue(true);

        expect(wrapper.emitted("update:modelValue")).toBeTruthy();
        expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([true]);
      });
    });

    describe("modelValue", () => {
      it("should update modelValue when checkbox is toggled", async () => {
        const wrapper = mountCheckbox();
        expect(wrapper.props("modelValue")).toBe(false);

        const vCheckbox = findVCheckbox(wrapper);

        await vCheckbox.setValue(true);
        expect(wrapper.emitted("update:modelValue")).toBeTruthy();
        expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([true]);

        await vCheckbox.setValue(false);
        expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([false]);
      });

      it("should respect custom true/false values in props", async () => {
        const wrapper = mountCheckbox({ modelValue: "no", trueValue: "yes", falseValue: "no" });
        expect(wrapper.props("modelValue")).toBe("no");

        const vCheckbox = findVCheckbox(wrapper);
        expect(vCheckbox.props("trueValue")).toBe("yes");
        expect(vCheckbox.props("falseValue")).toBe("no");
        expect(vCheckbox.props("modelValue")).toBe("no");

        await vCheckbox.setValue("yes");
        expect(vCheckbox.props("modelValue")).toBe("yes");
        expect(wrapper.emitted("update:modelValue")).toBeTruthy();
        expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["yes"]);
      });
    });
  });
});

function mountCheckbox(props?: ComponentProps<typeof Checkbox>) {
  return mount(Checkbox, {
    props,
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

function findVCheckbox(wrapper: ReturnType<typeof mountCheckbox>) {
  return wrapper.findComponent(VCheckboxBtn);
}
