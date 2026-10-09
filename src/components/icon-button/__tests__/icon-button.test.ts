import { VIcon, VIconBtn } from "vuetify/components";
import { mount } from "@vue/test-utils";
import IconButton from "@/components/icon-button/icon-button.vue";
import type { IconButtonProps } from "@/components/icon-button/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import type { ColorVariant, VuetifyColor } from "@/composables/colors/types.ts";
import { colorToVuetifyColor } from "@/composables/colors/constants.ts";
import { iconToVuetifyIcon } from "@/consts/icons.ts";

const colors = Object.entries(colorToVuetifyColor) as [ColorVariant, VuetifyColor][];
const label = "Editar paciente";

describe("IconButton", () => {
  it("should render a single button", () => {
    const wrapper = mountIconButton();

    expect(findVIconBtn(wrapper).exists()).toBeTruthy();
    expect(wrapper.findAll("button")).toHaveLength(1);
    expect(wrapper.element.tagName).toBe("BUTTON");
  });

  it('should not submit forms, with `type="button"`', () => {
    const wrapper = mountIconButton();

    expect(wrapper.attributes("type")).toBe("button");
  });

  it("should have the flat look", () => {
    const wrapper = mountIconButton();

    expect(findVIconBtn(wrapper).props("variant")).toBe("flat");
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountIconButton({}, { style: "random-style", class: "random-class" });

    expect(wrapper.attributes("style")).not.toContain("random-style");
    expect(wrapper.classes()).not.toContain("random-class");
  });

  describe("props", () => {
    describe("icon", () => {
      it("should draw the icon of the given name", () => {
        const wrapper = mountIconButton({ icon: "hospital" });

        expect(findVIconBtn(wrapper).props("icon")).toBe(iconToVuetifyIcon.hospital);
        expect(findVIcon(wrapper).classes()).toContain("mdi-hospital-building");
      });

      it("should follow changes of the icon", async () => {
        const wrapper = mountIconButton({ icon: "home" });

        await wrapper.setProps({ icon: "home-alternative" });

        expect(findVIcon(wrapper).classes()).toContain("mdi-home-outline");
      });

      it("should hide the icon from assistive technologies", () => {
        const wrapper = mountIconButton();

        expect(findVIcon(wrapper).attributes("aria-hidden")).toBe("true");
      });
    });

    describe("label", () => {
      it("should be the accessible name of the button", () => {
        const wrapper = mountIconButton();

        expect(wrapper.attributes("aria-label")).toBe(label);
        expect(wrapper.text()).toBe("");
      });
    });

    describe("color", () => {
      it.each(colors)(
        'should forward `color="%s"` to Vuetify\'s `%s` color',
        async (color, vuetifyColor) => {
          const wrapper = mountIconButton();

          await wrapper.setProps({ color });

          expect(findVIconBtn(wrapper).props("color")).toBe(vuetifyColor);
          expect(wrapper.classes()).toContain(`bg-${vuetifyColor}`);
        },
      );

      it("should have `primary` color by default", () => {
        const wrapper = mountIconButton();

        expect(findVIconBtn(wrapper).props("color")).toBe("primary");
      });
    });

    describe("dataTestid", () => {
      it('should set the "data-testid" attribute on the button', () => {
        const wrapper = mountIconButton({ dataTestid: "icon-button-test-id" });

        expect(wrapper.attributes("data-testid")).toBe("icon-button-test-id");
      });

      it('should not set the "data-testid" attribute by default', () => {
        const wrapper = mountIconButton();

        expect(wrapper.attributes("data-testid")).toBeUndefined();
      });
    });
  });

  describe("events", () => {
    describe("click", () => {
      it("should emit `click` with the native `MouseEvent` when clicked", async () => {
        const wrapper = mountIconButton();

        await wrapper.trigger("click");

        const [[event]] = wrapper.emitted<[MouseEvent]>("click") ?? [[]];
        expect(wrapper.emitted("click")).toHaveLength(1);
        expect(event).toBeInstanceOf(MouseEvent);
      });

      it("should not emit `click` before being clicked", () => {
        const wrapper = mountIconButton();

        expect(wrapper.emitted("click")).toBeUndefined();
      });
    });
  });
});

function mountIconButton(
  props: Partial<IconButtonProps> = {},
  attrs: Record<string, unknown> = {},
) {
  return mount(IconButton, {
    props: { icon: "cog", label, ...props },
    attrs,
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findVIconBtn(wrapper: ReturnType<typeof mountIconButton>) {
  return wrapper.findComponent(VIconBtn);
}

function findVIcon(wrapper: ReturnType<typeof mountIconButton>) {
  return wrapper.findComponent(VIcon);
}
