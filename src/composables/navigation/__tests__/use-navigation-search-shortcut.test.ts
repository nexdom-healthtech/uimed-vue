import {
  owners,
  useNavigationSearchShortcut,
  useNavigationShortcutKeys,
  type NavigationSearchShortcut,
  type NavigationShortcutKeys,
} from "@/composables/navigation/use-navigation-search-shortcut.ts";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, nextTick, ref, useTemplateRef } from "vue";

const macUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

const Field = defineComponent({
  props: { disabled: Boolean },
  template: `<div><input :disabled="disabled" /></div>`,
});

type Menu = VueWrapper & { vm: { open: boolean; shortcut: NavigationSearchShortcut } };

describe("useNavigationSearchShortcut", () => {
  const wrappers: VueWrapper[] = [];

  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  function mountMenu(disabled = false): Menu {
    const wrapper = mount(
      defineComponent({
        components: { Field },
        props: { disabled: Boolean },
        setup() {
          const open = ref(false);
          const shortcut = useNavigationSearchShortcut({
            open,
            field: useTemplateRef("field"),
          });
          return { open, shortcut };
        },
        template: `
          <nav class="v-navigation-drawer">
            <field ref="field" :disabled="disabled" />
            <button>Item</button>
          </nav>
        `,
      }),
      { props: { disabled }, attachTo: document.body },
    );
    wrappers.push(wrapper);
    return wrapper as unknown as Menu;
  }

  function isOpen(wrapper: Menu) {
    return wrapper.vm.open;
  }

  function findInput(wrapper: Menu) {
    return wrapper.find("input").element;
  }

  function findItem(wrapper: Menu) {
    return wrapper.find("button").element;
  }

  function appendOutside<K extends keyof HTMLElementTagNameMap>(tag: K) {
    const element = document.createElement(tag);
    document.body.append(element);
    return element;
  }

  function press(init: KeyboardEventInit, target: EventTarget = document.activeElement!) {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      bubbles: true,
      cancelable: true,
      ...init,
    });
    target.dispatchEvent(event);
    return event;
  }

  async function pressShortcut(target?: EventTarget) {
    const event = press({ ctrlKey: true }, target);
    await flushPromises();
    return event;
  }

  describe("keys", () => {
    it("should open the menu and focus the search with Ctrl+K", async () => {
      const wrapper = mountMenu();

      const event = await pressShortcut();

      expect(isOpen(wrapper)).toBe(true);
      expect(document.activeElement).toBe(findInput(wrapper));
      expect(event.defaultPrevented).toBe(true);
    });

    it("should accept the key with Caps Lock on", async () => {
      const wrapper = mountMenu();

      press({ ctrlKey: true, key: "K" });
      await flushPromises();

      expect(isOpen(wrapper)).toBe(true);
    });

    it.each<[string, KeyboardEventInit]>([
      ["K alone", {}],
      ["Ctrl with another key", { ctrlKey: true, key: "j" }],
      ["Ctrl+Shift+K", { ctrlKey: true, shiftKey: true }],
      ["Ctrl+Alt+K", { ctrlKey: true, altKey: true }],
      ["Ctrl+K while composing text", { ctrlKey: true, isComposing: true }],
      ["⌘K outside macOS", { metaKey: true }],
    ])("should ignore %s", async (_, init) => {
      const wrapper = mountMenu();

      const event = press(init);
      await flushPromises();

      expect(isOpen(wrapper)).toBe(false);
      expect(event.defaultPrevented).toBe(false);
    });

    it("should use ⌘K instead of Ctrl+K on macOS", async () => {
      vi.spyOn(navigator, "userAgent", "get").mockReturnValue(macUserAgent);
      const wrapper = mountMenu();

      const ignored = press({ ctrlKey: true });
      await flushPromises();
      expect(isOpen(wrapper)).toBe(false);
      expect(ignored.defaultPrevented).toBe(false);

      const handled = press({ metaKey: true });
      await flushPromises();
      expect(isOpen(wrapper)).toBe(true);
      expect(handled.defaultPrevented).toBe(true);
    });

    it("should handle the key before the listeners of the focused element", async () => {
      const wrapper = mountMenu();
      const input = appendOutside("input");
      input.addEventListener("keydown", (event) => event.stopPropagation());
      input.focus();

      await pressShortcut();

      expect(isOpen(wrapper)).toBe(true);
    });

    it("should handle the key when nothing is focused", async () => {
      const wrapper = mountMenu();

      const event = await pressShortcut(window);

      expect(isOpen(wrapper)).toBe(true);
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe("focus", () => {
    it("should focus the search without scrolling", async () => {
      const focus = vi.spyOn(HTMLInputElement.prototype, "focus");
      mountMenu();

      await pressShortcut();

      // Scrolling to the drawer while it slides in would shift containers with hidden overflow
      expect(focus).toHaveBeenCalledExactlyOnceWith({ preventScroll: true });
    });

    it("should select the search text", async () => {
      const wrapper = mountMenu();
      const input = findInput(wrapper) as HTMLInputElement;
      input.value = "Início";

      await pressShortcut();

      expect(input.selectionStart).toBe(0);
      expect(input.selectionEnd).toBe("Início".length);
    });

    it("should focus the search again when the menu is already open", async () => {
      const wrapper = mountMenu();
      await pressShortcut();
      findItem(wrapper).focus();

      await pressShortcut();

      expect(isOpen(wrapper)).toBe(true);
      expect(document.activeElement).toBe(findInput(wrapper));
    });

    it.each(["input", "textarea"] as const)(
      "should work while the focus is on a %s",
      async (tag) => {
        const wrapper = mountMenu();
        appendOutside(tag).focus();

        await pressShortcut();

        expect(isOpen(wrapper)).toBe(true);
        expect(document.activeElement).toBe(findInput(wrapper));
      },
    );

    it("should open the menu without focusing the search while it's disabled", async () => {
      const wrapper = mountMenu(true);
      const button = appendOutside("button");
      button.focus();

      const event = await pressShortcut();

      expect(isOpen(wrapper)).toBe(true);
      expect(event.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(button);
    });

    it('should name the search field "Buscar"', () => {
      const wrapper = mountMenu();

      expect(findInput(wrapper).getAttribute("aria-label")).toBe("Buscar");
    });
  });

  describe("ignored targets", () => {
    it.each([
      ["a rich text editor", `<div contenteditable="true"><p tabindex="0">Texto</p></div>`],
      ["an editor without value", `<div contenteditable><p tabindex="0">Texto</p></div>`],
      ["a dialog", `<div class="v-overlay"><p tabindex="0">Texto</p></div>`],
      ["a native dialog", `<dialog open><p tabindex="0">Texto</p></dialog>`],
      ["another modal", `<div role="dialog" aria-modal="true"><p tabindex="0">Texto</p></div>`],
      [
        "the activator of an open menu",
        `<p tabindex="0" aria-haspopup="menu" aria-expanded="true">Texto</p>`,
      ],
    ])("should leave the key to %s", async (_, html) => {
      const wrapper = mountMenu();
      const container = appendOutside("div");
      container.innerHTML = html;
      container.querySelector("p")!.focus();

      const event = await pressShortcut();

      expect(isOpen(wrapper)).toBe(false);
      expect(event.defaultPrevented).toBe(false);
    });

    it.each([
      [
        "elements that aren't editable",
        `<div contenteditable="false"><p tabindex="0">Texto</p></div>`,
      ],
      [
        "non-modal dialogs",
        `<div role="dialog" aria-modal="false"><p tabindex="0">Texto</p></div>`,
      ],
      [
        "the activator of a closed menu",
        `<p tabindex="0" aria-haspopup="menu" aria-expanded="false">Texto</p>`,
      ],
      ["expanded groups", `<p tabindex="0" aria-expanded="true">Texto</p>`],
    ])("should handle the key inside %s", async (_, html) => {
      const wrapper = mountMenu();
      const container = appendOutside("div");
      container.innerHTML = html;
      container.querySelector("p")!.focus();

      await pressShortcut();

      expect(isOpen(wrapper)).toBe(true);
    });
  });

  describe("owners", () => {
    beforeEach(() => (owners.value = []));

    it("should only open the first mounted menu", async () => {
      const first = mountMenu();
      const second = mountMenu();

      await pressShortcut();

      expect(isOpen(first)).toBe(true);
      expect(isOpen(second)).toBe(false);
    });

    it("should hand the key over to the next menu when the first one unmounts", async () => {
      const [first, second] = [mountMenu(), mountMenu()];
      first.unmount();

      await pressShortcut();

      expect(isOpen(second)).toBe(true);
      expect(owners.value).toHaveLength(1);
    });

    it("should stop answering the key when unmounted", async () => {
      const wrapper = mountMenu();
      wrapper.unmount();

      const event = await pressShortcut();

      expect(event.defaultPrevented).toBe(false);
    });

    it("should not leave listeners on window when unmounted", () => {
      const addEventListener = vi.spyOn(window, "addEventListener");
      const removeEventListener = vi.spyOn(window, "removeEventListener");

      mountMenu().unmount();

      // A leaked listener would do nothing, since the menu also leaves `owners`, so only the calls
      // can tell it apart
      expect(addEventListener).toHaveBeenCalled();
      expect(removeEventListener.mock.calls).toEqual(addEventListener.mock.calls);
    });
  });

  describe("close", () => {
    it("should close the menu", async () => {
      const wrapper = mountMenu();
      await pressShortcut();

      wrapper.vm.shortcut.close();

      expect(isOpen(wrapper)).toBe(false);
    });

    it("should give the focus back to where it was when the menu opened by the key", async () => {
      const wrapper = mountMenu();
      const origin = appendOutside("button");
      origin.focus();
      await pressShortcut();
      expect(document.activeElement).toBe(findInput(wrapper));

      wrapper.vm.shortcut.close();
      await nextTick();

      expect(document.activeElement).toBe(origin);
    });

    it("should give the focus back to SVG elements, such as icons", async () => {
      const wrapper = mountMenu();
      const origin = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      origin.setAttribute("tabindex", "0");
      document.body.append(origin);
      origin.focus();
      await pressShortcut();

      wrapper.vm.shortcut.close();
      await nextTick();

      expect(document.activeElement).toBe(origin);
    });

    it("should keep the first origin when the key is pressed again inside the menu", async () => {
      const wrapper = mountMenu();
      const origin = appendOutside("button");
      origin.focus();
      await pressShortcut();
      await pressShortcut();

      wrapper.vm.shortcut.close();
      await nextTick();

      expect(document.activeElement).toBe(origin);
    });

    it("should leave the focus alone when it's no longer inside the menu", async () => {
      const wrapper = mountMenu();
      appendOutside("button").focus();
      await pressShortcut();
      const elsewhere = appendOutside("input");
      elsewhere.focus();

      wrapper.vm.shortcut.close();
      await nextTick();

      expect(document.activeElement).toBe(elsewhere);
    });

    it("should leave the focus alone when the menu didn't open by the key", async () => {
      const wrapper = mountMenu();
      appendOutside("button").focus();
      wrapper.vm.open = true;
      await nextTick();
      findItem(wrapper).focus();

      wrapper.vm.shortcut.close();
      await nextTick();

      expect(document.activeElement).toBe(findItem(wrapper));
    });

    it("should forget the origin once the menu closes", async () => {
      const wrapper = mountMenu();
      appendOutside("button").focus();
      await pressShortcut();
      wrapper.vm.shortcut.close();
      await nextTick();

      wrapper.vm.open = true;
      await nextTick();
      findItem(wrapper).focus();
      wrapper.vm.shortcut.close();
      await nextTick();

      expect(document.activeElement).toBe(findItem(wrapper));
    });
  });

  describe("Escape", () => {
    function pressEscape() {
      press({ key: "Escape" });
      return nextTick();
    }

    it("should close the menu the key opened while the focus stays outside it", async () => {
      // A disabled search, as while loading, leaves the focus where it was
      const wrapper = mountMenu(true);
      const origin = appendOutside("input");
      origin.focus();
      await pressShortcut();

      await pressEscape();

      expect(isOpen(wrapper)).toBe(false);
      expect(document.activeElement).toBe(origin);
    });

    it("should leave the menu opened by other means to its own handler", async () => {
      const wrapper = mountMenu();
      appendOutside("button").focus();
      wrapper.vm.open = true;
      await nextTick();

      await pressEscape();

      expect(isOpen(wrapper)).toBe(true);
    });

    it("should only close the menu with Escape", async () => {
      const wrapper = mountMenu(true);
      appendOutside("input").focus();
      await pressShortcut();

      press({ key: "Enter" });
      await nextTick();

      expect(isOpen(wrapper)).toBe(true);
    });

    it("should leave Escape to overlays opened over the page", async () => {
      const wrapper = mountMenu(true);
      appendOutside("input").focus();
      await pressShortcut();
      const container = appendOutside("div");
      container.innerHTML = `<div class="v-overlay"><p tabindex="0">Texto</p></div>`;
      container.querySelector("p")!.focus();

      await pressEscape();

      expect(isOpen(wrapper)).toBe(true);
    });
  });
});

describe("useNavigationShortcutKeys", () => {
  afterEach(() => vi.restoreAllMocks());

  function mountKeys() {
    let keys: NavigationShortcutKeys | undefined;
    let beforeMount: [string, string] | undefined;
    const wrapper = mount(
      defineComponent({
        setup() {
          keys = useNavigationShortcutKeys();
          beforeMount = [keys.label.value, keys.ariaKeyshortcuts.value];
          return {};
        },
        template: `<div />`,
      }),
    );
    wrapper.unmount();
    return { keys: keys!, beforeMount: beforeMount! };
  }

  it("should use the Ctrl key outside macOS", () => {
    const { keys, beforeMount } = mountKeys();

    expect(beforeMount).toEqual(["Ctrl+K", "Control+K"]);
    expect(keys.label.value).toBe("Ctrl+K");
    expect(keys.ariaKeyshortcuts.value).toBe("Control+K");
  });

  it("should switch to the ⌘ key on macOS once mounted", () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(macUserAgent);

    const { keys, beforeMount } = mountKeys();

    expect(beforeMount).toEqual(["Ctrl+K", "Control+K"]);
    expect(keys.label.value).toBe("⌘K");
    expect(keys.ariaKeyshortcuts.value).toBe("Meta+K");
  });
});
