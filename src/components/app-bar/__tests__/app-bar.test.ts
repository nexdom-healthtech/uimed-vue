import { VAppBar, VBtn } from "vuetify/components";
import AppBar from "@/components/app-bar/app-bar.vue";
import { mount } from "@vue/test-utils";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import useRouteProps from "@/composables/navigation/use-route-props.ts";

const testId = "app-bar-test-component";
const styleValue = "random-style";
const classValue = "random-class";

vi.mock(import("@/composables/navigation/use-route-props.ts"), { spy: true });

describe("AppBar", () => {
  const wrapper = mountAppBar();

  it("should exists", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    expect(wrapper.findComponent(VAppBar).exists()).toBeTruthy();
  });

  it('should inherit "data-testid" attribute', () => {
    expect(wrapper.attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).toBeUndefined();
  });

  describe("props", () => {
    describe("title", () => {
      it("should forward title to the app bar", async () => {
        const title = "AI Chat";
        await wrapper.setProps({ title });

        const vAppBar = findVAppBar(wrapper);
        expect(vAppBar.props("title")).toBe(title);
      });
    });

    describe("help", () => {
      const help = "/help";

      it("should add a button to navigate to help page", async () => {
        let vBtn = wrapper.findComponent(VBtn);
        expect(vBtn.exists()).toBeFalsy();

        await wrapper.setProps({ help });

        vBtn = wrapper.findComponent(VBtn);
        expect(vBtn.exists()).toBeTruthy();
        expect(vBtn.props("icon")).toBe("mdi-help-circle-outline");
      });

      it("should use route props composable and propagate it's result", async () => {
        expect(useRouteProps).not.toHaveBeenCalled();

        const newWrapper = mountAppBar();
        expect(useRouteProps).toHaveBeenCalledOnce();

        await newWrapper.setProps({ help });

        const vBtn = newWrapper.findComponent(VBtn);
        expect(vBtn.props("to")).toBe(help);
        expect(vBtn.props("href")).toBeUndefined();
      });
    });
  });
});

function mountAppBar() {
  return mount(AppBar, {
    attrs: {
      "data-testid": testId,
      style: styleValue,
      class: classValue,
    },
    global: {
      stubs: {
        VAppBar: {
          props: ["title"],
          template: `
            <div v-bind="$props">
              <slot />
              <slot name="append" />
            </div>
          `,
        },
      },
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findVAppBar(wrapper: ReturnType<typeof mountAppBar>) {
  return wrapper.findComponent(VAppBar);
}
