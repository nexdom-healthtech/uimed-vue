import { VApp, VMain } from "vuetify/components";
import Root from "@/components/root/root.vue";
import { mount } from "@vue/test-utils";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import { Container } from "@/components/index.ts";
import Toast from "@/components/dialogs/toast.vue";
import AppBar from "@/components/app-bar/app-bar.vue";
import NavigationMenu from "@/components/navigation-menu/navigation-menu.vue";
import { nextTick } from "vue";

const testId = "root-test-component";
const styleValue = "random-style";
const classValue = "random-class";

describe("Root", () => {
  let wrapper = mountRoot();

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

  describe("props", () => {
    beforeEach(() => (wrapper = mountRoot()));

    describe("logo", () => {
      it("should forward logo to app bar", async () => {
        const logo = "/logo.svg";
        await wrapper.setProps({ logo, appBar: { title: "" } });

        const appBar = findAppBar(wrapper);
        expect(appBar.exists()).toBeTruthy();
        expect(appBar.props("logo")).toBe(logo);
      });
    });

    describe("appBar", () => {
      const title = "AI Chat";

      it("should only load app bar when its prop is filled", async () => {
        let appBar = findAppBar(wrapper);
        expect(appBar.exists()).toBeFalsy();

        const title = "Application";
        await wrapper.setProps({ appBar: { title } });

        appBar = findAppBar(wrapper);
        expect(appBar.exists()).toBeTruthy();
      });

      it("should forward props to the app bar", async () => {
        await wrapper.setProps({ appBar: { title } });

        const appBar = findAppBar(wrapper);
        expect(appBar.props("title")).toBe(title);
      });

      it("should reflect navigation menu presence in the navigation prop", async () => {
        await wrapper.setProps({ appBar: { title }, navigationMenu: undefined });
        expect(findAppBar(wrapper).props("navigation")).toBe(false);

        await wrapper.setProps({ navigationMenu: { items: [{ description: "Home" }] } });
        expect(findAppBar(wrapper).props("navigation")).toBe(true);

        // Cleanup for subsequent tests
        await wrapper.setProps({ navigationMenu: undefined });
      });

      describe("notificationsOpen", () => {
        it("should forward notificationsOpen prop to the app bar", async () => {
          await wrapper.setProps({ appBar: { title }, notificationsOpen: true });

          const appBar = findAppBar(wrapper);
          expect(appBar.props("notificationsOpen")).toBe(true);
        });

        it("should emit update:notificationsOpen when the app bar emits it", async () => {
          await wrapper.setProps({ appBar: { title }, notificationsOpen: false });

          const appBar = findAppBar(wrapper);
          appBar.vm.$emit("update:notificationsOpen", true);

          expect(wrapper.emitted("update:notificationsOpen")?.at(-1)).toEqual([true]);
        });
      });
    });

    describe("navigationMenu", () => {
      const items = [{ description: "Home", route: "/" }];

      it("should only load navigation menu when its prop is filled", async () => {
        expect(wrapper.findComponent(NavigationMenu).exists()).toBeFalsy();

        await wrapper.setProps({ navigationMenu: { items } });

        const navigationMenu = wrapper.findComponent(NavigationMenu);
        expect(navigationMenu.exists()).toBeTruthy();
        expect(navigationMenu.props("modelValue")).toBeFalsy();

        await wrapper.setData({ navigationMenuOpen: true });
        expect(navigationMenu.props("modelValue")).toBeTruthy();
      });

      it("should forward props to the navigation menu", async () => {
        await wrapper.setProps({ navigationMenu: { items } });

        const navigationMenu = findNavigationMenu(wrapper);
        expect(navigationMenu.props("items")).toEqual(items);
      });

      it("should open the navigation menu when the app bar emits update:navigationOpen", async () => {
        await wrapper.setProps({ appBar: { title: "AI Chat" }, navigationMenu: { items } });

        const appBar = findAppBar(wrapper);
        const navigationMenu = findNavigationMenu(wrapper);

        appBar.vm.$emit("update:navigationOpen", true);
        await nextTick();

        expect(navigationMenu.props("modelValue")).toBe(true);
      });

      it("should sync the app bar when the navigation menu emits update:modelValue", async () => {
        await wrapper.setProps({ appBar: { title: "AI Chat" }, navigationMenu: { items } });

        const appBar = findAppBar(wrapper);
        const navigationMenu = findNavigationMenu(wrapper);

        navigationMenu.vm.$emit("update:modelValue", false);
        await nextTick();

        expect(appBar.props("navigationOpen")).toBe(false);
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

function findNavigationMenu(wrapper: ReturnType<typeof mountRoot>) {
  return wrapper.findComponent(NavigationMenu);
}
