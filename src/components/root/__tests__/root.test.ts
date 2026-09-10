import { VApp, VMain } from "vuetify/components";
import Root from "@/components/root/root.vue";
import { mount } from "@vue/test-utils";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import { Container } from "@/components/index.ts";
import Toast from "@/components/dialogs/toast.vue";
import AppBar from "@/components/app-bar/app-bar.vue";

const testId = "root-test-component";
const styleValue = "random-style";
const classValue = "random-class";

describe("Root", () => {
  const wrapper = mountRoot();

  it("should exists", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary components", () => {
    expect(wrapper.findComponent(VApp).exists()).toBeTruthy();
    expect(wrapper.findComponent(VMain).exists()).toBeTruthy();
    expect(wrapper.findComponent(Container).exists()).toBeTruthy();
  });

  it("should contain toast component", () => {
    const toast = wrapper.findComponent(Toast);
    expect(toast.exists()).toBeTruthy();
  });

  it('should inherit "data-testid" attribute', () => {
    expect(wrapper.attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).not.toBeUndefined();
    expect(wrapper.attributes("class")).not.toContain(classValue);
  });

  it("should load app bar when its prop is filled", async () => {
    expect(wrapper.findComponent(AppBar).exists()).toBeFalsy();

    const title = "Application";
    await wrapper.setProps({ appBar: { title } });
    expect(wrapper.findComponent(AppBar).exists()).toBeTruthy();
  });

  describe("props", () => {
    describe("appBar", () => {
      it("should forward props to the app bar", async () => {
        const title = "AI Chat";
        await wrapper.setProps({ appBar: { title } });

        const appBar = findAppBar(wrapper);
        expect(appBar.props("title")).toBe(title);
      });
    });
  });
});

function mountRoot() {
  return mount(Root, {
    attrs: {
      "data-testid": testId,
      style: styleValue,
      class: classValue,
    },
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findAppBar(wrapper: ReturnType<typeof mountRoot>) {
  return wrapper.findComponent(AppBar);
}
