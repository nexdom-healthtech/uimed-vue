import { VNavigationDrawer, VListItem, VListGroup, VSkeletonLoader } from "vuetify/components";
import NavigationMenu from "@/components/navigation-menu/navigation-menu.vue";
import TextField from "@/components/inputs/text-field/text-field.vue";
import { owners } from "@/composables/navigation/use-navigation-search-shortcut.ts";
import { flushPromises, mount } from "@vue/test-utils";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import type {
  NavigationMenuItem,
  NavigationMenuParentItem,
} from "@/components/navigation-menu/types.ts";

const testId = "navigation-menu-test-component";
const styleValue = "random-style";
const classValue = "random-class";

describe("NavigationMenu", () => {
  let wrapper = mountNavigationMenu();
  beforeEach(() => (wrapper = mountNavigationMenu()));

  it("should exists", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    const vNavigationDrawer = findVNavigationDrawer(wrapper);
    expect(vNavigationDrawer.exists()).toBeTruthy();
    expect(vNavigationDrawer.props("temporary")).toBeTruthy();
    expect(vNavigationDrawer.props("absolute")).toBeTruthy();
  });

  it("should use the primary color", () => {
    expect(findVNavigationDrawer(wrapper).props("color")).toBe("primary");
  });

  it('should inherit "data-testid" attribute', () => {
    expect(wrapper.attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).toBeUndefined();
  });

  describe("props", () => {
    const firstItem = { description: "First item", route: "/first" };
    const secondItem = { description: "Second item", route: "https://google.com" };
    const thirdItem = { description: "Third item", action: vi.fn() };
    const items: Array<NavigationMenuItem> = [firstItem, secondItem, thirdItem];

    const parentItemFirstChild = { description: "First group first item", route: "/first-first" };
    const parentItemSecondChild = { description: "First group second item", action: vi.fn() };
    const parentItem = {
      description: "First group",
      items: [parentItemFirstChild, parentItemSecondChild],
    };
    const parentItems: Array<NavigationMenuParentItem> = [parentItem];

    describe("items", () => {
      it("should not render any items when items prop is omitted", () => {
        const vListItems = findVListItems(wrapper);
        expect(vListItems).toHaveLength(0);
      });

      it("should render plain items with correct title", async () => {
        await wrapper.setProps({ items });

        const vListItems = findVListItems(wrapper);
        expect(vListItems).toHaveLength(items.length);

        expect(vListItems[0].props("title")).toBe(firstItem.description);
        expect(vListItems[1].props("title")).toBe(secondItem.description);
      });

      it("should handle plain item with local route", async () => {
        await wrapper.setProps({ items });

        const [vListItem] = findVListItems(wrapper);
        expect(vListItem.props("to")).toBe(firstItem.route);
        expect(vListItem.props("href")).toBeUndefined();
      });

      it("should handle plain item with external route", async () => {
        await wrapper.setProps({ items });

        const vListItem = findVListItems(wrapper)[1];
        expect(vListItem.props("href")).toBe(secondItem.route);
        expect(vListItem.props("to")).toBeUndefined();
      });

      it("should trigger action callback when plain item is clicked", async () => {
        await wrapper.setProps({ items });

        const { action } = thirdItem;
        expect(action).not.toHaveBeenCalled();

        const vListItem = findVListItems(wrapper)[2];
        await vListItem.trigger("click");

        expect(action).toHaveBeenCalledOnce();
      });

      it("should render grouped items correctly", async () => {
        await wrapper.setProps({ items: parentItems });

        const vListGroups = findVListGroups(wrapper);
        expect(vListGroups).toHaveLength(parentItems.length);

        const [vListGroup] = vListGroups;
        expect(vListGroup.exists()).toBeTruthy();

        const groupActivator = vListGroup.findComponent(VListItem);
        expect(groupActivator.props("title")).toBe(parentItem.description);
      });

      it("should render grouped items' children correctly", async () => {
        await wrapper.setProps({ items: parentItems });

        const [vListGroup] = findVListGroups(wrapper);
        await vListGroup.trigger("click");

        const allGroupItems = vListGroup.findAllComponents(VListItem);
        const childItems = allGroupItems.slice(1);
        expect(childItems).toHaveLength(parentItem.items.length);

        expect(childItems[0].props("title")).toBe(parentItemFirstChild.description);
        expect(childItems[0].props("to")).toBe(parentItemFirstChild.route);

        expect(childItems[1].props("title")).toBe(parentItemSecondChild.description);
      });

      it("should trigger child action when grouped child item is clicked", async () => {
        await wrapper.setProps({ items: parentItems });

        const { action } = parentItemSecondChild;
        expect(action).not.toHaveBeenCalled();

        const vListGroup = findVListGroups(wrapper)[0];
        await vListGroup.trigger("click");

        const childItem = vListGroup.findAllComponents(VListItem)[2];
        await childItem.trigger("click");

        expect(action).toHaveBeenCalledOnce();
      });

      it("should render a mix of plain and grouped items correctly", async () => {
        const mixedItems = [...items, ...parentItems];
        await wrapper.setProps({ items: mixedItems });

        const vListGroups = findVListGroups(wrapper);
        expect(vListGroups).toHaveLength(parentItems.length);

        // Find the plain item (should be a direct VListItem that's not in a group)
        const [plainItem] = wrapper.findAllComponents(VListItem);
        expect(plainItem.exists()).toBeTruthy();
        expect(plainItem.props("title")).toBe(firstItem.description);
        expect(plainItem.props("to")).toBe(firstItem.route);

        // Find the group's activator
        const groupActivator = vListGroups[0].findComponent(VListItem);
        expect(groupActivator.exists()).toBeTruthy();
        expect(groupActivator.props("title")).toBe(parentItem.description);
      });
    });

    describe("icon", () => {
      const homeItem: NavigationMenuItem = { description: "Home", route: "/", icon: "home" };
      const hospitalItem: NavigationMenuItem = { description: "Units", icon: "hospital" };
      const iconParentItem: NavigationMenuParentItem = {
        description: "Settings",
        icon: "cog-outline",
        items: [{ description: "Profile", icon: "account-outline" }, parentItemFirstChild],
      };

      it("should show the icon of a plain item before its description", async () => {
        await wrapper.setProps({ items: [homeItem, hospitalItem] });

        const [homeListItem, hospitalListItem] = findVListItems(wrapper);
        expect(homeListItem.props("prependIcon")).toBe("mdi-home");
        expect(hospitalListItem.props("prependIcon")).toBe("mdi-hospital-building");
      });

      it("should show the icon of a group before its description", async () => {
        await wrapper.setProps({ items: [iconParentItem] });

        const groupActivator = findVListGroups(wrapper)[0].findComponent(VListItem);
        expect(groupActivator.props("prependIcon")).toBe("mdi-cog-outline");
      });

      it("should show the icon of an item inside a group before its description", async () => {
        await wrapper.setProps({ items: [iconParentItem] });

        const [vListGroup] = findVListGroups(wrapper);
        await vListGroup.trigger("click");

        const [, profileItem, firstChildItem] = vListGroup.findAllComponents(VListItem);
        expect(profileItem.props("prependIcon")).toBe("mdi-account-outline");
        expect(firstChildItem.props("prependIcon")).toBeUndefined();
      });

      it("should show no icon when the item or group has none", async () => {
        await wrapper.setProps({ items: [firstItem, parentItem] });

        const [vListGroup] = findVListGroups(wrapper);
        await vListGroup.trigger("click");

        const vListItems = findVListItems(wrapper);
        expect(vListItems).toHaveLength(4); // plain item + group activator + 2 children
        for (const vListItem of vListItems) {
          expect(vListItem.props("prependIcon")).toBeUndefined();
        }
        expect(wrapper.find(".v-list-item__prepend").exists()).toBeFalsy();
      });

      it("should keep the icon out of the item's accessible name", async () => {
        await wrapper.setProps({ items: [homeItem] });

        const [vListItem] = findVListItems(wrapper);
        expect(vListItem.find(".mdi-home").attributes("aria-hidden")).toBe("true");
        expect(vListItem.text()).toBe(homeItem.description);
      });
    });

    describe("model", () => {
      it("should forward v-model value to navigation drawer", async () => {
        const vNavigationDrawer = findVNavigationDrawer(wrapper);
        expect(vNavigationDrawer.props("modelValue")).toBeFalsy();

        await wrapper.setProps({ modelValue: true });
        expect(vNavigationDrawer.props("modelValue")).toBeTruthy();
      });

      it("should emit update:modelValue when navigation drawer changes", async () => {
        const vNavigationDrawer = findVNavigationDrawer(wrapper);
        expect(wrapper.emitted("update:modelValue")).toBeFalsy();

        await vNavigationDrawer.setValue(true);

        const emitted = wrapper.emitted("update:modelValue");
        expect(emitted).toBeTruthy();
        expect(emitted?.[0]).toEqual([true]);
      });

      it("should accept initial v-model value", () => {
        const newWrapper = mount(NavigationMenu, {
          props: { modelValue: false },
          global: {
            stubs: {
              VNavigationDrawer: {
                props: ["modelValue"],
                emits: ["update:modelValue"],
                template: `<div v-bind="$props"><slot name="prepend" /><slot /></div>`,
              },
            },
            plugins: [vueTestUtilsPluginUimed()],
          },
        });

        const vNavigationDrawer = findVNavigationDrawer(newWrapper);
        expect(vNavigationDrawer.props("modelValue")).toBe(false);
      });
    });

    describe("loading", () => {
      it("should render the items instead of the skeleton loader by default", async () => {
        await wrapper.setProps({ items });

        const vSkeletonLoader = findVSkeletonLoader(wrapper);
        expect(vSkeletonLoader.props("loading")).toBe(false);
        expect(vSkeletonLoader.find(".v-skeleton-loader").exists()).toBeFalsy();
        expect(findVListItems(wrapper)).toHaveLength(items.length);
      });

      it("should show list item skeletons in place of the items while loading", async () => {
        await wrapper.setProps({ items, loading: true });

        const vSkeletonLoader = findVSkeletonLoader(wrapper);
        expect(vSkeletonLoader.props("loading")).toBe(true);
        expect(vSkeletonLoader.props("type")).toBe("list-item@6");
        // Matches the menu's primary background, so the skeleton doesn't draw a light box over it
        expect(vSkeletonLoader.props("color")).toBe("primary");
        expect(vSkeletonLoader.findAll(".v-skeleton-loader__list-item")).toHaveLength(6);
        expect(findVListItems(wrapper)).toHaveLength(0);
      });

      it("should disable the search field only while loading", async () => {
        expect(findTextField(wrapper).props("disabled")).toBe(false);

        await wrapper.setProps({ loading: true });
        expect(findTextField(wrapper).props("disabled")).toBe(true);
      });

      it("should keep the search and show the filtered items when loading ends", async () => {
        await wrapper.setProps({ items });
        await findTextField(wrapper).setValue(thirdItem.description);

        await wrapper.setProps({ loading: true });
        expect(findTextField(wrapper).props("modelValue")).toBe(thirdItem.description);

        await wrapper.setProps({ loading: false });

        const vListItems = findVListItems(wrapper);
        expect(vListItems).toHaveLength(1);
        expect(vListItems[0].props("title")).toBe(thirdItem.description);
      });

      it("should mark the navigation drawer as busy only while loading", async () => {
        expect(wrapper.attributes("aria-busy")).toBeUndefined();

        await wrapper.setProps({ loading: true });
        expect(wrapper.attributes("aria-busy")).toBe("true");

        await wrapper.setProps({ loading: false });
        expect(wrapper.attributes("aria-busy")).toBeUndefined();
      });
    });

    describe("search", () => {
      it("should render the search field", () => {
        const textField = findTextField(wrapper);
        expect(textField.exists()).toBeTruthy();
      });

      it("should render the search field with correct data-testid", () => {
        const textField = findTextField(wrapper);
        expect(textField.props("dataTestid")).toBe(`${testId}-search`);
      });

      it("should show the shortcut in the placeholder instead of a label", () => {
        const textField = findTextField(wrapper);
        expect(textField.props("placeholder")).toBe("Buscar (Ctrl+K)");
        expect(textField.props("label")).toBeUndefined();
        expect(textField.find("input").attributes("aria-label")).toBe("Buscar");
      });

      it("should filter plain items by description", async () => {
        await wrapper.setProps({ items });

        const textField = findTextField(wrapper);
        await textField.setValue(thirdItem.description);

        const vListItems = findVListItems(wrapper);
        expect(vListItems).toHaveLength(1);
        expect(vListItems[0].props("title")).toBe(thirdItem.description);
      });

      it("should keep group when group's own description matches", async () => {
        await wrapper.setProps({ items: parentItems });

        const textField = findTextField(wrapper);
        await textField.setValue(parentItem.description);

        const vListGroups = findVListGroups(wrapper);
        expect(vListGroups).toHaveLength(parentItems.length);

        const groupActivator = vListGroups[0].findComponent(VListItem);
        expect(groupActivator.props("title")).toBe(parentItem.description);

        await vListGroups[0].trigger("click");
        const groupItems = vListGroups[0].findAllComponents(VListItem);
        expect(groupItems).toHaveLength(parentItem.items.length + 1); // activator + 2 children
      });

      it("should narrow group to matching children only", async () => {
        await wrapper.setProps({ items: parentItems });

        const textField = findTextField(wrapper);
        await textField.setValue(parentItemSecondChild.description);

        const vListGroups = findVListGroups(wrapper);
        expect(vListGroups).toHaveLength(1);

        await vListGroups[0].trigger("click");
        const groupItems = vListGroups[0].findAllComponents(VListItem);
        expect(groupItems).toHaveLength(2); // activator + 1 matching child

        const childItem = groupItems[1];
        expect(childItem.props("title")).toBe(parentItemSecondChild.description);
      });

      it("should exclude group when neither the group nor its children match", async () => {
        await wrapper.setProps({ items: parentItems });

        const textField = findTextField(wrapper);
        await textField.setValue("Not there");

        const vListGroups = findVListGroups(wrapper);
        expect(vListGroups).toHaveLength(0);
      });

      it("should render zero items when no matches are found", async () => {
        await wrapper.setProps({ items });

        const textField = findTextField(wrapper);
        await textField.setValue("Not there");

        const vListItems = findVListItems(wrapper);
        expect(vListItems).toHaveLength(0);
      });

      it("should restore full list when search is cleared", async () => {
        await wrapper.setProps({ items });

        const textField = findTextField(wrapper);
        await textField.setValue(firstItem.description);

        let vListItems = findVListItems(wrapper);
        expect(vListItems).toHaveLength(1);

        await textField.setValue("");

        vListItems = findVListItems(wrapper);
        expect(vListItems).toHaveLength(items.length);
      });

      it("should match case-insensitively", async () => {
        await wrapper.setProps({ items });

        const { description } = firstItem;

        const textField = findTextField(wrapper);
        await textField.setValue(description.toUpperCase());

        const vListItems = findVListItems(wrapper);
        expect(vListItems).toHaveLength(1);
        expect(vListItems[0].props("title")).toBe(description);
      });
    });
  });

  describe("shortcut", () => {
    let attached: ReturnType<typeof mountNavigationMenu>;

    beforeEach(() => {
      // Menus mounted by previous tests would answer the shortcut first
      owners.value = [];
      attached = mountAttached();
    });

    afterEach(() => attached.unmount());

    function mountAttached() {
      return mountNavigationMenu({ attachTo: document.body });
    }

    async function pressShortcut() {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
      await flushPromises();
    }

    it("should open the menu and focus the search with Ctrl+K", async () => {
      await pressShortcut();

      expect(attached.emitted("update:modelValue")?.[0]).toEqual([true]);
      expect(document.activeElement).toBe(findTextField(attached).find("input").element);
    });

    it("should open the menu without focusing the search while loading", async () => {
      await attached.setProps({ loading: true });

      await pressShortcut();

      expect(attached.emitted("update:modelValue")?.[0]).toEqual([true]);
      expect(document.activeElement).toBe(document.body);
    });

    it("should close the menu with Escape", async () => {
      await attached.setProps({ modelValue: true });

      await findTextField(attached).find("input").trigger("keydown", { key: "Escape" });

      expect(attached.emitted("update:modelValue")?.[0]).toEqual([false]);
    });
  });
});

function mountNavigationMenu(options: { attachTo?: HTMLElement } = {}) {
  return mount(NavigationMenu, {
    ...options,
    attrs: {
      "data-testid": testId,
      style: styleValue,
      class: classValue,
    },
    global: {
      stubs: {
        VNavigationDrawer: {
          props: { modelValue: String, color: String, temporary: Boolean, absolute: Boolean },
          emits: ["update:modelValue"],
          // The inner element stands for the drawer's own, which holds the focus while it's open
          template: `
            <div v-bind="{ 'data-testid': $attrs['data-testid'] }">
              <div class="v-navigation-drawer">
                <slot name="prepend" />
                <slot />
              </div>
            </div>
          `,
        },
      },
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findVNavigationDrawer(wrapper: ReturnType<typeof mountNavigationMenu>) {
  return wrapper.findComponent(VNavigationDrawer);
}

function findTextField(wrapper: ReturnType<typeof mountNavigationMenu>) {
  return wrapper.findComponent(TextField);
}

function findVListItems(wrapper: ReturnType<typeof mountNavigationMenu>) {
  return wrapper.findAllComponents(VListItem);
}

function findVSkeletonLoader(wrapper: ReturnType<typeof mountNavigationMenu>) {
  return wrapper.findComponent(VSkeletonLoader);
}

function findVListGroups(wrapper: ReturnType<typeof mountNavigationMenu>) {
  return wrapper.findAllComponents(VListGroup);
}
