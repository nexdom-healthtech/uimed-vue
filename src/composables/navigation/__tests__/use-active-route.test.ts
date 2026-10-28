import { useActiveRoute, type ActiveRoute } from "@/composables/navigation/use-active-route.ts";
import type {
  NavigationMenuItem,
  NavigationMenuParentItem,
  NavigationMenuParentItemOrItem,
} from "@/components/navigation-menu/types.ts";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, type PropType } from "vue";
import { createMemoryHistory, createRouter, type RouteLocationRaw, type Router } from "vue-router";

const homeItem: NavigationMenuItem = { description: "Início", icon: "home", route: "/" };
const peopleItem: NavigationMenuItem = {
  description: "Pessoas",
  icon: "accountGroup",
  route: "/people",
};
const reportsItem = { description: "Relatórios", route: "/people/reports" };
const archiveItem = { description: "Arquivo", route: { path: "/people-archive" } };
const actionItem = { description: "Ações", action: () => {} };
const externalItem = { description: "Externo", route: "https://google.com" };
const reportsGroup: NavigationMenuParentItem = {
  description: "Relatórios",
  icon: "folder",
  items: [actionItem, externalItem, reportsItem, archiveItem],
};
const unitItem = { description: "Unidade 1", route: { name: "unit", params: { id: "1" } } };
const unitsGroup: NavigationMenuParentItem = {
  description: "Unidades",
  icon: "hospital",
  items: [unitItem],
};
const items: Array<NavigationMenuParentItemOrItem> = [
  homeItem,
  peopleItem,
  reportsGroup,
  unitsGroup,
];

const Harness = defineComponent({
  props: { items: { type: Array as PropType<Array<NavigationMenuParentItemOrItem>> } },
  setup(props) {
    return { active: useActiveRoute(() => props.items) };
  },
  template: `<div />`,
});

type ActiveRouteWrapper = VueWrapper & { vm: { active: ActiveRoute } };

function createTestRouter() {
  const component = { render: () => null };
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component },
      { path: "/units/:id", name: "unit", component, children: [{ path: "edit", component }] },
      { path: "/:path(.*)*", component },
    ],
  });
}

describe("useActiveRoute", () => {
  let router: Router;

  beforeEach(() => {
    router = createTestRouter();
  });

  async function mountActiveRoute(path: string, menuItems: typeof items | undefined) {
    await router.push(path);
    const wrapper = mount(Harness, {
      props: { items: menuItems },
      global: { plugins: [router] },
    });
    await flushPromises();
    return wrapper as unknown as ActiveRouteWrapper;
  }

  function isActive(wrapper: ActiveRouteWrapper, route: RouteLocationRaw | undefined) {
    return wrapper.vm.active.listItemProps(route).active;
  }

  /** Routes of the menu's items that are active. */
  function activeRoutes(wrapper: ActiveRouteWrapper) {
    return [homeItem, peopleItem, ...reportsGroup.items, unitItem]
      .map(({ route }) => route)
      .filter((route) => isActive(wrapper, route));
  }

  it("should make the item of the current page active", async () => {
    const wrapper = await mountActiveRoute("/people", items);

    expect(activeRoutes(wrapper)).toEqual([peopleItem.route]);
    expect(wrapper.vm.active.listItemProps(peopleItem.route)).toEqual({
      to: peopleItem.route,
      active: true,
      "aria-current": "page",
    });
    expect(wrapper.vm.active.listItemProps(homeItem.route)).toEqual({
      to: homeItem.route,
      active: false,
      "aria-current": undefined,
    });
  });

  it("should make the item active on the pages below its path", async () => {
    const wrapper = await mountActiveRoute("/people/new", items);

    expect(activeRoutes(wrapper)).toEqual([peopleItem.route]);
  });

  it("should ignore a trailing slash in the item's route", async () => {
    const wrapper = await mountActiveRoute("/people/new", [{ ...peopleItem, route: "/people/" }]);

    expect(isActive(wrapper, "/people/")).toBe(true);
    expect(isActive(wrapper, "/people")).toBe(true);

    await router.push("/peopl");
    expect(isActive(wrapper, "/people/")).toBe(false);
  });

  it("should ignore the query and hash of the current page", async () => {
    const wrapper = await mountActiveRoute("/people/new?tab=documents#address", items);

    expect(activeRoutes(wrapper)).toEqual([peopleItem.route]);
  });

  it("should not make the item active on pages whose path only starts with its own", async () => {
    const wrapper = await mountActiveRoute("/people-archive", items);

    expect(activeRoutes(wrapper)).toEqual([archiveItem.route]);
  });

  it("should make only the item with the most specific path active", async () => {
    const wrapper = await mountActiveRoute("/people/reports/2026", items);

    expect(activeRoutes(wrapper)).toEqual([reportsItem.route]);
    expect(wrapper.vm.active.hasActiveRoute(reportsGroup)).toBe(true);
  });

  it("should compare the most specific path among the groups' items too", async () => {
    const wrapper = await mountActiveRoute("/people/reports", [peopleItem, reportsGroup]);

    expect(isActive(wrapper, peopleItem.route)).toBe(false);
    expect(isActive(wrapper, reportsItem.route)).toBe(true);
  });

  it("should compare the most specific path among the plain items too", async () => {
    const peopleGroup: NavigationMenuParentItem = {
      description: "Cadastros",
      icon: "folder",
      items: [{ description: "Pessoas", route: "/people" }],
    };
    const reportsPlainItem: NavigationMenuItem = { ...reportsItem, icon: "folder" };
    const wrapper = await mountActiveRoute("/people/reports", [peopleGroup, reportsPlainItem]);

    expect(wrapper.vm.active.hasActiveRoute(peopleGroup)).toBe(false);
    expect(isActive(wrapper, reportsPlainItem.route)).toBe(true);
  });

  it("should make the root's item active only on the root's page", async () => {
    const wrapper = await mountActiveRoute("/", items);
    expect(activeRoutes(wrapper)).toEqual([homeItem.route]);

    await router.push("/components");
    expect(activeRoutes(wrapper)).toEqual([]);
  });

  it("should compare the path the route's params set", async () => {
    const wrapper = await mountActiveRoute("/units/2", items);
    expect(wrapper.vm.active.hasActiveRoute(unitsGroup)).toBe(false);

    await router.push("/units/1/edit");
    expect(wrapper.vm.active.hasActiveRoute(unitsGroup)).toBe(true);
    expect(activeRoutes(wrapper)).toEqual([unitItem.route]);
  });

  it("should update when the items change", async () => {
    const wrapper = await mountActiveRoute("/people/reports", [peopleItem]);
    expect(isActive(wrapper, peopleItem.route)).toBe(true);

    await wrapper.setProps({ items: [peopleItem, reportsGroup] });

    expect(isActive(wrapper, peopleItem.route)).toBe(false);
  });

  it("should compare a route only with the current page without items", async () => {
    const wrapper = await mountActiveRoute("/people/reports", undefined);

    expect(activeRoutes(wrapper)).toEqual([peopleItem.route, reportsItem.route]);
  });

  it("should never make an item without a route active", async () => {
    const wrapper = await mountActiveRoute("/people/reports", items);

    expect(wrapper.vm.active.listItemProps(undefined)).toEqual({
      role: "button",
      active: false,
      "aria-current": undefined,
    });
  });

  it("should never make an external route active, even on a page with its path", async () => {
    // The path the router takes the external URL for, as a path relative to the current page
    const path = router.resolve(externalItem.route).path;
    const wrapper = await mountActiveRoute(path, [reportsGroup]);

    expect(wrapper.vm.active.listItemProps(externalItem.route)).toEqual({
      href: externalItem.route,
      active: false,
      "aria-current": undefined,
    });
  });

  it("should not make any item active in apps without a router", () => {
    const wrapper = mount(Harness, { props: { items } }) as unknown as ActiveRouteWrapper;

    expect(wrapper.vm.active.listItemProps(peopleItem.route)).toEqual({
      to: peopleItem.route,
      active: false,
      "aria-current": undefined,
    });
    expect(wrapper.vm.active.hasActiveRoute(reportsGroup)).toBe(false);
  });
});
