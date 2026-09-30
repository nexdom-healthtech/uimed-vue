import { VBtn } from "vuetify/components";
import { mount, type VueWrapper } from "@vue/test-utils";
import Button from "@/components/button/button.vue";
import type { ButtonVariant } from "@/components/button/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import type { ColorVariant, VuetifyColor } from "@/composables/colors/types.ts";
import { colorToVuetifyColor } from "@/composables/colors/constants.ts";

const variants: [ButtonVariant, string][] = [
  ["primary", "elevated"],
  ["secondary", "flat"],
  ["ghost", "outlined"],
];
const colors = Object.entries(colorToVuetifyColor) as [ColorVariant, VuetifyColor][];

const testId = "button-test-id";
const styleValue = "random-style";
const classValue = "random-class";

describe("Button", () => {
  it("should exists", () => {
    const wrapper = mountButton();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    const wrapper = mountButton();
    expect(findVBtn(wrapper).exists()).toBeTruthy();
  });

  it('should inherit "data-testid" attribute', () => {
    const wrapper = mountButton();
    expect(wrapper.attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountButton();
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).not.toBeUndefined();
    expect(wrapper.attributes("class")).not.toContain(classValue);
  });

  describe("props", () => {
    describe("variant ", () => {
      it.each(variants)(
        'should forward `variant="%s"` to Vuetify\'s `%s` variant',
        async (variant, vuetifyVariant) => {
          const wrapper = mountButton();
          await wrapper.setProps({ variant });
          expect(findVBtn(wrapper).props("variant")).toBe(vuetifyVariant);
        },
      );

      it("should default to the elevated variant when not set", () => {
        const wrapper = mountButton();
        expect(findVBtn(wrapper).props("variant")).toBe("elevated");
      });
    });

    describe("color", () => {
      it.each(colors)(
        'should forward `color="%s"` to Vuetify\'s `%s` color',
        async (color, vuetifyColor) => {
          const wrapper = mountButton();
          await wrapper.setProps({ color });
          expect(findVBtn(wrapper).props("color")).toBe(vuetifyColor);
        },
      );

      it("should have `primary` color by default", () => {
        const wrapper = mountButton();
        expect(findVBtn(wrapper).props("color")).toBe("primary");
      });
    });

    describe("form", () => {
      it("should forward to the underlying component", async () => {
        const form = "form-id";
        const wrapper = mountButton();
        await wrapper.setProps({ form });

        const vBtn = findVBtn(wrapper);
        expect(vBtn.attributes("form")).toBe(form);
      });

      it("should be undefined by default", () => {
        const wrapper = mountButton();
        const vBtn = findVBtn(wrapper);
        expect(vBtn.attributes("form")).toBeUndefined();
      });
    });

    describe("type", () => {
      it("should forward to the underlying component", async () => {
        const type = "submit";
        const wrapper = mountButton();
        await wrapper.setProps({ type });

        const vBtn = findVBtn(wrapper);
        expect(vBtn.attributes("type")).toBe(type);
      });

      it("should be button by default", () => {
        const wrapper = mountButton();
        const vBtn = findVBtn(wrapper);
        expect(vBtn.attributes("type")).toBe("button");
      });
    });

    describe("disabled and loading", () => {
      it("should forward to the underlying component", async () => {
        const wrapper = mountButton();
        await wrapper.setProps({ disabled: true, loading: true });

        const vBtn = findVBtn(wrapper);
        expect(vBtn.props("disabled")).toBe(true);
        expect(vBtn.props("loading")).toBe(true);
      });

      it("should be false by default", () => {
        const wrapper = mountButton();
        const vBtn = findVBtn(wrapper);
        expect(vBtn.props("disabled")).toBe(false);
        expect(vBtn.props("loading")).toBe(false);
      });
    });

    describe("loading", () => {
      it("should mark the button as `aria-disabled` only while loading", async () => {
        const wrapper = mountButton();
        expect(wrapper.attributes("aria-disabled")).toBeUndefined();

        await wrapper.setProps({ loading: true });
        expect(wrapper.attributes("aria-disabled")).toBe("true");
        expect(wrapper.attributes("disabled")).toBeUndefined();

        await wrapper.setProps({ loading: false });
        expect(wrapper.attributes("aria-disabled")).toBeUndefined();
      });

      it.each(["submit", "button"] as const)(
        'should cancel the clicks of a `type="%s"` button while loading',
        async (type) => {
          const wrapper = mountButton();
          await wrapper.setProps({ type, loading: true });

          expect(clickNatively(wrapper)).toBe(false);

          await wrapper.setProps({ loading: false });
          expect(clickNatively(wrapper)).toBe(true);
        },
      );

      it("should not submit its form while loading", async () => {
        const form = createForm();
        const wrapper = mountButton({}, {}, form);
        await wrapper.setProps({ type: "submit", loading: true });

        wrapper.element.click();
        expect(form.onsubmit).not.toHaveBeenCalled();

        await wrapper.setProps({ loading: false });
        wrapper.element.click();
        expect(form.onsubmit).toHaveBeenCalledOnce();
      });

      it("should not submit the form it's linked to by `form` while loading", async () => {
        const form = createForm();
        const wrapper = mountButton({}, {}, document.body);
        await wrapper.setProps({ type: "submit", form: form.id, loading: true });

        wrapper.element.click();
        expect(form.onsubmit).not.toHaveBeenCalled();

        await wrapper.setProps({ loading: false });
        wrapper.element.click();
        expect(form.onsubmit).toHaveBeenCalledOnce();
      });
    });
  });

  describe("slots", () => {
    describe("default ", () => {
      it("should render content passed to the default slot", () => {
        const wrapper = mountButton({ default: "Click me" });
        expect(wrapper.text()).toContain("Click me");
      });

      it("should forward the default slot content to the underlying component", () => {
        const wrapper = mountButton({ default: "Click me" });
        expect(findVBtn(wrapper).text()).toContain("Click me");
      });
    });
  });

  describe("events", () => {
    describe("click", () => {
      it("should call the `onClick` handler when the button is clicked", async () => {
        const onClick = vi.fn();
        const wrapper = mountButton({}, { onClick });

        await wrapper.trigger("click");

        expect(onClick).toHaveBeenCalledOnce();
      });

      it("should not call the `onClick` handler when the button is disabled", async () => {
        const onClick = vi.fn();
        const wrapper = mountButton({}, { onClick });

        await wrapper.setProps({ disabled: true });
        await wrapper.trigger("click");

        expect(onClick).not.toHaveBeenCalled();
      });

      it("should not call the `onClick` handler when the button is loading", async () => {
        const onClick = vi.fn();
        const wrapper = mountButton({}, { onClick });

        await wrapper.setProps({ loading: true });
        await wrapper.trigger("click");

        expect(onClick).not.toHaveBeenCalled();
        expect(wrapper.emitted("click")).toBeUndefined();
      });

      it("should emit the native, not canceled, event when the button isn't loading", async () => {
        const wrapper = mountButton();

        expect(clickNatively(wrapper)).toBe(true);

        const [[event]] = wrapper.emitted<[MouseEvent]>("click") ?? [];
        expect(event).toBeInstanceOf(MouseEvent);
        expect(event?.defaultPrevented).toBe(false);
      });
    });
  });
});

const attachedWrappers: VueWrapper[] = [];

afterEach(() => {
  attachedWrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  document.body.innerHTML = "";
});

function mountButton(
  slots: Record<string, string> = {},
  attrs: Record<string, unknown> = {},
  attachTo?: HTMLElement,
) {
  const wrapper = mount(Button, {
    attachTo,
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
  if (attachTo) attachedWrappers.push(wrapper);
  return wrapper;
}

function findVBtn(wrapper: ReturnType<typeof mountButton>) {
  return wrapper.findComponent(VBtn);
}

/** Dispatches a cancelable click on the button, returning whether it wasn't canceled. */
function clickNatively(wrapper: ReturnType<typeof mountButton>) {
  return wrapper.element.dispatchEvent(new MouseEvent("click", { cancelable: true }));
}

/** Creates a form in the document, with a spy that prevents its submissions. */
function createForm() {
  const form = document.createElement("form");
  form.id = "form-id";
  form.onsubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
  document.body.append(form);
  return form;
}
