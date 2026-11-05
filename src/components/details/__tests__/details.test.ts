import {
  VExpansionPanel,
  VExpansionPanels,
  VExpansionPanelText,
  VExpansionPanelTitle,
  VSkeletonLoader,
} from "vuetify/components";
import { mount, renderToString } from "@vue/test-utils";
import Details from "@/components/details/details.vue";
import DetailsItem from "@/components/details/details-item.vue";
import type { DetailsProps, DetailsVariant } from "@/components/details/types.ts";
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

  it("should contain primary component, with its items inside", () => {
    const wrapper = mountDetails();
    expect(findVExpansionPanels(wrapper).exists()).toBeTruthy();
    expect(findVExpansionPanels(wrapper).findAllComponents(VExpansionPanel)).toHaveLength(2);
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountDetails();
    expect(findVExpansionPanels(wrapper).attributes("style")).toBeUndefined();
    expect(findVExpansionPanels(wrapper).classes()).not.toContain(classValue);
  });

  it('should inherit "data-testid" attribute on the v-expansion-panels', () => {
    const wrapper = mountDetails();
    expect(findVExpansionPanels(wrapper).attributes("data-testid")).toBe(testId);
  });

  describe("props", () => {
    describe("variant", () => {
      it.each(variants)(
        'should set `variant="%s"` as outlined on every item: %s',
        async (variant, outlined) => {
          const wrapper = mountDetails({ variant });

          expect(findVExpansionPanels(wrapper).props("flat")).toBe(outlined);
          for (const panel of findVExpansionPanelList(wrapper)) {
            expect(panel.classes("border")).toBe(outlined);
          }
        },
      );

      it("should default to the primary variant when not set", () => {
        const wrapper = mountDetails();
        expect(findVExpansionPanels(wrapper).props("flat")).toBe(false);
        expect(findVExpansionPanelList(wrapper)[0]!.classes("border")).toBe(false);
      });
    });

    describe("loading", () => {
      it("should forward to v-skeleton-loader", () => {
        const wrapper = mountDetails({ loading: true });
        expect(findVSkeletonLoader(wrapper).props("loading")).toBe(true);
      });

      it("should announce the loading in pt-BR to screen readers", () => {
        const wrapper = mountDetails({ loading: true });
        expect(findVSkeletonLoader(wrapper).attributes("aria-label")).toBe("Carregando...");
      });

      it("should announce the loading with valid ARIA attributes when rendered on the server", async () => {
        const html = await renderDetails({ loading: true });
        expect(html).toContain('aria-label="Carregando..."');
        expect(html).toContain('aria-live="polite"');
        expect(html).not.toContain("arialabel");
        expect(html).not.toContain("arialive");
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
        const wrapper = mountDetails({ loading: true });
        expect(findVSkeletonLoader(wrapper).classes()).toContain("w-100");
      });

      it("should hide the items while loading", () => {
        const wrapper = mountDetails({ loading: true });
        expect(findVExpansionPanels(wrapper).exists()).toBeFalsy();
      });
    });
  });

  describe("behavior", () => {
    it("should start with every item collapsed", () => {
      const wrapper = mountDetails();

      for (const title of findVExpansionPanelTitles(wrapper)) {
        expect(title.attributes("aria-expanded")).toBe("false");
      }
      expect(wrapper.text()).not.toContain("First content");
    });

    it("should expand only one item at a time", async () => {
      const wrapper = mountDetails();
      const [firstTitle, secondTitle] = findVExpansionPanelTitles(wrapper);

      await firstTitle!.trigger("click");
      expect(firstTitle!.attributes("aria-expanded")).toBe("true");
      expect(findVExpansionPanels(wrapper).findComponent(VExpansionPanelText).text()).toBe(
        "First content",
      );

      await secondTitle!.trigger("click");
      expect(secondTitle!.attributes("aria-expanded")).toBe("true");
      expect(firstTitle!.attributes("aria-expanded")).toBe("false");
    });

    it("should collapse an item when its title is clicked again", async () => {
      const wrapper = mountDetails();
      const [firstTitle] = findVExpansionPanelTitles(wrapper);

      await firstTitle!.trigger("click");
      await firstTitle!.trigger("click");

      expect(firstTitle!.attributes("aria-expanded")).toBe("false");
    });
  });
});

const items = {
  components: { DetailsItem },
  template: `
    <details-item title="First">First content</details-item>
    <details-item title="Second">Second content</details-item>
  `,
};

function mountDetails(props: DetailsProps = {}) {
  return mount(Details, {
    props,
    attrs: {
      "data-testid": testId,
      style: styleValue,
      class: classValue,
    },
    slots: { default: items },
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function renderDetails(props: Partial<DetailsProps>) {
  return renderToString(Details, {
    props,
    slots: { default: items },
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findVExpansionPanels(wrapper: ReturnType<typeof mountDetails>) {
  return wrapper.findComponent(VExpansionPanels);
}

function findVExpansionPanelList(wrapper: ReturnType<typeof mountDetails>) {
  return wrapper.findAllComponents(VExpansionPanel);
}

function findVExpansionPanelTitles(wrapper: ReturnType<typeof mountDetails>) {
  return wrapper.findAllComponents(VExpansionPanelTitle);
}

function findVSkeletonLoader(wrapper: ReturnType<typeof mountDetails>) {
  return wrapper.findComponent(VSkeletonLoader);
}
