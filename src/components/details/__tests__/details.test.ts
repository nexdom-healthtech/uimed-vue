import {
  VExpansionPanel,
  VExpansionPanels,
  VExpansionPanelText,
  VExpansionPanelTitle,
  VSkeletonLoader,
} from "vuetify/components";
import { mount } from "@vue/test-utils";
import Details from "@/components/details/details.vue";
import type { DetailsVariant } from "@/components/details/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const variants: [DetailsVariant, boolean][] = [
  ["primary", false],
  ["secondary", true],
];

const testId = "details-test-id";
const styleValue = "random-style";
const classValue = "random-class";

describe("Details", () => {
  it("should exist", () => {
    const wrapper = mountDetails();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    const wrapper = mountDetails();
    expect(findVExpansionPanels(wrapper).exists()).toBeTruthy();
    expect(findVExpansionPanel(wrapper).exists()).toBeTruthy();
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountDetails();
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).toBeUndefined();
  });

  it('should inherit "data-testid" attribute on the v-expansion-panels', () => {
    const wrapper = mountDetails();
    expect(findVExpansionPanels(wrapper).attributes("data-testid")).toBe(testId);
  });

  describe("props", () => {
    describe("variant", () => {
      it.each(variants)('should set `variant="%s"` as outlined: %s', async (variant, outlined) => {
        const wrapper = mountDetails();
        await wrapper.setProps({ variant });
        expect(findVExpansionPanels(wrapper).props("flat")).toBe(outlined);
        expect(findVExpansionPanel(wrapper).classes("border")).toBe(outlined);
      });

      it("should default to the primary variant when not set", () => {
        const wrapper = mountDetails();
        expect(findVExpansionPanels(wrapper).props("flat")).toBe(false);
        expect(findVExpansionPanel(wrapper).classes("border")).toBe(false);
      });
    });

    describe("title", () => {
      it("should render the title text on the header", async () => {
        const title = "Test Title";
        const wrapper = mountDetails();
        await wrapper.setProps({ title });
        expect(findVExpansionPanelTitle(wrapper).text()).toBe(title);
      });

      it("should render an empty header when not set", () => {
        const wrapper = mountDetails();
        expect(findVExpansionPanelTitle(wrapper).exists()).toBeTruthy();
        expect(findVExpansionPanelTitle(wrapper).text()).toBe("");
      });

      it("should still expand without a title", async () => {
        const wrapper = mountDetails();
        await findVExpansionPanelTitle(wrapper).trigger("click");
        expect(findVExpansionPanelText(wrapper).text()).toBe("Test Content");
      });
    });

    describe("loading", () => {
      it("should forward to v-skeleton-loader", async () => {
        const wrapper = mountDetails();
        await wrapper.setProps({ loading: true });
        expect(findVSkeletonLoader(wrapper).props("loading")).toBe(true);
      });

      it("should be falsy by default", () => {
        const wrapper = mountDetails();
        expect(findVSkeletonLoader(wrapper).props("loading")).toBeFalsy();
      });

      it('should use "heading" skeleton type', () => {
        const wrapper = mountDetails();
        expect(findVSkeletonLoader(wrapper).props("type")).toBe("heading");
      });

      it("should make the skeleton occupy the full width", () => {
        const wrapper = mountDetails();
        expect(findVSkeletonLoader(wrapper).props("width")).toBe("100%");
      });

      it("should hide the details while loading", async () => {
        const wrapper = mountDetails();
        await wrapper.setProps({ loading: true });
        expect(findVExpansionPanels(wrapper).exists()).toBeFalsy();
      });
    });
  });

  describe("behavior", () => {
    it("should start collapsed", () => {
      const wrapper = mountDetails();
      expect(findVExpansionPanelTitle(wrapper).attributes("aria-expanded")).toBe("false");
      expect(wrapper.text()).not.toContain("Test Content");
    });

    it("should expand when the title is clicked", async () => {
      const wrapper = mountDetails();
      await findVExpansionPanelTitle(wrapper).trigger("click");

      expect(findVExpansionPanelTitle(wrapper).attributes("aria-expanded")).toBe("true");
      expect(findVExpansionPanelText(wrapper).text()).toBe("Test Content");
    });

    it("should collapse when the title is clicked again", async () => {
      const wrapper = mountDetails();
      await findVExpansionPanelTitle(wrapper).trigger("click");
      await findVExpansionPanelTitle(wrapper).trigger("click");

      expect(findVExpansionPanelTitle(wrapper).attributes("aria-expanded")).toBe("false");
    });
  });

  describe("slots", () => {
    describe("default", () => {
      it("should forward the default slot content to the panel text", async () => {
        const wrapper = mountDetails();
        await findVExpansionPanelTitle(wrapper).trigger("click");
        expect(findVExpansionPanelText(wrapper).text()).toBe("Test Content");
      });
    });
  });
});

function mountDetails(slots: Record<string, string> = {}, attrs: Record<string, unknown> = {}) {
  return mount(Details, {
    attrs: {
      "data-testid": testId,
      style: styleValue,
      class: classValue,
      ...attrs,
    },
    slots: {
      default: "Test Content",
      ...slots,
    },
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findVExpansionPanels(wrapper: ReturnType<typeof mountDetails>) {
  return wrapper.findComponent(VExpansionPanels);
}

function findVExpansionPanel(wrapper: ReturnType<typeof mountDetails>) {
  return wrapper.findComponent(VExpansionPanel);
}

function findVExpansionPanelTitle(wrapper: ReturnType<typeof mountDetails>) {
  return wrapper.findComponent(VExpansionPanelTitle);
}

function findVExpansionPanelText(wrapper: ReturnType<typeof mountDetails>) {
  return wrapper.findComponent(VExpansionPanelText);
}

function findVSkeletonLoader(wrapper: ReturnType<typeof mountDetails>) {
  return wrapper.findComponent(VSkeletonLoader);
}
