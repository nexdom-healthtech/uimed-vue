import BackToTop from "@/components/main/back-to-top.vue";
import { icons } from "@/consts/icons.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import { VApp, VBtn, VFab, VIcon } from "vuetify/components";

describe("BackToTop", () => {
  it("should render a tertiary floating button at the bottom end of the app's layout", () => {
    const fab = mountBackToTop().findComponent(VFab);

    expect(fab.props("color")).toBe("tertiary");
    expect(fab.props("location")).toBe("bottom end");
    expect(fab.props("app")).toBe(true);
  });

  it("should show an up arrow as a round icon button", () => {
    const wrapper = mountBackToTop();

    expect(wrapper.findComponent(VFab).props("icon")).toBe(icons.backToTop);
    expect(wrapper.findComponent(VIcon).props("icon")).toBe(icons.backToTop);
  });

  it("should name the button for screen readers only", () => {
    const name = mountBackToTop().findComponent(VBtn).find(".d-sr-only");

    expect(name.text()).toBe("Retornar ao topo");
  });

  it.each([true, false])("should forward active (%s) to the floating button", (active) => {
    expect(mountBackToTop(active).findComponent(VFab).props("active")).toBe(active);
  });

  it("should emit click when the button is clicked", async () => {
    const wrapper = mountBackToTop();

    await wrapper.findComponent(VBtn).trigger("click");

    expect(wrapper.findComponent(BackToTop).emitted("click")).toEqual([[]]);
  });
});

function mountBackToTop(active = true) {
  // The floating button takes its place in the layout of an app
  return mount(VApp, {
    slots: { default: () => h(BackToTop, { active }) },
    global: { plugins: [vueTestUtilsPluginUimed()] },
  });
}
