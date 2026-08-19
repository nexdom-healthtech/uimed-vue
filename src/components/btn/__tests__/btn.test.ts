import { VBtn, VProgressCircular } from "vuetify/components";
import { mount } from "@vue/test-utils";
import Btn from "@/components/btn/btn.vue";
import type { BtnColor, BtnVariant } from "@/components/btn/types.ts";

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({ components, directives });

const mountBtn = (
  props: InstanceType<typeof Btn>["$props"] = {},
  slots: Record<string, string> = {},
  attrs: Record<string, unknown> = {},
) =>
  mount(Btn, {
    props,
    attrs: {
      "data-testid": "button",
      ...attrs,
    },
    slots,
    global: {
      plugins: [vuetify],
    },
  });

describe("btn", () => {
  it("should exists", () => {
    const wrapper = mountBtn();
    expect(wrapper.exists()).toBe(true);
  });

  it("should contain primary component", () => {
    const wrapper = mountBtn();
    expect(wrapper.findComponent(VBtn).exists()).toBe(true);
  });

  it('should not inherit "data-testid" attribute', () => {
    const wrapper = mountBtn();
    expect(wrapper.attributes("data-testid")).toBeUndefined();
  });

  describe("variant prop", () => {
    it.each([
      ["primary", "elevated"],
      ["secondary", "flat"],
      ["ghost", "outlined"],
    ] satisfies [BtnVariant, string][])(
      'should forward `variant="%s"` to Vuetify\'s `%s` variant',
      (variant, vuetifyVariant) => {
        const wrapper = mountBtn({ variant } as InstanceType<typeof Btn>["$props"]);
        expect(wrapper.findComponent(VBtn).props("variant")).toBe(vuetifyVariant);
      },
    );

    it("should default to the elevated variant when not set", () => {
      const wrapper = mountBtn();
      expect(wrapper.findComponent(VBtn).props("variant")).toBe("elevated");
    });
  });

  describe("color prop", () => {
    it.each([
      ["primary", "primary"],
      ["secondary", "secondary"],
      ["positive", "success"],
      ["informative", "info"],
      ["caution", "warning"],
      ["danger", "error"],
    ] satisfies [BtnColor, string][])(
      'should forward `color="%s"` to Vuetify\'s `%s` color',
      (color, vuetifyColor) => {
        const wrapper = mountBtn({ color } as InstanceType<typeof Btn>["$props"]);
        expect(wrapper.findComponent(VBtn).props("color")).toBe(vuetifyColor);
      },
    );

    it("should have `primary` color by default", () => {
      const wrapper = mountBtn();
      expect(wrapper.findComponent(VBtn).props("color")).toBe("primary");
    });
  });

  describe("disabled prop", () => {
    it("should forward `disabled` to the underlying component", () => {
      const wrapper = mountBtn({ disabled: true } as InstanceType<typeof Btn>["$props"]);
      expect(wrapper.findComponent(VBtn).props("disabled")).toBe(true);
    });

    it("should be enabled by default", () => {
      const wrapper = mountBtn();
      expect(wrapper.findComponent(VBtn).props("disabled")).toBe(false);
    });
  });

  describe("loading prop", () => {
    it("should forward a boolean `loading` to the underlying component", () => {
      const wrapper = mountBtn({ loading: true } as InstanceType<typeof Btn>["$props"]);
      expect(wrapper.findComponent(VBtn).props("loading")).toBe(true);
    });

    it("should not be loading by default", () => {
      const wrapper = mountBtn();
      expect(wrapper.findComponent(VBtn).props("loading")).toBe(false);
    });

    it("should render the underlying component's default spinner when loading", () => {
      const wrapper = mountBtn({ loading: true } as InstanceType<typeof Btn>["$props"]);
      expect(wrapper.findComponent(VProgressCircular).exists()).toBe(true);
    });
  });

  describe("default slot", () => {
    it("should render content passed to the default slot", () => {
      const wrapper = mountBtn({}, { default: "Click me" });
      expect(wrapper.text()).toContain("Click me");
    });

    it("should forward the default slot content to the underlying component", () => {
      const wrapper = mountBtn({}, { default: "Click me" });
      expect(wrapper.findComponent(VBtn).text()).toContain("Click me");
    });
  });

  describe("click event", () => {
    it("should call the `onClick` handler when the button is clicked", async () => {
      const onClick = vi.fn();
      const wrapper = mountBtn({}, {}, { onClick });

      await wrapper.trigger("click");

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should not call the `onClick` handler when the button is disabled", async () => {
      const onClick = vi.fn();
      const wrapper = mountBtn(
        { disabled: true } as InstanceType<typeof Btn>["$props"],
        {},
        { onClick },
      );

      await wrapper.trigger("click");

      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
