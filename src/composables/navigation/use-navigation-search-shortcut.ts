import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  toValue,
  watch,
  type ComponentPublicInstance,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";

/**
 * Mounted navigation menus, in mounting order. Only the first one answers the shortcut, so pages
 * with more than one `UMain` (like the docs) don't open every menu at once.
 */
export const owners = ref<symbol[]>([]);

/**
 * Focus targets where the shortcut is left to the page: overlays (dialogs, confirmations and
 * menus) and other modals, the activators of open menus (which keep the focus when opened by a
 * click, and would pull it back from the navigation menu) and rich text editors, which usually
 * take Ctrl+K to insert links.
 */
const IGNORED_TARGETS = [
  ".v-overlay",
  "dialog",
  "[aria-modal='true']",
  "[aria-haspopup][aria-expanded='true']",
  "[contenteditable]:not([contenteditable='false'])",
].join(", ");

/** Accessible name of the search field, whose placeholder also shows the shortcut. */
const SEARCH_NAME = "Buscar";

export interface NavigationShortcutKeys {
  /** Shortcut as shown to users: `"Ctrl+K"`, or `"⌘K"` on macOS. */
  label: ComputedRef<string>;
  /** Value for `aria-keyshortcuts`: `"Control+K"`, or `"Meta+K"` on macOS. */
  ariaKeyshortcuts: ComputedRef<string>;
}

export interface UseNavigationSearchShortcutOptions {
  /**
   * Open state of the navigation menu: its `v-model` as a drawer, or whether its rail is expanded
   * to search.
   */
  open: Ref<boolean>;
  /** Search field, focused (and its text selected) when the shortcut is pressed. */
  field: MaybeRefOrGetter<ComponentPublicInstance | null>;
}

export interface NavigationSearchShortcut extends NavigationShortcutKeys {
  /**
   * Opens the menu and focuses the search, as the shortcut does. When the menu closes with the
   * focus inside it, the focus goes back to `origin`.
   */
  openSearch: (origin: EventTarget | null) => Promise<void>;
}

/**
 * Shortcut keys for the current platform. Starts with the non-macOS keys and switches on mount,
 * so server-rendered pages (the docs) hydrate without mismatches.
 */
export function useNavigationShortcutKeys(): NavigationShortcutKeys {
  const isMac = ref(false);

  onMounted(() => (isMac.value = isMacOS()));

  return {
    label: computed(() => (isMac.value ? "⌘K" : "Ctrl+K")),
    ariaKeyshortcuts: computed(() => (isMac.value ? "Meta+K" : "Control+K")),
  };
}

/**
 * Listens to Ctrl+K (⌘K on macOS) on `window` while mounted: opens the menu, waits for it to
 * render (the drawer is `inert` while closed, and the rail only shows the field while expanded)
 * and focuses the search field (a disabled field, as while loading, can't take the focus). When
 * the menu opened by the shortcut closes with the focus inside it, the focus goes back to where it
 * was.
 */
export function useNavigationSearchShortcut(
  options: UseNavigationSearchShortcutOptions,
): NavigationSearchShortcut {
  const { open, field } = options;
  const owner = Symbol("navigation-search-shortcut");

  /** Element focused before the shortcut opened the menu, which gets the focus back on close. */
  let origin: EventTarget | null = null;

  onMounted(() => {
    owners.value.push(owner);
    // Captured before any other listener, so the docs can keep their own search from opening too
    globalThis.addEventListener("keydown", onKeydown, { capture: true });
    // Without a label the placeholder would name the field, shortcut included. Set through the DOM
    // because `TextField` doesn't forward attributes, and an `aria-label` prop would widen its API
    findInput().setAttribute("aria-label", SEARCH_NAME);
  });

  onUnmounted(() => {
    owners.value = owners.value.filter((item) => item !== owner);
    globalThis.removeEventListener("keydown", onKeydown, { capture: true });
  });

  watch(open, (isOpen) => {
    if (isOpen) return;

    const target = origin;
    origin = null;

    // Runs before the drawer turns `inert` (or the collapsed rail hides the field), which would
    // drop the focus
    const menu = findInput().closest(".v-navigation-drawer")!;
    if (!menu.contains(document.activeElement)) return;

    // Icons are usually SVG elements, which are focusable too
    if (target instanceof HTMLElement || target instanceof SVGElement) target.focus();
  });

  function onKeydown(event: KeyboardEvent) {
    if (owners.value[0] !== owner || isIgnoredTarget(event)) return;

    if (isShortcut(event)) {
      event.preventDefault();
      void openSearch(document.activeElement);
    }
    // While loading, the menu opened by the shortcut leaves the focus behind its scrim (or outside
    // the rail), out of reach of its own `Esc` handler
    else if (event.key === "Escape" && origin) open.value = false;
  }

  async function openSearch(from: EventTarget | null) {
    if (!open.value) origin = from;
    open.value = true;

    await nextTick();
    const input = findInput();
    // Focusing while the drawer slides in would scroll containers with hidden overflow
    input.focus({ preventScroll: true });
    input.select();
  }

  function findInput(): HTMLInputElement {
    return toValue(field)!.$el.querySelector("input");
  }

  return { ...useNavigationShortcutKeys(), openSearch };
}

function isMacOS(): boolean {
  return navigator.userAgent.includes("Macintosh");
}

function isShortcut(event: KeyboardEvent): boolean {
  const modifier = isMacOS() ? event.metaKey : event.ctrlKey;
  // Shift and Alt are left alone: Ctrl+Shift+K opens Firefox's console, and Ctrl+Alt is AltGr
  return (
    modifier &&
    !event.shiftKey &&
    !event.altKey &&
    !event.isComposing &&
    event.key.toLowerCase() === "k"
  );
}

function isIgnoredTarget(event: KeyboardEvent): boolean {
  return event.target instanceof Element && event.target.closest(IGNORED_TARGETS) !== null;
}
