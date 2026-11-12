import { VTabsWindow, VTabsWindowItem } from "vuetify/components";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import TabsContent from "@/components/tabs/tabs-content.vue";
import TabsItem from "@/components/tabs/tabs-item.vue";
import type { TabsValue } from "@/components/tabs/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const testId = "tabs-content-test-id";
const styleValue = "random-style";
const classValue = "random-class";

describe("TabsContent", () => {
  it("should exist", () => {
    const wrapper = mountTabsContent();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component, with its items inside", () => {
    const wrapper = mountTabsContent();
    expect(findVTabsWindow(wrapper).exists()).toBeTruthy();
    expect(findVTabsWindow(wrapper).findAllComponents(VTabsWindowItem)).toHaveLength(2);
  });

  it('should inherit "data-testid" attribute on the v-tabs-window', () => {
    const wrapper = mountTabsContent();
    expect(findVTabsWindow(wrapper).attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountTabsContent();
    expect(findVTabsWindow(wrapper).attributes("style")).toBeUndefined();
    expect(findVTabsWindow(wrapper).classes()).not.toContain(classValue);
  });

  describe("props", () => {
    describe("modelValue", () => {
      it("should display the item of the given value", () => {
        const wrapper = mountTabsContent("address");

        expect(wrapper.text()).toBe("Endereço");
      });

      it("should display another item when it changes", async () => {
        const wrapper = mountTabsContent("data");
        await wrapper.setProps({ modelValue: "address" });
        await vi.runAllTimersAsync();

        expect(findVisibleItems(wrapper).map((item) => item.text())).toEqual(["Endereço"]);
      });

      // The content never changes its item by itself (the UTabs changes the selection): this covers
      // the v-model contract
      it("should emit the value the window selects", async () => {
        const wrapper = mountTabsContent("data");
        findVTabsWindow(wrapper).vm.$emit("update:modelValue", "address");
        await nextTick();

        expect(wrapper.emitted("update:modelValue")).toEqual([["address"]]);
      });

      it("should display no item when empty", () => {
        const wrapper = mountTabsContent();

        expect(wrapper.text()).toBe("");
      });
    });
  });
});

const items = {
  components: { TabsItem },
  template: `
    <tabs-item value="data">Dados</tabs-item>
    <tabs-item value="address">Endereço</tabs-item>
  `,
};

function mountTabsContent(modelValue?: TabsValue) {
  return mount(TabsContent, {
    props: { modelValue },
    attrs: {
      "data-testid": testId,
      style: styleValue,
      class: classValue,
    },
    slots: { default: items },
    global: {
      plugins: [vueTestUtilsPluginUimed()],
      stubs: { transition: false },
    },
  });
}

function findVTabsWindow(wrapper: ReturnType<typeof mountTabsContent>) {
  return wrapper.findComponent(VTabsWindow);
}

function findVisibleItems(wrapper: ReturnType<typeof mountTabsContent>) {
  return wrapper
    .findAllComponents(VTabsWindowItem)
    .filter((item) => (item.element as HTMLElement).style.display !== "none");
}
