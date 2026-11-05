import { VTabsWindowItem } from "vuetify/components";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import TabsContent from "@/components/tabs/tabs-content.vue";
import TabsItem from "@/components/tabs/tabs-item.vue";
import type { TabsItemProps, TabsValue } from "@/components/tabs/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const testId = "tabs-item-test-id";
const styleValue = "random-style";
const classValue = "random-class";

describe("TabsItem", () => {
  it("should exist", () => {
    const wrapper = mountTabsItem({ value: "data" }, "data");
    expect(wrapper.findComponent(TabsItem).exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    const wrapper = mountTabsItem({ value: "data" }, "data");
    expect(findVTabsWindowItem(wrapper).exists()).toBeTruthy();
  });

  it('should inherit "data-testid" attribute on the v-tabs-window-item', () => {
    const wrapper = mountTabsItem({ value: "data" }, "data");
    expect(findVTabsWindowItem(wrapper).attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountTabsItem({ value: "data" }, "data");
    expect(findVTabsWindowItem(wrapper).attributes("style")).toBeUndefined();
    expect(findVTabsWindowItem(wrapper).classes()).not.toContain(classValue);
  });

  it("should have the role of a tab panel", () => {
    const wrapper = mountTabsItem({ value: "data" }, "data");
    expect(findVTabsWindowItem(wrapper).attributes("role")).toBe("tabpanel");
  });

  describe("props", () => {
    describe("value", () => {
      it("should forward to the underlying component", () => {
        const wrapper = mountTabsItem({ value: "data" });
        expect(findVTabsWindowItem(wrapper).props("value")).toBe("data");
      });

      it("should be displayed when its tab is selected", () => {
        const wrapper = mountTabsItem({ value: "data" }, "data");
        expect(wrapper.text()).toBe("Test Content");
      });

      it("should take its position as the value when not set", () => {
        const wrapper = mountTabsItem({}, 0);
        expect(findVTabsWindowItem(wrapper).props("value")).toBeUndefined();
        expect(wrapper.text()).toBe("Test Content");
      });
    });
  });

  describe("slots", () => {
    describe("default", () => {
      it("should render the content only when its tab is opened for the first time", async () => {
        const wrapper = mountTabsItem({ value: "data" }, "other");
        expect(wrapper.text()).toBe("");

        await wrapper.setProps({ modelValue: "data" });
        expect(wrapper.text()).toBe("Test Content");
      });

      it("should keep the content rendered, hidden, when another tab is selected", async () => {
        const wrapper = mountTabsItem({ value: "data" }, "data");
        await wrapper.setProps({ modelValue: "other" });
        await vi.runAllTimersAsync();

        expect(wrapper.text()).toBe("Test Content");
        expect((findVTabsWindowItem(wrapper).element as HTMLElement).style.display).toBe("none");
      });
    });
  });
});

/** Mounts the item inside a `UTabsContent`, where it must be placed. */
function mountTabsItem(props: TabsItemProps = {}, modelValue?: TabsValue) {
  return mount(TabsContent, {
    props: { modelValue },
    slots: {
      default: defineComponent({
        components: { TabsItem },
        setup: () => ({ props, testId, styleValue, classValue }),
        template: `
          <tabs-item
            v-bind="props"
            :data-testid="testId"
            :style="styleValue"
            :class="classValue"
          >Test Content</tabs-item>
        `,
      }),
    },
    global: {
      plugins: [vueTestUtilsPluginUimed()],
      stubs: { transition: false },
    },
  });
}

function findVTabsWindowItem(wrapper: ReturnType<typeof mountTabsItem>) {
  return wrapper.findComponent(VTabsWindowItem);
}
