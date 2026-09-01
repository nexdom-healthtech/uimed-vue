import { VForm } from "vuetify/components";
import { h, type VNode } from "vue";
import Frm from "@/components/frm/frm.vue";
import TextField from "@/components/inputs/text-field/text-field.vue";
import { flushPromises, mount } from "@vue/test-utils";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const testId = "frm-test-component";
const styleValue = "random-style";
const classValue = "random-class";

describe("Frm", () => {
  const wrapper = mountFrm();

  it("should exists", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    expect(wrapper.findComponent(VForm).exists()).toBeTruthy();
  });

  it('should inherit "data-testid" attribute', () => {
    expect(wrapper.attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).not.toBeUndefined();
    expect(wrapper.attributes("class")).not.toBe(classValue);
  });

  describe("events", () => {
    describe("submit", () => {
      it("should call the `onSubmit` handler when the form is submitted", async () => {
        const onSubmit = vi.fn();
        const wrapper = mountFrm({}, { onSubmit });

        await wrapper.trigger("submit");

        expect(onSubmit).toHaveBeenCalledOnce();
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ defaultPrevented: true }));
      });

      it("shouldn't call the `onSubmit` handler when the form contains invalid fields", async () => {
        const onSubmit = vi.fn();
        const wrapper = mountFrm({ default: () => h(TextField, { required: true }) }, { onSubmit });

        await wrapper.trigger("submit");
        await flushPromises();

        const textField = wrapper.findComponent(TextField);
        expect(textField.exists()).toBeTruthy();
        expect(textField.props("required")).toBe(true);
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });
  });
});

function mountFrm(slots: Record<string, () => VNode> = {}, attrs: Record<string, unknown> = {}) {
  return mount(Frm, {
    attrs: {
      "data-testid": testId,
      style: styleValue,
      class: classValue,
      ...attrs,
    },
    slots,
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}
