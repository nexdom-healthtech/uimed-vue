import { VApp, VBtn, VCard, VMain } from "vuetify/components";
import Main from "@/components/main/main.vue";
import { flushPromises, mount } from "@vue/test-utils";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import { UContainer } from "@/components/index.ts";
import Toast from "@/components/dialogs/toast.vue";
import DialogHost from "@/components/dialogs/dialog-host.vue";
import AppBar from "@/components/app-bar/app-bar.vue";
import NavigationMenu from "@/components/navigation-menu/navigation-menu.vue";
import Footer from "@/components/footer/footer.vue";
import { owners } from "@/composables/navigation/use-navigation-search-shortcut.ts";
import { nextTick } from "vue";

const testId = "main-test-component";
const styleValue = "random-style";
const classValue = "random-class";

describe("Main", () => {
  let wrapper = mountMain();

  it("should exists", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary components", () => {
    expect(wrapper.findComponent(VApp).exists()).toBeTruthy();
    expect(wrapper.findComponent(VMain).exists()).toBeTruthy();
    expect(wrapper.findComponent(UContainer).exists()).toBeTruthy();
  });

  it("should give the full height of the content area to the page", () => {
    expect(wrapper.findComponent(UContainer).props("fullHeight")).toBe(true);
  });

  it("should contain toast component", () => {
    const toast = wrapper.findComponent(Toast);
    expect(toast.exists()).toBeTruthy();
  });

  it("should contain dialog component", () => {
    const dialog = wrapper.findComponent(DialogHost);
    expect(dialog.exists()).toBeTruthy();
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
    beforeEach(() => (wrapper = mountMain()));

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

        await wrapper.setProps({
          navigationMenu: { items: [{ description: "Home", icon: "home" }] },
        });
        expect(findAppBar(wrapper).props("navigation")).toBe(true);

        // Cleanup for subsequent tests
        await wrapper.setProps({ navigationMenu: undefined });
      });

      it("should only show the navigation button below the mobile breakpoint", async () => {
        window.innerWidth = 1280;
        window.dispatchEvent(new Event("resize"));
        const desktop = mountMain();

        try {
          await desktop.setProps({ appBar: { title }, navigationMenu: { items: [] } });

          // The navigation menu is a rail, always visible, above the mobile breakpoint
          expect(findAppBar(desktop).props("navigation")).toBe(false);

          window.innerWidth = 1024;
          window.dispatchEvent(new Event("resize"));
          await flushPromises();

          expect(findAppBar(desktop).props("navigation")).toBe(true);
        } finally {
          window.innerWidth = 1024;
          window.dispatchEvent(new Event("resize"));
          desktop.unmount();
        }
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
      const items = [{ description: "Home", route: "/", icon: "home" as const }];

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

      it("should open the navigation menu and sync the app bar with Ctrl+K", async () => {
        // Menus mounted by previous tests would answer the shortcut first
        owners.value = [];
        await wrapper.setProps({ appBar: { title: "AI Chat" }, navigationMenu: { items } });

        window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
        await flushPromises();

        expect(findNavigationMenu(wrapper).props("modelValue")).toBe(true);
        expect(findAppBar(wrapper).props("navigationOpen")).toBe(true);
      });
    });

    describe("loading", () => {
      const appBar = { title: "AI Chat" };
      const navigationMenu = {
        items: [{ description: "Home", route: "/", icon: "home" as const }],
      };

      it("should not be loading by default", async () => {
        await wrapper.setProps({ appBar, navigationMenu });

        expect(findAppBar(wrapper).props("loading")).toBe(false);
        expect(findNavigationMenu(wrapper).props("loading")).toBe(false);
      });

      it("should forward loading to the app bar and the navigation menu", async () => {
        await wrapper.setProps({ appBar, navigationMenu, loading: true });

        expect(findAppBar(wrapper).props("loading")).toBe(true);
        expect(findNavigationMenu(wrapper).props("loading")).toBe(true);
      });
    });

    describe("footer", () => {
      const description = "Versão 1.4.2";

      it("should not render the footer when its prop is omitted", () => {
        expect(findFooter(wrapper).exists()).toBe(false);
      });

      it("should not render the footer without a description", async () => {
        await wrapper.setProps({ footer: {} });

        expect(findFooter(wrapper).exists()).toBe(false);
      });

      it("should not render the footer with an empty description", async () => {
        await wrapper.setProps({ footer: { description: "" } });

        expect(findFooter(wrapper).exists()).toBe(false);
      });

      it("should render the footer when it has a description", async () => {
        await wrapper.setProps({ footer: { description } });

        expect(findFooter(wrapper).exists()).toBe(true);
      });

      it("should forward props to the footer", async () => {
        const footer = { description, dataTestid: "main-footer" };
        await wrapper.setProps({ footer });

        expect(findFooter(wrapper).props()).toEqual(footer);
      });

      it("should not be affected by loading", async () => {
        await wrapper.setProps({ footer: { description }, loading: true });

        expect(findFooter(wrapper).props()).toEqual({ description, dataTestid: undefined });
      });

      it("should remove the footer when its description is cleared", async () => {
        await wrapper.setProps({ footer: { description } });
        expect(findFooter(wrapper).exists()).toBe(true);

        await wrapper.setProps({ footer: { description: "" } });

        expect(findFooter(wrapper).exists()).toBe(false);
      });
    });

    describe("background", () => {
      it("should keep the default background when omitted", () => {
        expect(findBackgroundClasses(wrapper)).toEqual([]);
      });

      it("should apply the background color to the app", async () => {
        await wrapper.setProps({ background: "informative" });

        expect(findBackgroundClasses(wrapper)).toEqual(["bg-info"]);
      });

      it("should change and remove the background color", async () => {
        await wrapper.setProps({ background: "primary" });
        expect(findBackgroundClasses(wrapper)).toEqual(["bg-primary"]);

        await wrapper.setProps({ background: "danger" });
        expect(findBackgroundClasses(wrapper)).toEqual(["bg-error"]);

        await wrapper.setProps({ background: undefined });
        expect(findBackgroundClasses(wrapper)).toEqual([]);
      });

      it("should only apply the background color to the app", async () => {
        await wrapper.setProps({
          background: "primary",
          appBar: { title: "AI Chat" },
          footer: { description: "Versão 1.4.2" },
        });

        const coloredElements = wrapper.findAll("[class*='bg-']");
        expect(coloredElements).toHaveLength(1);
        expect(coloredElements[0]?.classes()).toContain("v-application");
      });

      it("should not inherit unexpected attributes", async () => {
        await wrapper.setProps({ background: "primary" });

        expect(wrapper.attributes("style")).toBeUndefined();
        expect(wrapper.classes()).not.toContain(classValue);
      });
    });
  });

  describe("slots", () => {
    describe("user-section-details", () => {
      it("should pass the details to the user menu of the app bar", async () => {
        const detailsWrapper = mount(Main, {
          props: { appBar: { user: { title: "Beetlejuice" } } },
          slots: { "user-section-details": '<strong data-testid="details">Unimed</strong>' },
          global: { plugins: [vueTestUtilsPluginUimed()] },
        });
        const appBar = findAppBar(detailsWrapper);
        expect(appBar.vm.$slots["user-section-details"]).toBeDefined();

        await appBar.findComponent(VBtn).trigger("click");

        expect(appBar.findComponent(VCard).find('[data-testid="details"]').text()).toBe("Unimed");
      });

      it("should not pass an empty slot to the app bar without details", async () => {
        await wrapper.setProps({ appBar: { user: { title: "Beetlejuice" } } });

        expect(findAppBar(wrapper).vm.$slots["user-section-details"]).toBeUndefined();
      });
    });
  });
});

function findBackgroundClasses(wrapper: ReturnType<typeof mountMain>) {
  return wrapper.classes().filter((className) => className.startsWith("bg-"));
}

function mountMain() {
  return mount(Main, {
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

function findAppBar(wrapper: ReturnType<typeof mountMain>) {
  return wrapper.findComponent(AppBar);
}

function findNavigationMenu(wrapper: ReturnType<typeof mountMain>) {
  return wrapper.findComponent(NavigationMenu);
}

function findFooter(wrapper: ReturnType<typeof mountMain>) {
  return wrapper.findComponent(Footer);
}
