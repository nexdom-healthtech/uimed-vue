import { VBtn, VProgressCircular } from "vuetify/components";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import Button from "@/components/button/button.vue";
import type { ButtonProps, ButtonVariant } from "@/components/button/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import type { ColorVariant, VuetifyColor } from "@/composables/colors/types.ts";
import { colorToVuetifyColor } from "@/composables/colors/constants.ts";

const variants: [ButtonVariant, string][] = [
  ["primary", "elevated"],
  ["secondary", "flat"],
  ["ghost", "text"],
];
const colors = Object.entries(colorToVuetifyColor) as [ColorVariant, VuetifyColor][];

const testId = "button-test-id";
const externalUrl = "https://example.com/help";
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
    describe("fullWidth", () => {
      it("should not stretch the button by default", () => {
        const wrapper = mountButton();
        expect(findVBtn(wrapper).classes()).not.toContain("w-100");
      });

      it('should add "w-100" when true', async () => {
        const wrapper = mountButton();
        await wrapper.setProps({ fullWidth: true });
        expect(findVBtn(wrapper).classes()).toContain("w-100");

        await wrapper.setProps({ fullWidth: false });
        expect(findVBtn(wrapper).classes()).not.toContain("w-100");
      });
    });

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
        expect(wrapper.find("[role='progressbar']").exists()).toBe(false);
      });

      it("should hide the loading indicator from assistive technologies", async () => {
        const wrapper = mountButton();
        await wrapper.setProps({ loading: true });
        const progress = wrapper.findComponent(VProgressCircular);
        expect(progress.props("indeterminate")).toBe(true);
        expect(progress.props("width")).toBe("2");
        expect(progress.attributes("aria-hidden")).toBe("true");
        expect(findVBtn(wrapper).attributes("aria-busy")).toBe("true");
      });
    });

    describe("loading", () => {
      it.each([
        [false, false, false],
        [true, false, true],
        [false, true, true],
        [true, true, true],
      ])(
        "should disable the underlying component when `disabled` is %s and `loading` is %s",
        async (disabled, loading, expected) => {
          const wrapper = mountButton();
          await wrapper.setProps({ disabled, loading });

          expect(findVBtn(wrapper).props("disabled")).toBe(expected);
          expect(wrapper.attributes("disabled")).toBe(expected ? "" : undefined);
        },
      );

      it("should keep displaying the loading indicator while disabled by loading", async () => {
        const wrapper = mountButton();
        await wrapper.setProps({ loading: true });

        expect(findVBtn(wrapper).props("loading")).toBe(true);
        expect(wrapper.find(".v-btn__loader").exists()).toBe(true);
      });

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

    describe("route", () => {
      it("should render a button that doesn't navigate by default", () => {
        const wrapper = mountButton();
        const vBtn = findVBtn(wrapper);

        expect(wrapper.element.tagName).toBe("BUTTON");
        expect(wrapper.attributes("href")).toBeUndefined();
        expect(vBtn.props("to")).toBeUndefined();
        expect(vBtn.props("href")).toBeUndefined();
      });

      describe("inside the app", () => {
        it("should render a link with the href resolved by the router", async () => {
          const { wrapper } = await mountRouteButton({ route: { name: "patients" } });
          const vBtn = findVBtn(wrapper);

          expect(vBtn.props("to")).toEqual({ name: "patients" });
          expect(vBtn.props("href")).toBeUndefined();
          expect(wrapper.element.tagName).toBe("A");
          expect(wrapper.attributes("href")).toBe("/patients");
          expect(wrapper.attributes("data-testid")).toBe(testId);
        });

        it("should navigate through the router when clicked, emitting `click`", async () => {
          const onClick = vi.fn();
          const { wrapper, router } = await mountRouteButton({ route: "/patients" }, { onClick });

          await wrapper.trigger("click");
          await flushPromises();

          expect(router.currentRoute.value.path).toBe("/patients");
          expect(onClick).toHaveBeenCalledOnce();
        });

        it("should keep its look when it points to the current route", async () => {
          const { wrapper, router } = await mountRouteButton({ route: "/patients" });
          expect(wrapper.attributes("aria-current")).toBeUndefined();

          await router.push("/patients");

          expect(wrapper.attributes("aria-current")).toBe("page");
          expect(wrapper.classes()).not.toContain("v-btn--active");
        });

        it("should follow changes of the route", async () => {
          const { wrapper } = await mountRouteButton({ route: "/patients" });
          expect(wrapper.attributes("href")).toBe("/patients");

          await wrapper.setProps({ route: "/home" });
          expect(wrapper.attributes("href")).toBe("/home");

          await wrapper.setProps({ route: undefined });
          expect(wrapper.element.tagName).toBe("BUTTON");
          expect(wrapper.attributes("href")).toBeUndefined();
        });
      });

      describe("starting with http", () => {
        it("should render a link with the URL as href", async () => {
          const { wrapper } = await mountRouteButton({ route: externalUrl });
          const vBtn = findVBtn(wrapper);

          expect(vBtn.props("href")).toBe(externalUrl);
          expect(vBtn.props("to")).toBeUndefined();
          expect(wrapper.element.tagName).toBe("A");
          expect(wrapper.attributes("href")).toBe(externalUrl);
          expect(wrapper.attributes("target")).toBeUndefined();
        });

        it("should not navigate through the router when clicked", async () => {
          const onClick = vi.fn();
          const { wrapper, router } = await mountRouteButton({ route: externalUrl }, { onClick });
          const push = vi.spyOn(router, "push");

          await wrapper.trigger("click");
          await flushPromises();

          expect(push).not.toHaveBeenCalled();
          expect(router.currentRoute.value.path).toBe("/home");
          expect(onClick).toHaveBeenCalledOnce();
        });
      });

      it("should ignore `type` and `form`, which don't apply to a link", async () => {
        const { wrapper } = await mountRouteButton({
          route: "/patients",
          type: "submit",
          form: "form-id",
        });

        expect(wrapper.element.tagName).toBe("A");
        expect(wrapper.attributes("type")).toBeUndefined();
        expect(wrapper.attributes("form")).toBeUndefined();
      });

      it.each([
        ["disabled", { disabled: true }],
        ["loading", { loading: true }],
      ])(
        "should render a disabled button that doesn't navigate while %s",
        async (_, blockingProps) => {
          const onClick = vi.fn();
          const { wrapper, router } = await mountRouteButton(
            { route: "/patients", type: "submit", form: "form-id", ...blockingProps },
            { onClick },
          );
          const vBtn = findVBtn(wrapper);

          expect(vBtn.props("to")).toBeUndefined();
          expect(vBtn.props("href")).toBeUndefined();
          expect(wrapper.element.tagName).toBe("BUTTON");
          expect(wrapper.attributes("href")).toBeUndefined();
          expect(wrapper.attributes("disabled")).toBe("");
          expect(wrapper.attributes("type")).toBe("button");
          expect(wrapper.attributes("form")).toBeUndefined();

          wrapper.element.click();
          await flushPromises();
          expect(router.currentRoute.value.path).toBe("/home");
          expect(onClick).not.toHaveBeenCalled();

          await wrapper.setProps({ disabled: false, loading: false });
          expect(wrapper.element.tagName).toBe("A");
          expect(wrapper.attributes("href")).toBe("/patients");
        },
      );
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
        wrapper.element.click();

        expect(onClick).not.toHaveBeenCalled();
        expect(wrapper.emitted("click")).toBeUndefined();
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

/** Mounts the button with the given props, in an app with a router at `/home`. */
async function mountRouteButton(props: ButtonProps, attrs: Record<string, unknown> = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/home", component: {} },
      { path: "/patients", name: "patients", component: {} },
    ],
  });
  await router.push("/home");

  const wrapper = mount(Button, {
    props,
    attrs: { "data-testid": testId, ...attrs },
    global: {
      plugins: [vueTestUtilsPluginUimed(), router],
    },
  });

  return { wrapper, router };
}

function findVBtn(wrapper: VueWrapper) {
  return wrapper.findComponent(VBtn);
}

/** Creates a form in the document, with a spy that prevents its submissions. */
function createForm() {
  const form = document.createElement("form");
  form.id = "form-id";
  form.onsubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
  document.body.append(form);
  return form;
}
