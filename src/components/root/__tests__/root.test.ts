import { VApp, VMain } from "vuetify/components";
import Root from "@/components/root/root.vue";
import { mount } from "@vue/test-utils";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import { Container } from "@/components/index.ts";
import Toast from "@/components/dialogs/toast.vue";

const testId = "root-test-component";
const styleValue = "random-style";
const classValue = "random-class";

describe("Root", () => {
  const wrapper = mountRoot();

  it("should exists", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary components", () => {
    expect(wrapper.findComponent(VApp).exists()).toBeTruthy();
    expect(wrapper.findComponent(VMain).exists()).toBeTruthy();
    expect(wrapper.findComponent(Container).exists()).toBeTruthy();
  });

  it("should contain toast component", () => {
    const toast = wrapper.findComponent(Toast);
    expect(toast.exists()).toBeTruthy();
  });

  it('should inherit "data-testid" attribute', () => {
    expect(wrapper.attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).not.toBeUndefined();
    expect(wrapper.attributes("class")).not.toContain(classValue);
  });
});

function mountRoot() {
  return mount(Root, {
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
