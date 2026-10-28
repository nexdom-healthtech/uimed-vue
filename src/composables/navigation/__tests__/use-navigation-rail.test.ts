import {
  isParentItem,
  useMobileNavigation,
  useNavigationRail,
  type NavigationRail,
} from "@/composables/navigation/use-navigation-rail.ts";
import { useActiveRoute } from "@/composables/navigation/use-active-route.ts";
import type {
  NavigationMenuItem,
  NavigationMenuParentItem,
  NavigationMenuParentItemOrItem,
} from "@/components/navigation-menu/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import { flushPromises, mount, renderToString, type VueWrapper } from "@vue/test-utils";
import { defineComponent, nextTick, ref, useTemplateRef, type PropType } from "vue";
import { createMemoryHistory, createRouter, type Router } from "vue-router";

const Field = defineComponent({ template: `<div><input /></div>` });
const SearchItem = defineComponent({ template: `<button class="search-item">Buscar</button>` });

const usersGroup: NavigationMenuParentItem = {
  description: "Usuários",
  icon: "accountGroup",
  items: [
    { description: "Ações", action: () => {} },
    { description: "Externo", route: "https://google.com" },
    { description: "Lista", route: "/users" },
  ],
};
const unitsGroup: NavigationMenuParentItem = {
  description: "Unidades",
  icon: "hospital",
  items: [{ description: "Unidade 1", route: { name: "unit", params: { id: "1" } } }],
};
const homeItem: NavigationMenuItem = { description: "Início", icon: "home", route: "/" };
const items: Array<NavigationMenuParentItemOrItem> = [homeItem, usersGroup, unitsGroup];

type Rail = VueWrapper & {
  vm: { open: boolean; search: string; rail: NavigationRail };
};

const DESKTOP_WIDTH = 1280;
const MOBILE_WIDTH = 1024;

async function resize(width: number) {
  window.innerWidth = width;
  window.dispatchEvent(new Event("resize"));
  await flushPromises();
}

function createTestRouter() {
  const component = { render: () => null };
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", name: "home", component },
      { path: "/users", component, children: [{ path: ":id", name: "user", component }] },
      { path: "/units/:id", name: "unit", component },
    ],
  });
}

const Harness = defineComponent({
  components: { Field, SearchItem },
  props: { items: { type: Array as PropType<Array<NavigationMenuParentItemOrItem>> } },
  setup(props) {
    const open = ref(false);
    const search = ref("");
    const rail = useNavigationRail({
      open,
      field: useTemplateRef("field"),
      searchItem: useTemplateRef("searchItem"),
      items: () => props.items,
      hasActiveRoute: useActiveRoute(() => props.items).hasActiveRoute,
      search,
    });
    return { open, search, rail, ...rail };
  },
  template: `
    <v-layout>
      <v-navigation-drawer
        v-model="drawerOpen"
        :mobile="mobile"
        :permanent="!mobile"
        :rail="!mobile"
        expand-on-hover
        temporary
        @focusin="onFocusin"
        @focusout="onFocusout"
        @mouseenter="onMouseenter"
        @mouseleave="onMouseleave"
      >
        <field ref="field" />
        <search-item ref="searchItem" />
        <button class="first">First</button>
        <button class="second">Second</button>
        <div class="v-list-group__items"><a href="#" class="child">Child</a></div>
        <div class="v-list-group__items"><a href="#" class="other-child">Other child</a></div>
      </v-navigation-drawer>
    </v-layout>
  `,
});

describe("useNavigationRail", () => {
  const wrappers: VueWrapper[] = [];
  /** Whether the focus is visible, as after the keyboard: jsdom doesn't tell it reliably. */
  let focusVisible = true;

  beforeEach(() => {
    focusVisible = true;
    vi.spyOn(HTMLElement.prototype, "matches").mockImplementation(function (
      this: Element,
      selectors: string,
    ) {
      return selectors === ":focus-visible"
        ? focusVisible
        : Element.prototype.matches.call(this, selectors);
    });
  });

  afterEach(async () => {
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
    document.body.innerHTML = "";
    vi.restoreAllMocks();
    await resize(MOBILE_WIDTH);
  });

  async function mountRail(options: { router?: Router; railItems?: typeof items } = {}) {
    const { router, railItems = items } = options;
    const plugins: Array<ReturnType<typeof vueTestUtilsPluginUimed> | Router> = [
      vueTestUtilsPluginUimed(),
    ];
    if (router) plugins.push(router);

    const wrapper = mount(Harness, {
      props: { items: railItems },
      attachTo: document.body,
      global: { plugins },
    });
    wrappers.push(wrapper);
    await flushPromises();
    return wrapper as unknown as Rail;
  }

  async function mountDesktopRail(options?: Parameters<typeof mountRail>[0]) {
    await resize(DESKTOP_WIDTH);
    return mountRail(options);
  }

  function findDrawer(wrapper: Rail) {
    return wrapper.find(".v-navigation-drawer");
  }

  function isHovering(wrapper: Rail) {
    return findDrawer(wrapper).classes("v-navigation-drawer--is-hovering");
  }

  function collapsed(wrapper: Rail) {
    return wrapper.vm.rail.collapsed.value;
  }

  /** Moves the focus, so the focus events tell where it comes from (none for `null`). */
  async function moveFocus(target: Element | null) {
    if (target) (target as HTMLElement).focus();
    else (document.activeElement as HTMLElement).blur();
    await nextTick();
  }

  async function focusFrom(wrapper: Rail, selector: string, origin: Element | null) {
    await moveFocus(origin);
    await moveFocus(wrapper.find(selector).element);
  }

  function appendOutside() {
    const button = document.createElement("button");
    document.body.append(button);
    return button;
  }

  describe("mobile", () => {
    it("should be a drawer below the mobile breakpoint", async () => {
      const wrapper = await mountRail();

      expect(wrapper.vm.rail.mobile.value).toBe(true);
      expect(collapsed(wrapper)).toBe(false);
      expect(findDrawer(wrapper).classes()).toContain("v-navigation-drawer--temporary");
    });

    it("should be a rail above the mobile breakpoint, collapsed at first", async () => {
      const wrapper = await mountDesktopRail();

      expect(wrapper.vm.rail.mobile.value).toBe(false);
      expect(collapsed(wrapper)).toBe(true);
      expect(findDrawer(wrapper).classes()).toEqual(
        expect.arrayContaining(["v-navigation-drawer--rail", "v-navigation-drawer--active"]),
      );
      expect(isHovering(wrapper)).toBe(false);
    });

    it("should follow the window's width", async () => {
      const wrapper = await mountRail();

      await resize(DESKTOP_WIDTH);
      expect(collapsed(wrapper)).toBe(true);

      await resize(MOBILE_WIDTH);
      expect(collapsed(wrapper)).toBe(false);
    });
  });

  describe("drawerOpen", () => {
    it("should follow the menu's model below the mobile breakpoint", async () => {
      const wrapper = await mountRail();
      expect(wrapper.vm.rail.drawerOpen.value).toBe(false);

      wrapper.vm.rail.drawerOpen.value = true;
      expect(wrapper.vm.open).toBe(true);
      expect(wrapper.vm.rail.drawerOpen.value).toBe(true);

      wrapper.vm.rail.drawerOpen.value = false;
      expect(wrapper.vm.open).toBe(false);
    });

    it("should keep the rail open above the mobile breakpoint, without changing the model", async () => {
      const wrapper = await mountDesktopRail();
      expect(wrapper.vm.rail.drawerOpen.value).toBe(true);

      wrapper.vm.rail.drawerOpen.value = true;
      expect(wrapper.vm.open).toBe(false);
      expect(wrapper.vm.rail.drawerOpen.value).toBe(true);
    });
  });

  describe("menuOpen", () => {
    it("should follow the menu's model below the mobile breakpoint", async () => {
      const wrapper = await mountRail();

      wrapper.vm.rail.menuOpen.value = true;
      expect(wrapper.vm.open).toBe(true);
      expect(wrapper.vm.rail.menuOpen.value).toBe(true);
      expect(collapsed(wrapper)).toBe(false);

      wrapper.vm.rail.menuOpen.value = false;
      expect(wrapper.vm.open).toBe(false);
      expect(wrapper.vm.rail.menuOpen.value).toBe(false);
    });

    it("should expand the rail to search above the mobile breakpoint", async () => {
      const wrapper = await mountDesktopRail();

      wrapper.vm.rail.menuOpen.value = true;
      await nextTick();

      expect(wrapper.vm.rail.menuOpen.value).toBe(true);
      expect(wrapper.vm.open).toBe(false);
      expect(collapsed(wrapper)).toBe(false);
      expect(isHovering(wrapper)).toBe(true);

      wrapper.vm.rail.menuOpen.value = false;
      await nextTick();

      expect(wrapper.vm.rail.menuOpen.value).toBe(false);
      expect(collapsed(wrapper)).toBe(true);
      expect(isHovering(wrapper)).toBe(false);
    });
  });

  describe("mouse", () => {
    it("should expand while the mouse is over the rail", async () => {
      const wrapper = await mountDesktopRail();

      await findDrawer(wrapper).trigger("mouseenter");
      expect(collapsed(wrapper)).toBe(false);
      expect(isHovering(wrapper)).toBe(true);

      await findDrawer(wrapper).trigger("mouseleave");
      expect(collapsed(wrapper)).toBe(true);
      expect(isHovering(wrapper)).toBe(false);
    });

    it("should stay expanded when the mouse leaves with the keyboard focus inside", async () => {
      const wrapper = await mountDesktopRail();
      await findDrawer(wrapper).trigger("mouseenter");
      await focusFrom(wrapper, ".first", null);

      await findDrawer(wrapper).trigger("mouseleave");

      expect(collapsed(wrapper)).toBe(false);
      expect(isHovering(wrapper)).toBe(true);
    });

    it("should stay expanded when the focus leaves with the mouse over it", async () => {
      const wrapper = await mountDesktopRail();
      await findDrawer(wrapper).trigger("mouseenter");
      await focusFrom(wrapper, ".first", null);

      await moveFocus(appendOutside());

      expect(collapsed(wrapper)).toBe(false);
      expect(isHovering(wrapper)).toBe(true);
    });
  });

  describe("focus", () => {
    it("should expand while the keyboard focus is inside the rail", async () => {
      const wrapper = await mountDesktopRail();

      await focusFrom(wrapper, ".first", appendOutside());
      expect(collapsed(wrapper)).toBe(false);
      expect(isHovering(wrapper)).toBe(true);

      await moveFocus(appendOutside());
      expect(collapsed(wrapper)).toBe(true);
      expect(isHovering(wrapper)).toBe(false);
    });

    it("should stay expanded while the focus moves inside the rail", async () => {
      const wrapper = await mountDesktopRail();
      await focusFrom(wrapper, ".first", null);

      await moveFocus(wrapper.find(".second").element);
      await focusFrom(wrapper, ".second", wrapper.find(".first").element);

      expect(collapsed(wrapper)).toBe(false);
    });

    it("should not expand when an item takes the focus from a click", async () => {
      const wrapper = await mountDesktopRail();
      focusVisible = false;

      await focusFrom(wrapper, ".first", null);

      expect(collapsed(wrapper)).toBe(true);
    });

    it("should stop expanding when the focus inside the rail stops being visible", async () => {
      const wrapper = await mountDesktopRail();
      await focusFrom(wrapper, ".first", null);
      focusVisible = false;

      await focusFrom(wrapper, ".second", wrapper.find(".first").element);

      expect(collapsed(wrapper)).toBe(true);
    });

    it("should stop searching when the focus leaves the rail", async () => {
      const wrapper = await mountDesktopRail();
      wrapper.vm.rail.menuOpen.value = true;
      await focusFrom(wrapper, ".first", null);

      await moveFocus(null);

      expect(wrapper.vm.rail.menuOpen.value).toBe(false);
      expect(collapsed(wrapper)).toBe(true);
    });

    it("should keep searching while the focus moves inside the rail", async () => {
      const wrapper = await mountDesktopRail();
      wrapper.vm.rail.menuOpen.value = true;
      await focusFrom(wrapper, ".first", null);

      await moveFocus(wrapper.find(".second").element);

      expect(wrapper.vm.rail.menuOpen.value).toBe(true);
    });
  });

  describe("dismiss", () => {
    it.each([
      ["the search field", "input"],
      ["an item of a group", ".child"],
    ])("should move the focus to the search item when the rail hides %s", async (_, selector) => {
      const wrapper = await mountDesktopRail();
      await focusFrom(wrapper, selector, null);
      let restoring: boolean | undefined;
      wrapper
        .find(".search-item")
        .element.addEventListener("focus", () => (restoring = wrapper.vm.rail.isRestoringFocus()));

      await wrapper.vm.rail.dismiss();

      expect(document.activeElement).toBe(wrapper.find(".search-item").element);
      expect(restoring).toBe(true);
      expect(wrapper.vm.rail.isRestoringFocus()).toBe(false);
      expect(collapsed(wrapper)).toBe(true);
    });

    it("should leave the focus on an item the collapsed rail still shows", async () => {
      const wrapper = await mountDesktopRail();
      await focusFrom(wrapper, ".first", null);

      await wrapper.vm.rail.dismiss();

      expect(document.activeElement).toBe(wrapper.find(".first").element);
    });

    it("should leave the focus outside the rail where it is", async () => {
      const wrapper = await mountDesktopRail();
      const outside = appendOutside();
      outside.focus();

      await wrapper.vm.rail.dismiss();

      expect(document.activeElement).toBe(outside);
    });

    it("should leave the focus on the search field of the drawer below the mobile breakpoint", async () => {
      const wrapper = await mountRail();
      await focusFrom(wrapper, "input", null);

      await wrapper.vm.rail.dismiss();

      expect(document.activeElement).toBe(wrapper.find("input").element);
    });

    it("should not tell the focus is being restored otherwise", async () => {
      const wrapper = await mountDesktopRail();

      expect(wrapper.vm.rail.isRestoringFocus()).toBe(false);
    });

    it("should collapse the rail, even with the mouse and the focus inside", async () => {
      const wrapper = await mountDesktopRail();
      await findDrawer(wrapper).trigger("mouseenter");
      await focusFrom(wrapper, ".first", null);
      wrapper.vm.rail.menuOpen.value = true;

      await wrapper.vm.rail.dismiss();
      await nextTick();

      expect(collapsed(wrapper)).toBe(true);
      expect(wrapper.vm.rail.menuOpen.value).toBe(false);
      expect(isHovering(wrapper)).toBe(false);
    });

    it("should keep the rail collapsed while the focus moves inside it", async () => {
      const wrapper = await mountDesktopRail();
      await focusFrom(wrapper, ".first", null);
      await wrapper.vm.rail.dismiss();

      await focusFrom(wrapper, ".second", wrapper.find(".first").element);

      expect(collapsed(wrapper)).toBe(true);
    });

    it.each([
      ["the mouse enters it", (wrapper: Rail) => findDrawer(wrapper).trigger("mouseenter")],
      ["the focus enters it again", (wrapper: Rail) => focusFrom(wrapper, ".second", null)],
      [
        "the search opens",
        async (wrapper: Rail) => {
          wrapper.vm.rail.menuOpen.value = true;
          await nextTick();
        },
      ],
    ])("should expand the rail again when %s", async (_, expand) => {
      const wrapper = await mountDesktopRail();
      await focusFrom(wrapper, ".first", null);
      await wrapper.vm.rail.dismiss();
      await nextTick();

      await expand(wrapper);

      expect(collapsed(wrapper)).toBe(false);
    });

    it("should close the drawer below the mobile breakpoint", async () => {
      const wrapper = await mountRail();
      wrapper.vm.open = true;

      await wrapper.vm.rail.dismiss();

      expect(wrapper.vm.open).toBe(false);
    });

    it("should let the focus expand the rail again once the mouse enters it", async () => {
      const wrapper = await mountDesktopRail();
      await focusFrom(wrapper, ".first", null);
      await wrapper.vm.rail.dismiss();
      await findDrawer(wrapper).trigger("mouseenter");

      await focusFrom(wrapper, ".second", wrapper.find(".first").element);
      await findDrawer(wrapper).trigger("mouseleave");

      expect(collapsed(wrapper)).toBe(false);
    });

    it("should let the focus expand the rail again once the search opens", async () => {
      const wrapper = await mountDesktopRail();
      await focusFrom(wrapper, ".first", null);
      await wrapper.vm.rail.dismiss();
      wrapper.vm.rail.menuOpen.value = true;

      await focusFrom(wrapper, ".second", wrapper.find(".first").element);
      wrapper.vm.rail.menuOpen.value = false;
      await nextTick();

      expect(collapsed(wrapper)).toBe(false);
    });
  });

  describe("search", () => {
    it("should clear the search when the rail collapses", async () => {
      const wrapper = await mountDesktopRail();
      await findDrawer(wrapper).trigger("mouseenter");
      wrapper.vm.search = "Lista";

      await findDrawer(wrapper).trigger("mouseleave");

      expect(wrapper.vm.search).toBe("");
    });

    it("should keep the search while the drawer opens and closes", async () => {
      const wrapper = await mountRail();
      wrapper.vm.search = "Lista";

      wrapper.vm.rail.drawerOpen.value = true;
      await nextTick();
      wrapper.vm.rail.drawerOpen.value = false;
      await nextTick();

      expect(wrapper.vm.search).toBe("Lista");
    });
  });

  describe("groups", () => {
    let router: Router;

    beforeEach(async () => {
      router = createTestRouter();
      await router.push("/users");
    });

    async function expand(wrapper: Rail) {
      await findDrawer(wrapper).trigger("mouseenter");
    }

    async function collapse(wrapper: Rail) {
      await findDrawer(wrapper).trigger("mouseleave");
    }

    it("should open the group with the current page when the rail expands", async () => {
      const wrapper = await mountDesktopRail({ router });
      expect(wrapper.vm.rail.opened.value).toEqual([]);

      await expand(wrapper);

      expect(wrapper.vm.rail.opened.value).toEqual([usersGroup.description]);
    });

    it("should close every group while the rail is collapsed", async () => {
      const wrapper = await mountDesktopRail({ router });
      await expand(wrapper);
      wrapper.vm.rail.opened.value = [usersGroup.description, unitsGroup.description];
      expect(wrapper.vm.rail.opened.value).toEqual([
        usersGroup.description,
        unitsGroup.description,
      ]);

      await collapse(wrapper);
      expect(wrapper.vm.rail.opened.value).toEqual([]);

      // Groups opened while collapsed (e.g. by Vuetify when a link becomes active) stay closed
      wrapper.vm.rail.opened.value = [unitsGroup.description];
      expect(wrapper.vm.rail.opened.value).toEqual([]);

      await expand(wrapper);
      expect(wrapper.vm.rail.opened.value).toEqual([usersGroup.description]);
    });

    it("should keep the groups the user opens in the drawer", async () => {
      const wrapper = await mountRail({ router });
      expect(wrapper.vm.rail.opened.value).toEqual([]);

      wrapper.vm.rail.opened.value = [unitsGroup.description];

      expect(wrapper.vm.rail.opened.value).toEqual([unitsGroup.description]);
    });

    it("should open no group when the current page isn't in any", async () => {
      await router.push("/");
      const wrapper = await mountDesktopRail({ router });

      await expand(wrapper);

      expect(wrapper.vm.rail.opened.value).toEqual([]);
    });

    it("should open no group without items", async () => {
      const wrapper = await mountDesktopRail({ router, railItems: undefined });
      await wrapper.setProps({ items: undefined });

      await expand(wrapper);

      expect(wrapper.vm.rail.opened.value).toEqual([]);
    });

    it("should highlight the group with the current page only while collapsed", async () => {
      const wrapper = await mountDesktopRail({ router });
      const { isActiveGroup } = wrapper.vm.rail;

      expect(isActiveGroup(usersGroup)).toBe(true);
      expect(isActiveGroup(unitsGroup)).toBe(false);

      await expand(wrapper);
      expect(isActiveGroup(usersGroup)).toBe(false);
    });

    it("should not highlight groups in apps without a router", async () => {
      const wrapper = await mountDesktopRail();

      expect(wrapper.vm.rail.isActiveGroup(usersGroup)).toBe(false);
    });

    it("should stop searching when the page changes", async () => {
      const wrapper = await mountDesktopRail({ router });
      wrapper.vm.rail.menuOpen.value = true;
      await nextTick();

      await router.push("/");
      await flushPromises();

      expect(wrapper.vm.rail.menuOpen.value).toBe(false);
      expect(collapsed(wrapper)).toBe(true);
    });
  });

  describe("server rendering", () => {
    it("should render the drawer, as below the mobile breakpoint, until mounted", async () => {
      await resize(DESKTOP_WIDTH);

      const html = await renderToString(Harness, {
        props: { items },
        global: { plugins: [vueTestUtilsPluginUimed()] },
      });

      expect(html).toContain("v-navigation-drawer--temporary");
      expect(html).not.toContain("v-navigation-drawer--rail");
    });
  });
});

describe("useMobileNavigation", () => {
  afterEach(() => resize(MOBILE_WIDTH));

  function mountMobile() {
    let beforeMount: boolean | undefined;
    let mobile: ReturnType<typeof useMobileNavigation> | undefined;
    const wrapper = mount(
      defineComponent({
        setup() {
          mobile = useMobileNavigation();
          beforeMount = mobile.value;
          return {};
        },
        template: `<div />`,
      }),
      { global: { plugins: [vueTestUtilsPluginUimed()] } },
    );
    wrapper.unmount();
    return { beforeMount: beforeMount!, mobile: mobile! };
  }

  it("should start as mobile and switch on mount above the mobile breakpoint", async () => {
    await resize(DESKTOP_WIDTH);

    const { beforeMount, mobile } = mountMobile();

    expect(beforeMount).toBe(true);
    expect(mobile.value).toBe(false);
  });

  it("should stay mobile below the mobile breakpoint", () => {
    const { beforeMount, mobile } = mountMobile();

    expect(beforeMount).toBe(true);
    expect(mobile.value).toBe(true);
  });
});

describe("isParentItem", () => {
  it("should tell groups from items", () => {
    expect(isParentItem(usersGroup)).toBe(true);
    expect(isParentItem(homeItem)).toBe(false);
  });
});
