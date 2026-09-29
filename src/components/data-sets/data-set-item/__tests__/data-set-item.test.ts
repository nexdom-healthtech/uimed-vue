import { VList, VListItem } from "vuetify/components";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import DataSetItem from "@/components/data-sets/data-set-item/data-set-item.vue";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const testId = "data-set-item-test-id";
const styleValue = "random-style";
const classValue = "random-class";

describe("DataSetItem", () => {
  it("should exist", () => {
    const wrapper = mountDataSetItem();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    const wrapper = mountDataSetItem();
    expect(findVListItem(wrapper).exists()).toBeTruthy();
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountDataSetItem();
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).not.toContain(classValue);
  });

  describe("props", () => {
    describe("dataTestid", () => {
      it("should forward to the v-list-item", () => {
        const wrapper = mountDataSetItem();
        expect(findVListItem(wrapper).attributes("data-testid")).toBe(testId);
      });

      it("should not set data-testid when undefined", () => {
        const wrapper = mountDataSetItem({ dataTestid: undefined });
        expect(findVListItem(wrapper).attributes("data-testid")).toBeUndefined();
      });
    });
  });

  describe("slots", () => {
    describe("default", () => {
      it("should forward the default slot content to the v-list-item", () => {
        const wrapper = mountDataSetItem();
        expect(findVListItem(wrapper).text()).toBe("Test Content");
      });
    });
  });

  describe("behavior", () => {
    it("should be announced as a list item inside a list", () => {
      const wrapper = mount(VList, {
        slots: { default: () => h(DataSetItem, null, () => "Test Content") },
        global: {
          plugins: [vueTestUtilsPluginUimed()],
        },
      });
      expect(wrapper.findComponent(VListItem).attributes("role")).toBe("listitem");
    });
  });
});

function mountDataSetItem(props: Record<string, unknown> = {}) {
  return mount(DataSetItem, {
    props: {
      dataTestid: testId,
      ...props,
    },
    attrs: {
      style: styleValue,
      class: classValue,
    },
    slots: {
      default: "Test Content",
    },
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findVListItem(wrapper: ReturnType<typeof mountDataSetItem>) {
  return wrapper.findComponent(VListItem);
}
