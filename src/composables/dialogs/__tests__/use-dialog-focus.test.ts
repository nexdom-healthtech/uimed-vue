import { useDialogFocus } from "@/composables/dialogs/use-dialog-focus.ts";
import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick, ref } from "vue";

interface DialogOptions {
  isActive?: boolean;
  card?: Element | null;
}

describe("useDialogFocus", () => {
  const wrappers: VueWrapper[] = [];

  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
    document.body.innerHTML = "";
  });

  /** Mounts a component using the composable, with a card inside a focusable container. */
  function mountDialog({ isActive = false, card = createCard() }: DialogOptions = {}) {
    const active = ref(isActive);
    let focusFirstElement = () => {};
    const wrapper = mount({
      setup() {
        ({ focusFirstElement } = useDialogFocus(
          () => active.value,
          () => card,
        ));
        return () => null;
      },
    });
    wrappers.push(wrapper);

    return {
      card,
      focusFirstElement: () => focusFirstElement(),
      setActive: async (value: boolean) => {
        active.value = value;
        await nextTick();
      },
    };
  }

  /** Mounts a closed dialog, opens it and moves the focus into it, as when it enters. */
  async function openDialog() {
    const dialog = mountDialog();
    await dialog.setActive(true);
    dialog.focusFirstElement();
    expect(document.activeElement).toBe(dialog.card?.querySelector("button"));
    return dialog;
  }

  describe("focusFirstElement", () => {
    it("should focus the first focusable element of the card", () => {
      const card = createCard([
        createElement("p"),
        createElement("button", { disabled: "" }),
        createElement("input", { type: "hidden" }),
        createElement("span", { tabindex: "-1" }),
        createElement("input", { "data-test": "field" }),
        createElement("button"),
      ]);
      const { focusFirstElement } = mountDialog({ card });

      focusFirstElement();

      expect(document.activeElement).toBe(card.querySelector("[data-test=field]"));
    });

    it.each([
      ["link", () => createElement("a", { href: "#" })],
      ["select", () => createElement("select")],
      ["textarea", () => createElement("textarea")],
      ["tabindex", () => createElement("span", { tabindex: "0" })],
    ])("should focus a %s", (_, element) => {
      const card = createCard([
        createElement("select", { disabled: "" }),
        createElement("textarea", { disabled: "" }),
        element(),
      ]);
      const { focusFirstElement } = mountDialog({ card });

      focusFirstElement();

      expect(document.activeElement).toBe(card.lastElementChild);
    });

    it("should not focus elements outside the card", () => {
      const outside = createElement("button");
      document.body.append(outside);
      const { focusFirstElement } = mountDialog({ card: createCard([]) });

      expect(() => focusFirstElement()).not.toThrow();
      expect(document.activeElement).toBe(document.body);
    });

    it("should do nothing while the card isn't rendered", () => {
      const { focusFirstElement } = mountDialog({ card: null });

      expect(() => focusFirstElement()).not.toThrow();
      expect(document.activeElement).toBe(document.body);
    });
  });

  describe("returning the focus", () => {
    it("should return the focus to the element focused before it opened", async () => {
      const origin = focusNewElement(createElement("button"));
      const dialog = await openDialog();
      expect(document.activeElement).not.toBe(origin);

      await dialog.setActive(false);

      expect(document.activeElement).toBe(origin);
    });

    it("should return the focus when it was active from the start", async () => {
      const origin = focusNewElement(createElement("button"));
      const dialog = mountDialog({ isActive: true });
      dialog.focusFirstElement();
      expect(document.activeElement).not.toBe(origin);

      await dialog.setActive(false);

      expect(document.activeElement).toBe(origin);
    });

    it("should return the focus to SVG elements, such as icons", async () => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("tabindex", "0");
      const origin = focusNewElement(svg);
      const dialog = await openDialog();

      await dialog.setActive(false);

      expect(document.activeElement).toBe(origin);
    });

    it("should not move the focus when nothing was focused before it opened", async () => {
      const dialog = mountDialog();
      const activeElement = vi.spyOn(document, "activeElement", "get").mockReturnValue(null);
      await dialog.setActive(true);
      activeElement.mockRestore();
      dialog.focusFirstElement();

      // Throwing here would fail the test
      await dialog.setActive(false);

      expect(document.activeElement).toBe(dialog.card?.querySelector("button"));
    });

    it("should return the focus when it was lost to the page's body", async () => {
      const origin = focusNewElement(createElement("button"));
      const dialog = await openDialog();

      (document.activeElement as HTMLElement).blur();
      expect(document.activeElement).toBe(document.body);
      await dialog.setActive(false);

      expect(document.activeElement).toBe(origin);
    });

    it("should return the focus when there's no focused element", async () => {
      const origin = focusNewElement(createElement("button"));
      const focus = vi.spyOn(origin, "focus");
      const dialog = await openDialog();

      const activeElement = vi.spyOn(document, "activeElement", "get").mockReturnValue(null);
      await dialog.setActive(false);
      activeElement.mockRestore();

      expect(focus).toHaveBeenCalledTimes(1);
    });

    it("should return the focus from the card's container", async () => {
      const origin = focusNewElement(createElement("button"));
      const dialog = await openDialog();

      // Gets the focus when the dialog has no focusable element or when its text is clicked
      focusContainer(dialog.card);
      await dialog.setActive(false);

      expect(document.activeElement).toBe(origin);
    });

    it("should not move the focus once it moved elsewhere", async () => {
      focusNewElement(createElement("button"));
      const dialog = await openDialog();

      const elsewhere = focusNewElement(createElement("button"));
      await dialog.setActive(false);

      expect(document.activeElement).toBe(elsewhere);
    });

    it("should not move the focus when the card isn't rendered", async () => {
      const origin = focusNewElement(createElement("button"));
      const dialog = mountDialog({ card: null });
      await dialog.setActive(true);

      const elsewhere = focusNewElement(createElement("button"));
      await dialog.setActive(false);

      expect(document.activeElement).toBe(elsewhere);
      expect(document.activeElement).not.toBe(origin);
    });
  });

  describe("with a dialog opened from another", () => {
    /** Opens a dialog from the outer one's action, as a confirmation from one of its actions. */
    async function openNested() {
      const origin = focusNewElement(createElement("button"));
      const outer = await openDialog();
      const inner = await openDialog();
      return { origin, outer, inner };
    }

    it("should keep the focus on the inner dialog when the outer one closes", async () => {
      const { inner, outer } = await openNested();

      await outer.setActive(false);

      expect(document.activeElement).toBe(inner.card?.querySelector("button"));
    });

    it("should keep the focus on the inner dialog's container when the outer one closes", async () => {
      const { inner, outer } = await openNested();
      const container = focusContainer(inner.card);

      await outer.setActive(false);

      expect(document.activeElement).toBe(container);
    });

    it("should return the focus to the outer dialog's origin when it closed first", async () => {
      const { origin, outer, inner } = await openNested();

      await outer.setActive(false);
      await inner.setActive(false);

      expect(document.activeElement).toBe(origin);
    });

    it("should return the focus to the outer dialog's origin when both close together", async () => {
      const { origin, outer, inner } = await openNested();

      void outer.setActive(false);
      await inner.setActive(false);

      expect(document.activeElement).toBe(origin);
    });

    it("should return the focus through the outer dialog when the inner one closes first", async () => {
      const { origin, outer, inner } = await openNested();

      await inner.setActive(false);
      expect(document.activeElement).toBe(outer.card?.querySelector("button"));
      await outer.setActive(false);

      expect(document.activeElement).toBe(origin);
    });

    it("should return the focus to the outer dialog when it opened again", async () => {
      const { outer, inner } = await openNested();

      await outer.setActive(false);
      await outer.setActive(true);
      await inner.setActive(false);

      expect(document.activeElement).toBe(outer.card?.querySelector("button"));
    });

    it("should return the focus through every closed dialog", async () => {
      const { origin, outer, inner } = await openNested();
      const innermost = await openDialog();

      await outer.setActive(false);
      await inner.setActive(false);
      await innermost.setActive(false);

      expect(document.activeElement).toBe(origin);
    });
  });
});

function createElement(tag: string, attributes: Record<string, string> = {}) {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

/**
 * Creates a dialog's card, with an action by default, inside a focusable container, as the
 * dialogs render them.
 */
function createCard(children: Element[] = [createElement("button")]) {
  const container = createElement("div", { tabindex: "-1" });
  const card = createElement("div", { "data-u-dialog": "" });
  card.append(...children);
  container.append(card);
  document.body.append(container);
  return card;
}

function focusNewElement<T extends HTMLElement | SVGElement>(element: T) {
  document.body.append(element);
  element.focus();
  expect(document.activeElement).toBe(element);
  return element;
}

function focusContainer(card: Element | null) {
  const container = card?.parentElement as HTMLElement;
  container.focus();
  expect(document.activeElement).toBe(container);
  return container;
}
