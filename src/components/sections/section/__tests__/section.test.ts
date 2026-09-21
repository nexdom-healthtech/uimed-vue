import { VCard, VCardActions, VSkeletonLoader } from "vuetify/components";
import { mount } from "@vue/test-utils";
import Section from "@/components/sections/section/section.vue";
import type { SectionProps, SectionVariant } from "@/components/sections/section/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import Button from "@/components/button/button.vue";

const variants: [SectionVariant, string][] = [
  ["primary", "elevated"],
  ["secondary", "outlined"],
];

const testId = "section-test-id";
const styleValue = "random-style";
const classValue = "random-class";

describe("Section", () => {
  it("should exist", () => {
    const wrapper = mountSection();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    const wrapper = mountSection();
    expect(findVCard(wrapper).exists()).toBeTruthy();
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountSection();
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).toBeUndefined();
  });

  it('should inherit "data-testid" attribute on the v-card', () => {
    const wrapper = mountSection();

    const vCard = findVCard(wrapper);
    expect(vCard.attributes("data-testid")).toBe(testId);
    expect(vCard.attributes("class")).toContain("d-flex flex-column");
  });

  describe("props", () => {
    describe("variant", () => {
      it.each(variants)(
        'should forward `variant="%s"` to Vuetify\'s `%s` variant',
        async (variant, vuetifyVariant) => {
          const wrapper = mountSection();
          await wrapper.setProps({ variant });
          expect(findVCard(wrapper).props("variant")).toBe(vuetifyVariant);
        },
      );

      it("should default to the elevated variant when not set", () => {
        const wrapper = mountSection();
        expect(findVCard(wrapper).props("variant")).toBe("elevated");
      });
    });

    describe("title", () => {
      it("should forward to the underlying component", async () => {
        const title = "Test Title";
        const wrapper = mountSection();
        await wrapper.setProps({ title });

        const vCard = findVCard(wrapper);
        expect(vCard.props("title")).toBe(title);
      });

      it("should be undefined for empty string", async () => {
        const wrapper = mountSection();
        await wrapper.setProps({ title: "" });

        const vCard = findVCard(wrapper);
        expect(vCard.props("title")).toBeUndefined();
      });

      it("should be undefined by default", () => {
        const wrapper = mountSection();
        const vCard = findVCard(wrapper);
        expect(vCard.props("title")).toBeUndefined();
      });
    });

    describe("subtitle", () => {
      it("should forward to the underlying component", async () => {
        const subtitle = "Test Subtitle";
        const wrapper = mountSection();
        await wrapper.setProps({ subtitle });

        const vCard = findVCard(wrapper);
        expect(vCard.props("subtitle")).toBe(subtitle);
      });

      it("should be undefined for empty string", async () => {
        const wrapper = mountSection();
        await wrapper.setProps({ subtitle: "" });

        const vCard = findVCard(wrapper);
        expect(vCard.props("subtitle")).toBeUndefined();
      });

      it("should be undefined by default", () => {
        const wrapper = mountSection();
        const vCard = findVCard(wrapper);
        expect(vCard.props("subtitle")).toBeUndefined();
      });
    });

    describe("fullWidth", () => {
      it("should set width to 100% when fullWidth is true", async () => {
        const wrapper = mountSection();
        await wrapper.setProps({ fullWidth: true });

        const vCard = findVCard(wrapper);
        expect(vCard.props("width")).toBe("100%");
      });

      it("should not set width when fullWidth is false", async () => {
        const wrapper = mountSection();
        await wrapper.setProps({ fullWidth: false });

        const vCard = findVCard(wrapper);
        expect(vCard.props("width")).toBeUndefined();
      });

      it("should be false by default", () => {
        const wrapper = mountSection();
        const vCard = findVCard(wrapper);
        expect(vCard.props("width")).toBeUndefined();
      });
    });

    describe("fullHeight", () => {
      it("should set height to 100% when fullHeight is true", async () => {
        const wrapper = mountSection();
        await wrapper.setProps({ fullHeight: true });

        const vCard = findVCard(wrapper);
        expect(vCard.props("height")).toBe("100%");
      });

      it("should not set height when fullHeight is false", async () => {
        const wrapper = mountSection();
        await wrapper.setProps({ fullHeight: false });

        const vCard = findVCard(wrapper);
        expect(vCard.props("height")).toBeUndefined();
      });

      it("should be false by default", () => {
        const wrapper = mountSection();
        const vCard = findVCard(wrapper);
        expect(vCard.props("height")).toBeUndefined();
      });
    });

    describe("loading", () => {
      it("should forward to v-skeleton-loader", async () => {
        const wrapper = mountSection();
        await wrapper.setProps({ loading: true });
        expect(findVSkeletonLoader(wrapper).props("loading")).toBe(true);
      });

      it("should be falsy by default", () => {
        const wrapper = mountSection();
        expect(findVSkeletonLoader(wrapper).props("loading")).toBeFalsy();
      });

      it('should use "image" skeleton type when there are no actions', () => {
        const wrapper = mountSection();
        expect(findVSkeletonLoader(wrapper).props("type")).toBe("image");
      });

      it('should use "image, actions" skeleton type when actions are provided', async () => {
        const actions = [{ label: "Action 1", onClick: vi.fn() }];
        const wrapper = mountSection();
        await wrapper.setProps({ actions });
        expect(findVSkeletonLoader(wrapper).props("type")).toBe("image, actions");
      });

      it("should also accept fullWidth and fullHeight prop", async () => {
        const wrapper = mountSection();
        const vSkeletonLoader = findVSkeletonLoader(wrapper);
        expect(vSkeletonLoader.props("width")).toBeUndefined();
        expect(vSkeletonLoader.props("height")).toBeUndefined();

        await wrapper.setProps({ fullWidth: true });
        expect(vSkeletonLoader.props("width")).toBe("100%");
        expect(vSkeletonLoader.props("height")).toBeUndefined();

        await wrapper.setProps({ fullWidth: false, fullHeight: true });
        expect(vSkeletonLoader.props("width")).toBeUndefined();
        expect(vSkeletonLoader.props("height")).toBe("100%");
      });

      it("should still render the underlying v-card", () => {
        const wrapper = mountSection();
        expect(findVCard(wrapper).exists()).toBeTruthy();
      });
    });

    describe("actions", () => {
      it("should not render v-card-actions when actions is undefined", () => {
        const wrapper = mountSection();

        const vCardActions = findVCardActions(wrapper);
        expect(vCardActions.exists()).toBeFalsy();
      });

      it("should not render v-card-actions when actions is empty", async () => {
        const wrapper = mountSection();
        await wrapper.setProps({ actions: [] });
        expect(findVCardActions(wrapper).exists()).toBeFalsy();
      });

      it("should render v-card-actions when actions are provided", async () => {
        const actions = [{ label: "Action 1", onClick: vi.fn() }];
        const wrapper = mountSection();
        await wrapper.setProps({ actions });

        const vCardActions = findVCardActions(wrapper);
        expect(vCardActions.exists()).toBeTruthy();
        expect(vCardActions.props("class")).toContain("mt-auto");
      });

      it("should render correct number of buttons", async () => {
        const actions = [
          { label: "Action 1", onClick: vi.fn() },
          { label: "Action 2", onClick: vi.fn() },
          { label: "Action 3", onClick: vi.fn() },
        ];
        const wrapper = mountSection();
        await wrapper.setProps({ actions });

        const buttons = findVCardActions(wrapper).findAllComponents(Button);
        expect(buttons).toHaveLength(3);
      });

      it("should render action labels as button text", async () => {
        const actions = [
          { label: "Save", onClick: vi.fn() },
          { label: "Cancel", onClick: vi.fn() },
        ];
        const wrapper = mountSection();
        await wrapper.setProps({ actions });

        const buttons = findVCardActions(wrapper).findAllComponents(Button);
        expect(buttons[0].text()).toBe("Save");
        expect(buttons[1].text()).toBe("Cancel");
      });

      it("should forward action props to buttons", async () => {
        const actions: SectionProps["actions"] = [
          {
            label: "Test Action",
            variant: "secondary",
            type: "submit",
            color: "danger",
            disabled: true,
            loading: true,
            form: "test-form",
            dataTestid: "action-btn",
            onClick: vi.fn(),
          },
        ];
        const wrapper = mountSection();
        await wrapper.setProps({ actions });

        const button = findVCardActions(wrapper).findComponent(Button);
        expect(button.props("variant")).toBe("secondary");
        expect(button.props("type")).toBe("submit");
        expect(button.props("color")).toBe("danger");
        expect(button.props("disabled")).toBe(true);
        expect(button.props("loading")).toBe(true);
        expect(button.props("form")).toBe("test-form");
        expect(button.attributes("data-testid")).toBe("action-btn");
      });

      it("should call action onClick when button is clicked", async () => {
        const onClick = vi.fn();
        const actions = [{ label: "Click me", onClick }];
        const wrapper = mountSection();
        await wrapper.setProps({ actions });

        const button = findVCardActions(wrapper).findComponent(Button);
        await button.trigger("click");

        expect(onClick).toHaveBeenCalledOnce();
      });

      it("should handle undefined onClick gracefully", async () => {
        const actions = [{ label: "No callback" }];
        const wrapper = mountSection();
        await wrapper.setProps({ actions });

        const button = findVCardActions(wrapper).findComponent(Button);
        expect(async () => {
          await button.trigger("click");
        }).not.toThrow();
      });

      it("should invoke the correct action onClick for multiple actions", async () => {
        const onClick1 = vi.fn();
        const onClick2 = vi.fn();
        const onClick3 = vi.fn();
        const actions = [
          { label: "Action 1", onClick: onClick1 },
          { label: "Action 2", onClick: onClick2 },
          { label: "Action 3", onClick: onClick3 },
        ];
        const wrapper = mountSection();
        await wrapper.setProps({ actions });

        const buttons = findVCardActions(wrapper).findAllComponents(Button);
        await buttons[1].trigger("click");

        expect(onClick1).not.toHaveBeenCalled();
        expect(onClick2).toHaveBeenCalledOnce();
        expect(onClick3).not.toHaveBeenCalled();
      });
    });
  });

  describe("slots", () => {
    describe("default", () => {
      it("should render content passed to the default slot", () => {
        const wrapper = mountSection({ default: "Test Content" });
        expect(wrapper.text()).toContain("Test Content");
      });

      it("should forward the default slot content to the underlying component", () => {
        const wrapper = mountSection({ default: "Test Content" });
        expect(findVCard(wrapper).text()).toContain("Test Content");
      });
    });
  });
});

function mountSection(slots: Record<string, string> = {}, attrs: Record<string, unknown> = {}) {
  return mount(Section, {
    attrs: {
      "data-testid": testId,
      style: styleValue,
      class: classValue,
      ...attrs,
    },
    slots,
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findVCard(wrapper: ReturnType<typeof mountSection>) {
  return wrapper.findComponent(VCard);
}

function findVCardActions(wrapper: ReturnType<typeof mountSection>) {
  return wrapper.findComponent(VCardActions);
}

function findVSkeletonLoader(wrapper: ReturnType<typeof mountSection>) {
  return wrapper.findComponent(VSkeletonLoader);
}
