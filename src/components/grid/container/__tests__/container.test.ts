import { VContainer } from "vuetify/components";
import Container from "@/components/grid/container/container.vue";
import { mount } from "@vue/test-utils";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const testId = "container-test-component";
const styleValue = "random-style";
const classValue = "random-class";

describe("Container", () => {
  const wrapper = mountContainer();

  it("should exists", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should use fluid container", () => {
    const vContainer = findVContainer(wrapper);
    expect(vContainer.exists()).toBeTruthy();
    expect(vContainer.props("fluid")).toBeTruthy();
  });

  describe("fullHeight", () => {
    it("should not stretch the container by default", () => {
      expect(wrapper.classes()).not.toContain("h-100");
    });

    it('should add "h-100" when true', async () => {
      const container = mountContainer();
      await container.setProps({ fullHeight: true });
      expect(container.classes()).toContain("h-100");

      await container.setProps({ fullHeight: false });
      expect(container.classes()).not.toContain("h-100");
    });
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

function mountContainer() {
  return mount(Container, {
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

function findVContainer(wrapper: ReturnType<typeof mountContainer>) {
  return wrapper.findComponent(VContainer);
}
