import { VApp } from "vuetify/components";
import Root from "@/components/root/root.vue";
import { mount } from "@vue/test-utils";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const testId = "root-test-component";
const styleValue = "random-style";
const classValue = "random-class";

describe("root", () => {
  const wrapper = mountRoot();

  it("should exists", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should contain primary component", () => {
    expect(wrapper.findComponent(VApp).exists()).toBe(true);
  });

  it('should inherit "data-testid" attribute', () => {
    expect(wrapper.attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).not.toBeUndefined();
    expect(wrapper.attributes("class")).not.toBe(classValue);
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
