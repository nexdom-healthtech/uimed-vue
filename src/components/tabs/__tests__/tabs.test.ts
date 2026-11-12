import { VSlideGroup, VTab, VTabs, VTabsWindow } from "vuetify/components";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import Tabs from "@/components/tabs/tabs.vue";
import type { TabsItem, TabsValue } from "@/components/tabs/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const testId = "tabs-test-id";
const styleValue = "random-style";
const classValue = "random-class";

const items: TabsItem[] = [
  { title: "Dados", value: "data" },
  { title: "Endereço", value: "address" },
  { title: "Contato", value: "contact" },
];

describe("Tabs", () => {
  it("should exist", () => {
    const wrapper = mountTabs();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component, without a window of its own", () => {
    const wrapper = mountTabs();
    expect(findVTabs(wrapper).exists()).toBeTruthy();
    expect(wrapper.findComponent(VTabsWindow).exists()).toBeFalsy();
  });

  it('should inherit "data-testid" attribute on the v-tabs', () => {
    const wrapper = mountTabs();
    expect(findVTabs(wrapper).attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountTabs();
    expect(findVTabs(wrapper).attributes("style")).toBeUndefined();
    expect(findVTabs(wrapper).classes()).not.toContain(classValue);
  });

  describe("props", () => {
    describe("items", () => {
      it("should render a tab with the title and value of each item", () => {
        const wrapper = mountTabs();
        const tabs = findVTabList(wrapper);

        expect(tabs.map((tab) => tab.text())).toEqual(["Dados", "Endereço", "Contato"]);
        expect(tabs.map((tab) => tab.props("value"))).toEqual(["data", "address", "contact"]);
      });

      it("should render the tabs with the role of tabs, in a tab list", () => {
        const wrapper = mountTabs();

        expect(findVTabs(wrapper).attributes("role")).toBe("tablist");
        for (const tab of findVTabList(wrapper)) {
          expect(tab.attributes("role")).toBe("tab");
        }
      });

      it("should leave the value of the tabs unset when the items have none", () => {
        const wrapper = mountTabs({ items: [{ title: "Dados" }, { title: "Endereço" }] });

        expect(findVTabList(wrapper).map((tab) => tab.props("value"))).toEqual([
          undefined,
          undefined,
        ]);
      });

      it("should update the tabs when the items change", async () => {
        const wrapper = mountTabs();
        await wrapper.setProps({ items: [{ title: "Outra", value: "other" }] });

        expect(findVTabList(wrapper).map((tab) => tab.text())).toEqual(["Outra"]);
      });
    });

    describe("modelValue", () => {
      it("should select the tab of the given value", async () => {
        const wrapper = mountTabs({ modelValue: "address" });
        await nextTick();

        expect(getSelectedStates(wrapper)).toEqual(["false", "true", "false"]);
      });

      it("should select the first tab when empty, emitting its value", async () => {
        const wrapper = mountTabs();
        await vi.runAllTimersAsync();

        expect(getSelectedStates(wrapper)).toEqual(["true", "false", "false"]);
        expect(wrapper.emitted("update:modelValue")).toEqual([["data"]]);
      });

      it("should emit the position of the first tab when the items have no value", async () => {
        const wrapper = mountTabs({ items: [{ title: "Dados" }, { title: "Endereço" }] });
        await vi.runAllTimersAsync();

        expect(wrapper.emitted("update:modelValue")).toEqual([[0]]);
      });

      it("should select another tab when it changes", async () => {
        const wrapper = mountTabs({ modelValue: "data" });
        await wrapper.setProps({ modelValue: "contact" });
        await nextTick();

        expect(getSelectedStates(wrapper)).toEqual(["false", "false", "true"]);
      });
    });
  });

  describe("behavior", () => {
    it("should emit the value of a tab when it's clicked", async () => {
      const wrapper = mountTabs({ modelValue: "data" });
      await findVTabList(wrapper)[2]!.trigger("click");

      expect(wrapper.emitted("update:modelValue")).toEqual([["contact"]]);
    });

    it("should emit the position of a tab without value when it's clicked", async () => {
      const wrapper = mountTabs({
        items: [{ title: "Dados" }, { title: "Endereço" }],
        modelValue: 0,
      });
      await findVTabList(wrapper)[1]!.trigger("click");

      expect(wrapper.emitted("update:modelValue")).toEqual([[1]]);
    });

    it("should color only the selected tab with the tertiary's text shade", async () => {
      const wrapper = mountTabs({ modelValue: "address" });
      await nextTick();

      expect(findVTabList(wrapper).map((tab) => tab.classes("text-tertiary-text"))).toEqual([
        false,
        true,
        false,
      ]);
    });

    it("should move the focus with the arrow keys, without selecting the tabs", async () => {
      const wrapper = mountTabs({ modelValue: "data" }, true);
      const tabs = findVTabList(wrapper).map((tab) => tab.element as HTMLElement);
      tabs[0]!.focus();

      await findVTabList(wrapper)[0]!.trigger("keydown", { key: "ArrowRight" });
      expect(document.activeElement).toBe(tabs[1]);

      await findVTabList(wrapper)[1]!.trigger("keydown", { key: "End" });
      expect(document.activeElement).toBe(tabs[2]);

      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
      expect(getSelectedStates(wrapper)).toEqual(["true", "false", "false"]);
      wrapper.unmount();
    });
  });
});

function mountTabs(props: { items?: TabsItem[]; modelValue?: TabsValue } = {}, attachTo?: boolean) {
  return mount(Tabs, {
    props: { items, ...props },
    attrs: {
      "data-testid": testId,
      style: styleValue,
      class: classValue,
    },
    attachTo: attachTo ? document.body : undefined,
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

/** The tab list, which `v-tabs` renders as a slide group, next to its unused window */
function findVTabs(wrapper: ReturnType<typeof mountTabs>) {
  return wrapper.findComponent(VTabs).findComponent(VSlideGroup);
}

function findVTabList(wrapper: ReturnType<typeof mountTabs>) {
  return wrapper.findAllComponents(VTab);
}

function getSelectedStates(wrapper: ReturnType<typeof mountTabs>) {
  return findVTabList(wrapper).map((tab) => tab.attributes("aria-selected"));
}
