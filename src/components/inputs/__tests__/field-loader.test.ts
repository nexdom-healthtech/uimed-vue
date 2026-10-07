import { mount } from "@vue/test-utils";
import { VProgressLinear } from "vuetify/components";
import FieldLoader from "@/components/inputs/field-loader.vue";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

describe("FieldLoader", () => {
  it("should render an indeterminate bar as thin as the default one", () => {
    const progress = findProgress(mountFieldLoader({ isActive: true }));
    expect(progress.props("indeterminate")).toBe(true);
    expect(progress.props("height")).toBe("2");
  });

  it("should hide the bar from assistive technologies", () => {
    const progress = findProgress(mountFieldLoader({ isActive: true }));
    expect(progress.attributes("aria-hidden")).toBe("true");
  });

  it("should forward isActive and color to the bar", () => {
    const progress = findProgress(mountFieldLoader({ isActive: true, color: "error" }));
    expect(progress.props("active")).toBe(true);
    expect(progress.props("color")).toBe("error");
  });

  it("should keep the bar inactive and without color by default", () => {
    const progress = findProgress(mountFieldLoader({ isActive: false }));
    expect(progress.props("active")).toBe(false);
    expect(progress.props("color")).toBeUndefined();
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountFieldLoader({ isActive: true }, { class: "random-class" });
    expect(wrapper.classes()).not.toContain("random-class");
  });
});

function mountFieldLoader(
  props: { isActive: boolean; color?: string },
  attrs: Record<string, unknown> = {},
) {
  return mount(FieldLoader, {
    props,
    attrs,
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findProgress(wrapper: ReturnType<typeof mountFieldLoader>) {
  return wrapper.findComponent(VProgressLinear);
}
