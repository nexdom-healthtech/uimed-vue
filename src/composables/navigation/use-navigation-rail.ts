import { isDeepEqual } from "@nexdom/shared/utils";
import {
  computed,
  inject,
  nextTick,
  onMounted,
  ref,
  toValue,
  watch,
  type ComponentPublicInstance,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
  type WritableComputedRef,
} from "vue";
import { routerKey, type RouteLocationRaw } from "vue-router";
import { useDisplay } from "vuetify";
import type {
  NavigationMenuParentItem,
  NavigationMenuParentItemOrItem,
} from "@/components/navigation-menu/types.ts";
import { isExternalRoute } from "@/composables/navigation/use-route-props.ts";

/**
 * Mouse events the rail dispatches on the drawer to expand or collapse it, which its own listeners
 * ignore.
 */
const syntheticEvents = new WeakSet<Event>();

export interface UseNavigationRailOptions {
  /** Open state of the drawer below the mobile breakpoint (the navigation menu's `v-model`). */
  open: Ref<boolean>;
  /** Search field, used to find the drawer it's in. */
  field: MaybeRefOrGetter<ComponentPublicInstance | null>;
  /**
   * "Buscar" item of the collapsed rail, which takes the focus when `Esc` hides the focused
   * element.
   */
  searchItem: MaybeRefOrGetter<ComponentPublicInstance | null>;
  /** Items of the menu, whose group with the current page opens when the rail expands. */
  items: MaybeRefOrGetter<Array<NavigationMenuParentItemOrItem> | undefined>;
  /** Search text, cleared when the rail collapses, so a filter never hides its icons. */
  search: Ref<string>;
}

export interface NavigationRail {
  /** Whether the menu is a temporary drawer (below the mobile breakpoint) instead of a rail. */
  mobile: ComputedRef<boolean>;
  /** Whether the rail shows only the icons. Always `false` below the mobile breakpoint. */
  collapsed: ComputedRef<boolean>;
  /** Model of the drawer: always open as a rail, and the menu's `v-model` as a drawer. */
  drawerOpen: WritableComputedRef<boolean>;
  /**
   * Open state for the search shortcut: the drawer's below the mobile breakpoint, and whether the
   * rail was expanded to search (by the shortcut or the "Buscar" item) above it.
   */
  menuOpen: WritableComputedRef<boolean>;
  /** Open groups (by description): none while collapsed. */
  opened: WritableComputedRef<unknown[]>;
  /** Whether the group is highlighted: only while collapsed, when it has the current page. */
  isActiveGroup: (item: NavigationMenuParentItem) => boolean;
  /** Collapses the rail (`Esc`), or closes the drawer below the mobile breakpoint. */
  dismiss: () => Promise<void>;
  /** Whether the rail itself is moving the focus to the "Buscar" item, which then won't search. */
  isRestoringFocus: () => boolean;
  onFocusin: (event: FocusEvent) => void;
  onFocusout: (event: FocusEvent) => void;
  onMouseenter: (event: MouseEvent) => void;
  onMouseleave: (event: MouseEvent) => void;
}

/**
 * Whether the navigation menu is a temporary drawer, opened by the app bar's button, instead of a
 * rail. Starts as the drawer and switches on mount, so server-rendered pages (the docs), rendered
 * without a window width, hydrate without mismatches.
 */
export function useMobileNavigation(): ComputedRef<boolean> {
  const { mobile } = useDisplay();
  const mounted = ref(false);

  onMounted(() => (mounted.value = true));

  return computed(() => !mounted.value || mobile.value);
}

/**
 * State of the navigation menu as a rail, above the mobile breakpoint: collapsed to its icons, and
 * expanded over the page while the mouse is over it, the keyboard focus is in it or the user is
 * searching. `Esc` collapses it until the mouse enters it, the focus leaves and enters it again
 * or the user searches.
 *
 * The drawer only expands its rail on its own mouse events, so the rail dispatches them itself to
 * expand on focus, and to stay expanded when the mouse leaves with the focus inside.
 */
export function useNavigationRail(options: UseNavigationRailOptions): NavigationRail {
  const { open, field, searchItem, items, search } = options;
  const mobile = useMobileNavigation();
  const router = inject(routerKey, null);

  const pointerInside = ref(false);
  const focusInside = ref(false);
  const searching = ref(false);
  /** Collapsed by `Esc`: the focus doesn't expand it again until it leaves the rail. */
  const dismissed = ref(false);
  let restoringFocus = false;
  const expandedGroups = ref<unknown[]>([]);

  const collapsed = computed(
    () => !mobile.value && !(pointerInside.value || focusInside.value || searching.value),
  );

  const drawerOpen = computed({
    get: () => !mobile.value || open.value,
    set: (value) => {
      if (mobile.value) open.value = value;
    },
  });

  /** The drawer's model below the mobile breakpoint, and the rail's search state above it. */
  const menuState = computed(() => (mobile.value ? open : searching));
  const menuOpen = computed({
    get: () => menuState.value.value,
    set: (value) => {
      menuState.value.value = value;
      // Searching expands the rail again after `Esc` (and `dismiss` sets it back right after)
      dismissed.value = false;
    },
  });

  const opened = computed({
    get: () => (collapsed.value ? [] : expandedGroups.value),
    set: (value) => (expandedGroups.value = value),
  });

  watch(collapsed, (isCollapsed) => {
    // Also dispatched when the mouse entering the rail expands it, where the drawer already handled
    // the real event: the redundant event leaves it expanded
    syncHover();
    if (isCollapsed) search.value = "";
    else expandedGroups.value = currentGroups();
  });

  // Navigating from the rail expanded to search collapses it, as it closes the drawer. It's
  // intentionally on any route change, including programmatic ones (e.g. a redirect after a form is
  // saved): the search is over once the page changes
  watch(
    () => router?.currentRoute.value,
    () => (searching.value = false),
  );

  function onFocusin(event: FocusEvent) {
    // Only the keyboard focus expands it: a click on an item would keep it expanded after the
    // mouse leaves
    focusInside.value = !dismissed.value && (event.target as Element).matches(":focus-visible");
  }

  function onFocusout(event: FocusEvent) {
    if (isInside(event, event.relatedTarget)) return;
    focusInside.value = false;
    searching.value = false;
    dismissed.value = false;
  }

  function onMouseenter(event: MouseEvent) {
    if (syntheticEvents.has(event)) return;
    pointerInside.value = true;
    dismissed.value = false;
  }

  function onMouseleave(event: MouseEvent) {
    if (syntheticEvents.has(event)) return;
    pointerInside.value = false;
    // The drawer collapsed on this event, even if the focus is still inside
    syncHover();
  }

  async function dismiss() {
    menuOpen.value = false;
    pointerInside.value = false;
    focusInside.value = false;
    dismissed.value = true;

    // Once the search (if expanded by the shortcut) gave the focus back to where it was
    await nextTick();
    if (collapsed.value && isHidingFocus()) {
      restoringFocus = true;
      toValue(searchItem)!.$el.focus();
      restoringFocus = false;
    }
  }

  /**
   * Whether the focus is on an element the collapsed rail hides: the search field or an item of a
   * group, which would leave the focus on the page's body.
   */
  function isHidingFocus(): boolean {
    const { activeElement } = document;
    const groupsItems = [...findDrawer().querySelectorAll(".v-list-group__items")];
    return (
      toValue(field)!.$el.contains(activeElement) ||
      groupsItems.some((items) => items.contains(activeElement))
    );
  }

  function isRestoringFocus(): boolean {
    return restoringFocus;
  }

  /** Expands or collapses the drawer's rail, through the mouse events it listens to. */
  function syncHover() {
    const event = new MouseEvent(collapsed.value ? "mouseleave" : "mouseenter");
    syntheticEvents.add(event);
    findDrawer().dispatchEvent(event);
  }

  function findDrawer(): HTMLElement {
    return toValue(field)!.$el.closest(".v-navigation-drawer");
  }

  function currentGroups(): unknown[] {
    return (toValue(items) ?? [])
      .filter((item) => isParentItem(item) && hasCurrentRoute(item))
      .map(({ description }) => description);
  }

  function isActiveGroup(item: NavigationMenuParentItem): boolean {
    return collapsed.value && hasCurrentRoute(item);
  }

  function hasCurrentRoute(item: NavigationMenuParentItem): boolean {
    return item.items.some(({ route }) => isCurrentRoute(route));
  }

  /**
   * Whether the route is the current page, or one of its parents, as the links highlight
   * themselves: by the matched route record and the params the route sets.
   */
  function isCurrentRoute(route: RouteLocationRaw | undefined): boolean {
    if (!router || route === undefined || isExternalRoute(route)) return false;

    const { matched, params } = router.resolve(route);
    const current = router.currentRoute.value;
    const record = matched.at(-1);
    // Widened to take the record, which is undefined when the route matches no page (and then isn't
    // among the current page's records)
    const currentRecords: ReadonlyArray<unknown> = current.matched;

    return (
      currentRecords.includes(record) &&
      Object.entries(params).every(([key, value]) => isDeepEqual(value, current.params[key]))
    );
  }

  return {
    mobile,
    collapsed,
    drawerOpen,
    menuOpen,
    opened,
    isActiveGroup,
    dismiss,
    isRestoringFocus,
    onFocusin,
    onFocusout,
    onMouseenter,
    onMouseleave,
  };
}

export function isParentItem(
  item: NavigationMenuParentItemOrItem,
): item is NavigationMenuParentItem {
  return "items" in item;
}

function isInside(event: Event, target: EventTarget | null): boolean {
  return target instanceof Node && (event.currentTarget as Element).contains(target);
}
