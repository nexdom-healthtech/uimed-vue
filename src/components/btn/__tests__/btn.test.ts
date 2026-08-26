import { VBtn, VProgressCircular } from "vuetify/components";
import { mount } from "@vue/test-utils";
import Btn from "@/components/btn/btn.vue";
import { resolveBtnColor, resolveBtnVariant } from "@/components/btn/consts.ts";
import type { BtnColor, BtnProps, BtnVariant } from "@/components/btn/types.ts";

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({ components, directives });

const variants: [BtnVariant, string][] = [
  ["primary", "elevated"],
  ["secondary", "flat"],
  ["ghost", "outlined"],
];
const colors: [BtnColor, string][] = [
  ["primary", "primary"],
  ["secondary", "secondary"],
  ["positive", "success"],
  ["informative", "info"],
  ["caution", "warning"],
  ["danger", "error"],
];

const testId = "button-test-id";
const styleValue = "random-style";
const classValue = "random-class";

describe("btn", () => {
  it("should exists", () => {
    const wrapper = mountBtn();
    expect(wrapper.exists()).toBe(true);
  });

  it("should contain primary component", () => {
    const wrapper = mountBtn();
    expect(wrapper.findComponent(VBtn).exists()).toBe(true);
  });

  it('should inherit "data-testid" attribute', () => {
    const wrapper = mountBtn();
    expect(wrapper.attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountBtn();
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).not.toBeUndefined();
    expect(wrapper.attributes("class")).not.toBe(classValue);
  });

  describe("variant prop", () => {
    it.each(variants)(
      'should forward `variant="%s"` to Vuetify\'s `%s` variant',
      (variant, vuetifyVariant) => {
        const wrapper = mountBtn({ variant });
        expect(wrapper.findComponent(VBtn).props("variant")).toBe(vuetifyVariant);
      },
    );

    it("should default to the elevated variant when not set", () => {
      const wrapper = mountBtn();
      expect(wrapper.findComponent(VBtn).props("variant")).toBe("elevated");
    });

    it("should resolve to the primary variant's mapping when variant is undefined", () => {
      expect(resolveBtnVariant(undefined)).toBe("elevated");
    });

    it("should resolve to the primary variant's mapping when variant is not a mapped key", () => {
      expect(resolveBtnVariant("" as BtnVariant)).toBe("elevated");
    });
  });

  describe("color prop", () => {
    it.each(colors)(
      'should forward `color="%s"` to Vuetify\'s `%s` color',
      (color, vuetifyColor) => {
        const wrapper = mountBtn({ color });
        expect(wrapper.findComponent(VBtn).props("color")).toBe(vuetifyColor);
      },
    );

    it("should have `primary` color by default", () => {
      const wrapper = mountBtn();
      expect(wrapper.findComponent(VBtn).props("color")).toBe("primary");
    });

    it("should resolve to the primary color's mapping when color is not a mapped key", () => {
      expect(resolveBtnColor("" as BtnColor)).toBe("primary");
    });
  });

  describe("disabled prop", () => {
    it("should forward `disabled` to the underlying component", () => {
      const wrapper = mountBtn({ disabled: true });
      expect(wrapper.findComponent(VBtn).props("disabled")).toBe(true);
    });

    it("should be enabled by default", () => {
      const wrapper = mountBtn();
      expect(wrapper.findComponent(VBtn).props("disabled")).toBe(false);
    });
  });

  describe("loading prop", () => {
    it("should forward a boolean `loading` to the underlying component", () => {
      const wrapper = mountBtn({ loading: true });
      expect(wrapper.findComponent(VBtn).props("loading")).toBe(true);
    });

    it("should not be loading by default", () => {
      const wrapper = mountBtn();
      expect(wrapper.findComponent(VBtn).props("loading")).toBe(false);
    });

    it("should render the underlying component's default spinner when loading", () => {
      const wrapper = mountBtn({ loading: true });
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
      const wrapper = mountBtn({ disabled: true }, {}, { onClick });

      await wrapper.trigger("click");

      expect(onClick).not.toHaveBeenCalled();
    });
  });
});

function mountBtn(
  props: Partial<BtnProps> = {},
  slots: Record<string, string> = {},
  attrs: Record<string, unknown> = {},
) {
  return mount(Btn, {
    props,
    attrs: {
      "data-testid": testId,
      style: styleValue,
      class: classValue,
      ...attrs,
    },
    slots,
    global: {
      plugins: [vuetify],
    },
  });
}
