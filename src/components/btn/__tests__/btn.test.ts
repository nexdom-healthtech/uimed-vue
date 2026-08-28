import { VBtn } from "vuetify/components";
import { mount } from "@vue/test-utils";
import Btn from "@/components/btn/btn.vue";
import type { BtnColor, BtnVariant } from "@/components/btn/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

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

describe("Btn", () => {
  it("should exists", () => {
    const wrapper = mountBtn();
    expect(wrapper.exists()).toBe(true);
  });

  it("should contain primary component", () => {
    const wrapper = mountBtn();
    expect(findVBtn(wrapper).exists()).toBe(true);
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

  describe("props", () => {
    describe("variant ", () => {
      it.each(variants)(
        'should forward `variant="%s"` to Vuetify\'s `%s` variant',
        async (variant, vuetifyVariant) => {
          const wrapper = mountBtn();
          await wrapper.setProps({ variant });
          expect(findVBtn(wrapper).props("variant")).toBe(vuetifyVariant);
        },
      );

      it("should default to the elevated variant when not set", () => {
        const wrapper = mountBtn();
        expect(findVBtn(wrapper).props("variant")).toBe("elevated");
      });
    });

    describe("color", () => {
      it.each(colors)(
        'should forward `color="%s"` to Vuetify\'s `%s` color',
        async (color, vuetifyColor) => {
          const wrapper = mountBtn();
          await wrapper.setProps({ color });
          expect(findVBtn(wrapper).props("color")).toBe(vuetifyColor);
        },
      );

      it("should have `primary` color by default", () => {
        const wrapper = mountBtn();
        expect(findVBtn(wrapper).props("color")).toBe("primary");
      });
    });

    describe("disabled and loading", () => {
      it("should forward to the underlying component", async () => {
        const wrapper = mountBtn();
        await wrapper.setProps({ disabled: true, loading: true });

        const vBtn = findVBtn(wrapper);
        expect(vBtn.props("disabled")).toBe(true);
        expect(vBtn.props("loading")).toBe(true);
      });

      it("should be false by default", () => {
        const wrapper = mountBtn();
        const vBtn = findVBtn(wrapper);
        expect(vBtn.props("disabled")).toBe(false);
        expect(vBtn.props("loading")).toBe(false);
      });
    });
  });

  describe("slots", () => {
    describe("default ", () => {
      it("should render content passed to the default slot", () => {
        const wrapper = mountBtn({ default: "Click me" });
        expect(wrapper.text()).toContain("Click me");
      });

      it("should forward the default slot content to the underlying component", () => {
        const wrapper = mountBtn({ default: "Click me" });
        expect(findVBtn(wrapper).text()).toContain("Click me");
      });
    });
  });

  describe("events", () => {
    describe("click", () => {
      it("should call the `onClick` handler when the button is clicked", async () => {
        const onClick = vi.fn();
        const wrapper = mountBtn({}, { onClick });

        await wrapper.trigger("click");

        expect(onClick).toHaveBeenCalledTimes(1);
      });

      it("should not call the `onClick` handler when the button is disabled", async () => {
        const onClick = vi.fn();
        const wrapper = mountBtn({}, { onClick });

        await wrapper.setProps({ disabled: true });
        await wrapper.trigger("click");

        expect(onClick).not.toHaveBeenCalled();
      });
    });
  });
});

function mountBtn(slots: Record<string, string> = {}, attrs: Record<string, unknown> = {}) {
  return mount(Btn, {
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

function findVBtn(wrapper: ReturnType<typeof mountBtn>) {
  return wrapper.findComponent(VBtn);
}
