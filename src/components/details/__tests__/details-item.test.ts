import { VExpansionPanel, VExpansionPanelText, VExpansionPanelTitle } from "vuetify/components";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import Details from "@/components/details/details.vue";
import DetailsItem from "@/components/details/details-item.vue";
import type { DetailsItemProps } from "@/components/details/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const testId = "details-item-test-id";
const styleValue = "random-style";
const classValue = "random-class";

describe("DetailsItem", () => {
  it("should exist", () => {
    const wrapper = mountDetailsItem();
    expect(findDetailsItem(wrapper).exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    const wrapper = mountDetailsItem();
    expect(findVExpansionPanel(wrapper).exists()).toBeTruthy();
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountDetailsItem();
    expect(findVExpansionPanel(wrapper).attributes("style")).toBeUndefined();
    expect(findVExpansionPanel(wrapper).classes()).not.toContain(classValue);
  });

  it('should inherit "data-testid" attribute on the v-expansion-panel', () => {
    const wrapper = mountDetailsItem();
    expect(findVExpansionPanel(wrapper).attributes("data-testid")).toBe(testId);
  });

  describe("props", () => {
    describe("title", () => {
      it("should render the title text on the header", () => {
        const wrapper = mountDetailsItem({ title: "Test Title" });
        expect(findVExpansionPanelTitle(wrapper).text()).toBe("Test Title");
      });

      it("should render an empty header when not set", () => {
        const wrapper = mountDetailsItem();
        expect(findVExpansionPanelTitle(wrapper).exists()).toBeTruthy();
        expect(findVExpansionPanelTitle(wrapper).text()).toBe("");
      });

      it("should still expand without a title", async () => {
        const wrapper = mountDetailsItem();
        await findVExpansionPanelTitle(wrapper).trigger("click");
        expect(findVExpansionPanelText(wrapper).text()).toBe("Test Content");
      });
    });
  });

  describe("behavior", () => {
    it("should start collapsed", () => {
      const wrapper = mountDetailsItem();
      expect(findVExpansionPanelTitle(wrapper).attributes("aria-expanded")).toBe("false");
      expect(wrapper.text()).not.toContain("Test Content");
    });

    it("should expand when the title is clicked", async () => {
      const wrapper = mountDetailsItem();
      await findVExpansionPanelTitle(wrapper).trigger("click");

      expect(findVExpansionPanelTitle(wrapper).attributes("aria-expanded")).toBe("true");
      expect(findVExpansionPanelText(wrapper).text()).toBe("Test Content");
    });
  });

  describe("slots", () => {
    describe("default", () => {
      it("should forward the default slot content to the panel text", async () => {
        const wrapper = mountDetailsItem();
        await findVExpansionPanelTitle(wrapper).trigger("click");
        expect(findVExpansionPanelText(wrapper).text()).toBe("Test Content");
      });
    });
  });
});

/** Mounts the item inside a `UDetails`, where it must be placed. */
function mountDetailsItem(props: DetailsItemProps = {}) {
  return mount(Details, {
    slots: {
      default: defineComponent({
        components: { DetailsItem },
        setup: () => ({ props, testId, styleValue, classValue }),
        template: `
          <details-item
            v-bind="props"
            :data-testid="testId"
            :style="styleValue"
            :class="classValue"
          >Test Content</details-item>
        `,
      }),
    },
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findDetailsItem(wrapper: ReturnType<typeof mountDetailsItem>) {
  return wrapper.findComponent(DetailsItem);
}

function findVExpansionPanel(wrapper: ReturnType<typeof mountDetailsItem>) {
  return wrapper.findComponent(VExpansionPanel);
}

function findVExpansionPanelTitle(wrapper: ReturnType<typeof mountDetailsItem>) {
  return wrapper.findComponent(VExpansionPanelTitle);
}

function findVExpansionPanelText(wrapper: ReturnType<typeof mountDetailsItem>) {
  return wrapper.findComponent(VExpansionPanelText);
}
