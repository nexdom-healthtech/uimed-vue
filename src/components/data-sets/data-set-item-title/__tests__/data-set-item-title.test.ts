import { VListItemTitle } from "vuetify/components";
import { mount } from "@vue/test-utils";
import DataSetItemTitle from "@/components/data-sets/data-set-item-title/data-set-item-title.vue";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const testId = "data-set-item-title-test-id";
const styleValue = "random-style";
const classValue = "random-class";

describe("DataSetItemTitle", () => {
  it("should exist", () => {
    const wrapper = mountDataSetItemTitle();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    const wrapper = mountDataSetItemTitle();
    expect(findVListItemTitle(wrapper).exists()).toBeTruthy();
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountDataSetItemTitle();
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).not.toContain(classValue);
  });

  describe("props", () => {
    describe("title", () => {
      it("should render the title text", () => {
        const wrapper = mountDataSetItemTitle({ title: "Test Title" });
        expect(findVListItemTitle(wrapper).text()).toBe("Test Title");
      });

      it("should render an empty title when not set", () => {
        const wrapper = mountDataSetItemTitle();
        expect(findVListItemTitle(wrapper).exists()).toBeTruthy();
        expect(findVListItemTitle(wrapper).text()).toBe("");
      });
    });

    describe("dataTestid", () => {
      it("should forward to the v-list-item-title", () => {
        const wrapper = mountDataSetItemTitle();
        expect(findVListItemTitle(wrapper).attributes("data-testid")).toBe(testId);
      });

      it("should not set data-testid when undefined", () => {
        const wrapper = mountDataSetItemTitle({ dataTestid: undefined });
        expect(findVListItemTitle(wrapper).attributes("data-testid")).toBeUndefined();
      });
    });
  });

  describe("slots", () => {
    describe("default", () => {
      it("should render the default slot content as the title", () => {
        const wrapper = mountDataSetItemTitle({}, { default: "Slot Title" });
        expect(findVListItemTitle(wrapper).text()).toBe("Slot Title");
      });

      it("should replace the title prop with the default slot content", () => {
        const wrapper = mountDataSetItemTitle({ title: "Test Title" }, { default: "Slot Title" });
        expect(findVListItemTitle(wrapper).text()).toBe("Slot Title");
      });
    });
  });
});

function mountDataSetItemTitle(
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {},
) {
  return mount(DataSetItemTitle, {
    props: {
      dataTestid: testId,
      ...props,
    },
    attrs: {
      style: styleValue,
      class: classValue,
    },
    slots,
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findVListItemTitle(wrapper: ReturnType<typeof mountDataSetItemTitle>) {
  return wrapper.findComponent(VListItemTitle);
}
