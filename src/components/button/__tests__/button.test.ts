import { VBtn, VProgressCircular } from "vuetify/components";
import { mount } from "@vue/test-utils";
import Button from "@/components/button/button.vue";

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({ components, directives });

const mountButton = (
  props: InstanceType<typeof Button>["$props"] = {},
  slots: Record<string, string> = {},
  attrs: Record<string, unknown> = {},
) =>
  mount(Button, {
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

describe("button", () => {
  it("should exists", () => {
    const wrapper = mountButton();
    expect(wrapper.exists()).toBe(true);
  });

  it("should contain primary component", () => {
    const wrapper = mountButton();
    expect(wrapper.findComponent(VBtn).exists()).toBe(true);
  });

  it('should not inherit "data-testid" attribute', () => {
    const wrapper = mountButton();
    expect(wrapper.attributes("data-testid")).toBeUndefined();
  });

  describe("type prop", () => {
    it("should forward `type` to the underlying component's variant", () => {
      const wrapper = mountButton({ type: "outlined" } as InstanceType<typeof Button>["$props"]);
      expect(wrapper.findComponent(VBtn).props("variant")).toBe("outlined");
    });

    it("should default to the elevated variant when not set", () => {
      const wrapper = mountButton();
      expect(wrapper.findComponent(VBtn).props("variant")).toBe("elevated");
    });
  });

  describe("color prop", () => {
    it("should forward `color` to the underlying component", () => {
      const wrapper = mountButton({ color: "secondary" } as InstanceType<typeof Button>["$props"]);
      expect(wrapper.findComponent(VBtn).props("color")).toBe("secondary");
    });

    it("should have `primary` color by default", () => {
      const wrapper = mountButton();
      expect(wrapper.findComponent(VBtn).props("color")).toBe("primary");
    });
  });

  describe("disabled prop", () => {
    it("should forward `disabled` to the underlying component", () => {
      const wrapper = mountButton({ disabled: true } as InstanceType<typeof Button>["$props"]);
      expect(wrapper.findComponent(VBtn).props("disabled")).toBe(true);
    });

    it("should be enabled by default", () => {
      const wrapper = mountButton();
      expect(wrapper.findComponent(VBtn).props("disabled")).toBe(false);
    });
  });

  describe("loading prop", () => {
    it("should forward a boolean `loading` to the underlying component", () => {
      const wrapper = mountButton({ loading: true } as InstanceType<typeof Button>["$props"]);
      expect(wrapper.findComponent(VBtn).props("loading")).toBe(true);
    });

    it("should forward a slot name string `loading` to the underlying component", () => {
      const wrapper = mountButton({ loading: "loader" } as InstanceType<typeof Button>["$props"]);
      expect(wrapper.findComponent(VBtn).props("loading")).toBe("loader");
    });

    it("should not be loading by default", () => {
      const wrapper = mountButton();
      expect(wrapper.findComponent(VBtn).props("loading")).toBe(false);
    });

    it("should render the underlying component's default spinner when loading without a custom `loader` slot", () => {
      const wrapper = mountButton({ loading: true } as InstanceType<typeof Button>["$props"]);
      expect(wrapper.findComponent(VProgressCircular).exists()).toBe(true);
    });
  });

  describe("position prop", () => {
    it("should forward `position` to the underlying component", () => {
      const wrapper = mountButton({ position: "sticky" } as InstanceType<typeof Button>["$props"]);
      expect(wrapper.findComponent(VBtn).props("position")).toBe("sticky");
    });

    it("should have `static` position by default", () => {
      const wrapper = mountButton();
      expect(wrapper.findComponent(VBtn).props("position")).toBe("static");
    });
  });

  describe("class prop", () => {
    it("should forward `class` to the underlying component", () => {
      const wrapper = mountButton({ class: "custom-class" } as InstanceType<
        typeof Button
      >["$props"]);
      expect(wrapper.findComponent(VBtn).props("class")).toBe("custom-class");
    });

    it("should apply the custom class alongside the underlying component's own classes on the root element", () => {
      const wrapper = mountButton({ class: "custom-class" } as InstanceType<
        typeof Button
      >["$props"]);
      expect(wrapper.classes()).toContain("custom-class");
      expect(wrapper.classes()).toContain("v-btn");
    });

    it("should not apply any custom class by default", () => {
      const wrapper = mountButton();
      expect(wrapper.classes()).toContain("v-btn");
      expect(wrapper.classes()).not.toContain("custom-class");
    });
  });

  describe("default slot", () => {
    it("should render content passed to the default slot", () => {
      const wrapper = mountButton({}, { default: "Click me" });
      expect(wrapper.text()).toContain("Click me");
    });

    it("should forward the default slot content to the underlying component", () => {
      const wrapper = mountButton({}, { default: "Click me" });
      expect(wrapper.findComponent(VBtn).text()).toContain("Click me");
    });
  });

  describe("loader slot", () => {
    it("should render the `loader` slot content inside the underlying component's loader", () => {
      const wrapper = mountButton({ loading: true } as InstanceType<typeof Button>["$props"], {
        loader: '<span data-testid="custom-loader">Loading…</span>',
      });
      expect(wrapper.find(".v-btn__loader").find('[data-testid="custom-loader"]').exists()).toBe(
        true,
      );
    });

    it("should replace the underlying component's default spinner when a custom loader is provided", () => {
      const wrapper = mountButton({ loading: true } as InstanceType<typeof Button>["$props"], {
        loader: '<span data-testid="custom-loader">Loading…</span>',
      });
      expect(wrapper.findComponent(VProgressCircular).exists()).toBe(false);
    });

    it("should not render the `loader` slot content when not loading", () => {
      const wrapper = mountButton(
        {},
        { loader: '<span data-testid="custom-loader">Loading…</span>' },
      );
      expect(wrapper.find('[data-testid="custom-loader"]').exists()).toBe(false);
    });
  });

  describe("click event", () => {
    it("should call the `onClick` handler when the button is clicked", async () => {
      const onClick = vi.fn();
      const wrapper = mountButton({}, {}, { onClick });

      await wrapper.trigger("click");

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should not call the `onClick` handler when the button is disabled", async () => {
      const onClick = vi.fn();
      const wrapper = mountButton(
        { disabled: true } as InstanceType<typeof Button>["$props"],
        {},
        { onClick },
      );

      await wrapper.trigger("click");

      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
