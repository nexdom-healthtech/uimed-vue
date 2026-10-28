import { mdiCogOutline, mdiHome, mdiHospitalBuilding, mdiMagnify } from "@mdi/js";
import {
  VDefaultsProvider,
  VNavigationDrawer,
  VList,
  VListItem,
  VListGroup,
  VSkeletonLoader,
  VTextField,
} from "vuetify/components";
import NavigationMenu from "@/components/navigation-menu/navigation-menu.vue";
import TextField from "@/components/inputs/text-field/text-field.vue";
import { owners } from "@/composables/navigation/use-navigation-search-shortcut.ts";
import { flushPromises, mount, renderToString } from "@vue/test-utils";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import type { Plugin } from "vue";
import { createMemoryHistory, createRouter, type Router } from "vue-router";
import type {
  NavigationMenuItem,
  NavigationMenuParentItem,
} from "@/components/navigation-menu/types.ts";

const testId = "navigation-menu-test-component";
const styleValue = "random-style";
const classValue = "random-class";
const DESKTOP_WIDTH = 1280;
const MOBILE_WIDTH = 1024;

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
  });

  // Positioned by the app's layout, the menu stays fixed on the screen while the page scrolls
  it("should stay fixed on the screen, between the app bar and the footer", () => {
    const vNavigationDrawer = findVNavigationDrawer(wrapper);

    expect(vNavigationDrawer.props("absolute")).toBe(false);
    expect(vNavigationDrawer.props("order")).toBe(1);
  });

  it("should use the tertiary color", () => {
    expect(findVNavigationDrawer(wrapper).props("color")).toBe("tertiary");
  });

  it('should inherit "data-testid" attribute', () => {
    expect(wrapper.attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).toBeUndefined();
  });

  describe("props", () => {
    const firstItem: NavigationMenuItem = {
      description: "First item",
      route: "/first",
      icon: "home",
    };
    const secondItem: NavigationMenuItem = {
      description: "Second item",
      route: "https://google.com",
      icon: "flask",
    };
    const thirdItem = { description: "Third item", action: vi.fn(), icon: "cog" } as const;
    const items: Array<NavigationMenuItem> = [firstItem, secondItem, thirdItem];

    const parentItemFirstChild = { description: "First group first item", route: "/first-first" };
    const parentItemSecondChild = { description: "First group second item", action: vi.fn() };
    const parentItem: NavigationMenuParentItem = {
      description: "First group",
      icon: "folder",
      items: [parentItemFirstChild, parentItemSecondChild],
    };
    const parentItems: Array<NavigationMenuParentItem> = [parentItem];

    describe("items", () => {
      it("should not render any items when items prop is omitted", () => {
        const vListItems = findVListItems(wrapper);
        expect(vListItems).toHaveLength(0);
      });

      // Vuetify's `list` role only allows list items, but the items are links
      it("should present the items as a group", () => {
        expect(findVSkeletonLoader(wrapper).findComponent(VList).attributes("role")).toBe("group");
      });

      it("should align the items of a group with its title", () => {
        expect(findVSkeletonLoader(wrapper).findComponent(VList).props("indent")).toBe(48);
      });

      // Vuetify makes the list the only tab stop, which skipped every item after the first one
      it("should leave the list out of the tab order and make each item a tab stop", async () => {
        await wrapper.setProps({ items: [firstItem, parentItem, thirdItem] });

        expect(findVSkeletonLoader(wrapper).findComponent(VList).attributes("tabindex")).toBe("-1");
        const [plainLink, groupHeader, groupLink, groupAction, plainAction] =
          findVListItems(wrapper);
        for (const item of [plainLink, groupHeader, groupLink, groupAction, plainAction]) {
          expect(item.attributes("tabindex"), `${item.props("title")}`).toBe("0");
        }
        expect(groupHeader.props("title")).toBe(parentItem.description);
        expect(plainAction.props("title")).toBe(thirdItem.description);
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

      it("should present a group's header as a button that tells whether it's expanded", async () => {
        await wrapper.setProps({ items: parentItems });

        const header = findVListGroups(wrapper)[0].findComponent(VListItem);
        expect(header.element.tagName).toBe("BUTTON");
        expect(header.attributes("role")).toBeUndefined();
        expect(header.attributes("aria-selected")).toBeUndefined();
        expect(header.attributes("type")).toBe("button");
        expect(header.attributes("aria-expanded")).toBe("false");
        // A native button only takes its content's width and centers its text, unlike the other
        // items
        expect(header.classes()).toEqual(expect.arrayContaining(["w-100", "text-start"]));

        await header.trigger("click");
        expect(header.attributes("aria-expanded")).toBe("true");
      });

      it("should present items with a route as links and the others as buttons", async () => {
        await wrapper.setProps({ items });

        const roles = findVListItems(wrapper).map((vListItem) => vListItem.attributes("role"));
        expect(roles).toEqual(items.map(({ route }) => (route ? "link" : "button")));
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

      it("should highlight only the most specific item on the pages below its path", async () => {
        const router = createRouter({
          history: createMemoryHistory(),
          routes: [{ path: "/:path(.*)*", component: { render: () => null } }],
        });
        const reportsChild = { description: "Reports", route: "/first/reports" };
        const group: NavigationMenuParentItem = {
          description: "Group",
          icon: "folder",
          items: [reportsChild],
        };
        // A sibling route of the item's, which the router's links don't take as the item's page
        await router.push("/first/reports/new");
        const menu = mountNavigationMenu({ router });
        await menu.setProps({ items: [firstItem, group] });
        const [vListGroup] = findVListGroups(menu);
        await vListGroup.trigger("click");

        const [plainItem, , childItem] = findVListItems(menu);
        expect(childItem.props("active")).toBe(true);
        expect(childItem.attributes("aria-current")).toBe("page");
        expect(childItem.classes()).toContain("v-list-item--active");
        expect(plainItem.props("active")).toBe(false);
        expect(plainItem.attributes("aria-current")).toBeUndefined();

        // The router's link would highlight it, as its route's page
        await router.push("/first");
        expect(plainItem.props("active")).toBe(true);
        expect(plainItem.attributes("aria-current")).toBe("page");
        expect(childItem.props("active")).toBe(false);
        expect(childItem.attributes("aria-current")).toBeUndefined();
      });

      it("should not highlight a parent route's item on the page of a more specific item", async () => {
        const component = { render: () => null };
        const router = createRouter({
          history: createMemoryHistory(),
          routes: [{ path: "/people", component, children: [{ path: "reports", component }] }],
        });
        const reportsChild = { description: "Reports", route: "/people/reports" };
        const group: NavigationMenuParentItem = {
          description: "Group",
          icon: "folder",
          items: [reportsChild],
        };
        const peopleItem: NavigationMenuItem = {
          description: "People",
          icon: "home",
          route: "/people",
        };
        await router.push("/people/reports");
        const menu = mountNavigationMenu({ router });
        await menu.setProps({ items: [peopleItem, group] });
        await flushPromises();
        // The group of the active item opens on its own in the drawer
        expect(findVSkeletonLoader(menu).findComponent(VList).props("opened")).toEqual([
          group.description,
        ]);

        // The router's link takes the parent route's item as active, on its child's page
        const [plainItem, , childItem] = findVListItems(menu);
        expect(plainItem.props("active")).toBe(false);
        expect(plainItem.attributes("aria-current")).toBeUndefined();
        expect(plainItem.classes()).not.toContain("v-list-item--active");
        expect(childItem.props("active")).toBe(true);
        expect(childItem.attributes("aria-current")).toBe("page");
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
        const [plainItem] = findVListItems(wrapper);
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
        icon: "cogAlternative",
        items: [parentItemFirstChild],
      };

      it("should show the icon of a plain item before its description", async () => {
        await wrapper.setProps({ items: [homeItem, hospitalItem] });

        const [homeListItem, hospitalListItem] = findVListItems(wrapper);
        expect(homeListItem.props("prependIcon")).toBe(mdiHome);
        expect(hospitalListItem.props("prependIcon")).toBe(mdiHospitalBuilding);
      });

      it("should show the icon of a group before its description", async () => {
        await wrapper.setProps({ items: [iconParentItem] });

        const groupActivator = findVListGroups(wrapper)[0].findComponent(VListItem);
        expect(groupActivator.props("prependIcon")).toBe(mdiCogOutline);
      });

      it("should show no icon on an item inside a group, even when one is given", async () => {
        const parentItemWithIconChild: NavigationMenuParentItem = {
          ...iconParentItem,
          // @ts-expect-error: only the first level items and groups accept an icon
          items: [{ description: "Profile", icon: "accountAlternative" }],
        };
        await wrapper.setProps({ items: [parentItemWithIconChild] });

        const [vListGroup] = findVListGroups(wrapper);
        await vListGroup.trigger("click");

        const [, profileItem] = vListGroup.findAllComponents(VListItem);
        expect(profileItem.props("title")).toBe("Profile");
        expect(profileItem.props("prependIcon")).toBeUndefined();
        expect(profileItem.find(".v-list-item__prepend").exists()).toBeFalsy();
      });

      it("should require an icon on the first level items and groups", () => {
        // @ts-expect-error: the collapsed menu shows only the icons
        const item: NavigationMenuItem = { description: "Home", route: "/" };
        // @ts-expect-error: the collapsed menu shows only the icons
        const group: NavigationMenuParentItem = { description: "Group", items: [] };

        expect([item, group]).toHaveLength(2);
      });

      it("should keep the icon out of the item's accessible name", async () => {
        await wrapper.setProps({ items: [homeItem] });

        const [vListItem] = findVListItems(wrapper);
        expect(vListItem.find(".v-list-item__prepend .v-icon").attributes("aria-hidden")).toBe(
          "true",
        );
        expect(vListItem.text()).toBe(homeItem.description);
      });
    });

    describe("rail", () => {
      const groupItem: NavigationMenuParentItem = {
        description: "Units",
        icon: "hospital",
        items: [{ description: "Unit list", route: "/units" }],
      };

      afterEach(async () => {
        document.body.innerHTML = "";
        await resize(MOBILE_WIDTH);
      });

      async function mountDesktop(options: MountOptions = {}) {
        // Menus mounted by previous tests would answer the shortcut first
        owners.value = [];
        await resize(DESKTOP_WIDTH);
        const desktop = mountNavigationMenu(options);
        await flushPromises();
        return desktop;
      }

      function isSearchFieldShown(menu: ReturnType<typeof mountNavigationMenu>) {
        return findTextField(menu).element.parentElement!.style.display !== "none";
      }

      function isSearchItemShown(menu: ReturnType<typeof mountNavigationMenu>) {
        return findSearchItem(menu).element.parentElement!.style.display !== "none";
      }

      it("should be a temporary drawer below the mobile breakpoint", () => {
        const vNavigationDrawer = findVNavigationDrawer(wrapper);

        expect(vNavigationDrawer.props("mobile")).toBe(true);
        expect(vNavigationDrawer.props("permanent")).toBe(false);
        expect(vNavigationDrawer.props("rail")).toBe(false);
        expect(vNavigationDrawer.props("expandOnHover")).toBe(true);
        expect(isSearchFieldShown(wrapper)).toBe(true);
        expect(isSearchItemShown(wrapper)).toBe(false);
      });

      it("should be a permanent rail above the mobile breakpoint", async () => {
        const desktop = await mountDesktop();
        const vNavigationDrawer = findVNavigationDrawer(desktop);

        expect(vNavigationDrawer.props("mobile")).toBe(false);
        expect(vNavigationDrawer.props("permanent")).toBe(true);
        expect(vNavigationDrawer.props("rail")).toBe(true);
        expect(vNavigationDrawer.props("modelValue")).toBe(true);
      });

      it("should show a search item while collapsed and the search field while expanded", async () => {
        const desktop = await mountDesktop();
        expect(isSearchItemShown(desktop)).toBe(true);
        expect(isSearchFieldShown(desktop)).toBe(false);

        await desktop.trigger("mouseenter");

        expect(isSearchItemShown(desktop)).toBe(false);
        expect(isSearchFieldShown(desktop)).toBe(true);
      });

      it("should present the search item as a button named Buscar, with the shortcut", async () => {
        const searchItem = findSearchItem(await mountDesktop());

        expect(searchItem.element.tagName).toBe("BUTTON");
        expect(searchItem.attributes("type")).toBe("button");
        expect(searchItem.attributes("role")).toBeUndefined();
        expect(searchItem.attributes("aria-keyshortcuts")).toBe("Control+K");
        expect(searchItem.props("prependIcon")).toBe(mdiMagnify);
        expect(searchItem.text()).toBe("Buscar");
        // A native button only takes its content's width and centers its text, unlike the items
        expect(searchItem.classes()).toEqual(expect.arrayContaining(["w-100", "text-start"]));
      });

      // Vuetify's list is focusable and would pass the focus on to the item, which would then give it
      // back to the list instead of the page
      it("should leave the search item's list out of the tab order", async () => {
        const list = findSearchItem(await mountDesktop()).element.parentElement!;

        expect(list.getAttribute("tabindex")).toBe("-1");
        expect(list.getAttribute("role")).toBe("group");
      });

      it("should disable the search item, out of the tab order, only while loading", async () => {
        const desktop = await mountDesktop();
        expect(findSearchItem(desktop).props("disabled")).toBe(false);
        expect(findSearchItem(desktop).attributes("tabindex")).toBeUndefined();
        expect(findSearchItem(desktop).attributes("aria-disabled")).toBeUndefined();

        await desktop.setProps({ loading: true });

        expect(findSearchItem(desktop).props("disabled")).toBe(true);
        expect(findSearchItem(desktop).attributes("tabindex")).toBe("-1");
        expect(findSearchItem(desktop).attributes("aria-disabled")).toBe("true");
      });

      it("should expand and focus the search when the search item takes the focus", async () => {
        const desktop = await mountDesktop({ attachTo: document.body });
        const origin = appendButton();
        origin.focus();

        (findSearchItem(desktop).element as HTMLElement).focus();
        await flushPromises();

        expect(isSearchFieldShown(desktop)).toBe(true);
        expect(document.activeElement).toBe(findTextField(desktop).find("input").element);

        await findTextField(desktop).find("input").trigger("keydown", { key: "Escape" });

        expect(isSearchItemShown(desktop)).toBe(true);
        expect(document.activeElement).toBe(origin);
        desktop.unmount();
      });

      it("should move the focus to the search item, without searching, when Escape hides the search field", async () => {
        const desktop = await mountDesktop({ attachTo: document.body });
        await desktop.trigger("mouseenter");
        const input = findTextField(desktop).find("input");
        (input.element as HTMLElement).focus();

        await input.trigger("keydown", { key: "Escape" });
        await flushPromises();

        expect(document.activeElement).toBe(findSearchItem(desktop).element);
        expect(isSearchItemShown(desktop)).toBe(true);
        expect(isSearchFieldShown(desktop)).toBe(false);
        desktop.unmount();
      });

      it("should collapse with Escape", async () => {
        const desktop = await mountDesktop();
        await desktop.trigger("mouseenter");

        await desktop.trigger("keydown", { key: "Escape" });

        expect(isSearchItemShown(desktop)).toBe(true);
        expect(desktop.emitted("update:modelValue")).toBeUndefined();
      });

      it("should name each group by its description, to open it", async () => {
        const desktop = await mountDesktop();
        await desktop.setProps({ items: [groupItem] });

        expect(findVListGroups(desktop)[0].props("value")).toBe(groupItem.description);
        expect(findVSkeletonLoader(desktop).findComponent(VList).props("opened")).toEqual([]);
      });

      it("should highlight the group of the current page only while collapsed", async () => {
        const router = createRouter({
          history: createMemoryHistory(),
          routes: [{ path: "/:path(.*)*", component: { render: () => null } }],
        });
        await router.push("/units");
        const desktop = await mountDesktop({ router });
        await desktop.setProps({ items: [groupItem, parentItem] });
        const [unitsHeader, otherHeader] = findVListGroups(desktop).map((group) =>
          group.findComponent(VListItem),
        );

        expect(unitsHeader.props("active")).toBe(true);
        expect(otherHeader.props("active")).toBe(false);
        // Without it, Vuetify hides the highlight of an active group's header
        expect(unitsHeader.classes()).toContain("v-treeview-item--activatable-group-activator");

        await desktop.trigger("mouseenter");

        expect(unitsHeader.props("active")).toBe(false);
        expect(findVSkeletonLoader(desktop).findComponent(VList).props("opened")).toEqual([
          groupItem.description,
        ]);
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
        // Matches the menu's tertiary background, so the skeleton doesn't draw a light box over it
        expect(vSkeletonLoader.props("color")).toBe("tertiary");
        expect(vSkeletonLoader.findAll(".v-skeleton-loader__list-item")).toHaveLength(6);
        expect(findVListItems(wrapper)).toHaveLength(0);
      });

      it("should announce the loading with valid ARIA attributes when rendered on the server", async () => {
        const html = await renderNavigationMenu({ items, loading: true });
        expect(html).toContain('aria-label="Carregando..."');
        expect(html).toContain('aria-live="polite"');
        expect(html).not.toContain("arialabel");
        expect(html).not.toContain("arialive");
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

      it("should hide the empty messages area of the search field", () => {
        const defaultsProvider = wrapper.findComponent(VDefaultsProvider);
        expect(defaultsProvider.props("defaults")).toEqual({ VTextField: { hideDetails: "auto" } });
        expect(defaultsProvider.findComponent(TextField).exists()).toBe(true);
        expect(wrapper.findComponent(VTextField).find(".v-input__details").classes()).toContain(
          "v-input__details--hidden",
        );
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

      describe("groups", () => {
        const people = { description: "Pessoas", route: "/pessoas" };
        const humanResources: NavigationMenuParentItem = {
          description: "Recursos humanos",
          icon: "folder",
          items: [people, { description: "Cargos", route: "/cargos" }],
        };
        const finance: NavigationMenuParentItem = {
          description: "Financeiro",
          icon: "cog",
          items: [{ description: "Pagamentos", route: "/pagamentos" }],
        };

        beforeEach(async () => {
          await wrapper.setProps({ items: [humanResources, finance, firstItem] });
        });

        function openedGroups() {
          return findVSkeletonLoader(wrapper).findComponent(VList).props("opened");
        }

        async function toggleGroup(description: string) {
          const group = findVListGroups(wrapper).find(
            (vListGroup) => vListGroup.findComponent(VListItem).props("title") === description,
          )!;
          await group.find("button").trigger("click");
        }

        it("should open the groups with a match while searching, showing the matching items", async () => {
          await findTextField(wrapper).setValue("pess");

          expect(openedGroups()).toEqual([humanResources.description]);
          const [group] = findVListGroups(wrapper);
          expect(group.find("button").attributes("aria-expanded")).toBe("true");
          expect(group.findAllComponents(VListItem).map((item) => item.props("title"))).toEqual([
            humanResources.description,
            people.description,
          ]);
        });

        it("should open every group with a match, including one whose own description matches", async () => {
          // Also matches a plain item, which isn't a group to open
          await findTextField(wrapper).setValue("r");

          expect(openedGroups()).toEqual([humanResources.description, finance.description]);

          await findTextField(wrapper).setValue("financ");

          expect(openedGroups()).toEqual([finance.description]);
        });

        it("should let the user close a group while searching, until the text changes", async () => {
          await findTextField(wrapper).setValue("pess");
          await toggleGroup(humanResources.description);

          expect(openedGroups()).toEqual([]);

          await findTextField(wrapper).setValue("pesso");

          expect(openedGroups()).toEqual([humanResources.description]);
        });

        it("should open again the groups that were open before the search when it's cleared", async () => {
          await toggleGroup(finance.description);
          expect(openedGroups()).toEqual([finance.description]);

          await findTextField(wrapper).setValue("pess");
          await findTextField(wrapper).setValue("pesso");

          expect(openedGroups()).toEqual([humanResources.description]);

          await findTextField(wrapper).setValue("");

          expect(openedGroups()).toEqual([finance.description]);
        });

        it("should keep the groups closed without a search", () => {
          expect(openedGroups()).toEqual([]);
        });
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

type MountOptions = { attachTo?: HTMLElement; router?: Router };

function mountNavigationMenu(options: MountOptions = {}) {
  const { attachTo, router } = options;
  const global = getGlobalMountingOptions();
  if (router) global.plugins.push(router);

  return mount(NavigationMenu, {
    attachTo,
    attrs: {
      "data-testid": testId,
      style: styleValue,
      class: classValue,
    },
    global,
  });
}

function renderNavigationMenu(props: Record<string, unknown>) {
  return renderToString(NavigationMenu, {
    props,
    global: getGlobalMountingOptions(),
  });
}

function getGlobalMountingOptions() {
  return {
    stubs: {
      VNavigationDrawer: {
        props: {
          modelValue: Boolean,
          color: String,
          mobile: Boolean,
          permanent: Boolean,
          rail: Boolean,
          expandOnHover: Boolean,
          temporary: Boolean,
          absolute: Boolean,
          order: [Number, String],
        },
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
    plugins: [vueTestUtilsPluginUimed()] as Array<Plugin>,
  };
}

function findVNavigationDrawer(wrapper: ReturnType<typeof mountNavigationMenu>) {
  return wrapper.findComponent(VNavigationDrawer);
}

function findTextField(wrapper: ReturnType<typeof mountNavigationMenu>) {
  return wrapper.findComponent(TextField);
}

/** The menu's items and groups' headers, without the search item. */
function findVListItems(wrapper: ReturnType<typeof mountNavigationMenu>) {
  return findVSkeletonLoader(wrapper).findAllComponents(VListItem);
}

function findSearchItem(wrapper: ReturnType<typeof mountNavigationMenu>) {
  return wrapper.findAllComponents(VListItem).find((item) => item.props("title") === "Buscar")!;
}

function appendButton() {
  const button = document.createElement("button");
  document.body.append(button);
  return button;
}

async function resize(width: number) {
  window.innerWidth = width;
  window.dispatchEvent(new Event("resize"));
  await flushPromises();
}

function findVSkeletonLoader(wrapper: ReturnType<typeof mountNavigationMenu>) {
  return wrapper.findComponent(VSkeletonLoader);
}

function findVListGroups(wrapper: ReturnType<typeof mountNavigationMenu>) {
  return wrapper.findAllComponents(VListGroup);
}
