import Button from "@/components/button/button.vue";
import Dialog from "@/components/dialogs/dialog/dialog.vue";
import { dialogHostKey } from "@/components/dialogs/dialog/dialog-host-key.ts";
import type {
  DialogButtonAction,
  DialogHostContext,
  DialogProps,
  DialogSize,
} from "@/components/dialogs/dialog/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { h, nextTick, type VNode } from "vue";
import { VCard, VCardActions, VCardItem, VCardText, VCardTitle, VDialog } from "vuetify/components";

const title = "Editar paciente";
const content = "Conteúdo da janela";
const testId = "dialog-test-id";

const sizes: [DialogSize, number][] = [
  ["small", 400],
  ["medium", 560],
  ["large", 800],
];

interface MountOptions {
  props?: DialogProps & { modelValue?: boolean };
  slot?: () => VNode | VNode[] | string;
  host?: DialogHostContext;
  stubTransitions?: boolean;
}

describe("Dialog", () => {
  const wrappers: VueWrapper[] = [];

  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
    document.body.innerHTML = "";
  });

  function mountDialog({
    props = {},
    slot = () => content,
    host,
    stubTransitions = true,
  }: MountOptions = {}) {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        dataTestid: testId,
        ...props,
        "onUpdate:modelValue": (modelValue: boolean) => wrapper.setProps({ modelValue }),
      },
      slots: { default: slot },
      attrs: { class: "random-class", style: "color: red" },
      attachTo: document.body,
      global: {
        plugins: [vueTestUtilsPluginUimed()],
        provide: host ? { [dialogHostKey]: host } : {},
        stubs: { transition: stubTransitions },
        // Each mount is a separate app, whose ids would repeat without their own prefix
        config: { idPrefix: `app${wrappers.length}` },
      },
    });
    wrappers.push(wrapper);
    return wrapper;
  }

  it("should be closed by default", () => {
    const wrapper = mount(Dialog, {
      slots: { default: () => content },
      attachTo: document.body,
      global: { plugins: [vueTestUtilsPluginUimed()] },
    });
    wrappers.push(wrapper);

    expect(findVDialog(wrapper).props("modelValue")).toBe(false);
    expect(wrapper.findComponent(VCard).exists()).toBeFalsy();
  });

  it("should display the content when open", () => {
    const wrapper = mountDialog();

    expect(findVDialog(wrapper).props("modelValue")).toBe(true);
    expect(wrapper.findComponent(VCardText).text()).toBe(content);
  });

  it("should keep the title and actions in place while the content scrolls", () => {
    const wrapper = mountDialog();

    expect(findVDialog(wrapper).props("scrollable")).toBe(true);
  });

  it('should set "data-testid" on the dialog', () => {
    mountDialog();

    expect(findOverlay()?.getAttribute("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountDialog();

    expect(findOverlay()?.classList.contains("random-class")).toBe(false);
    expect(findOverlay()?.getAttribute("style")).not.toContain("color");
    expect(wrapper.findComponent(VCard).classes()).not.toContain("random-class");
  });

  it("should emit afterLeave once the leave transition ends", () => {
    const wrapper = mountDialog();

    expect(wrapper.emitted("afterLeave")).toBeUndefined();
    findVDialog(wrapper).vm.$emit("afterLeave");

    expect(wrapper.emitted("afterLeave")).toEqual([[]]);
  });

  describe("title", () => {
    it("should display the title as plain text", () => {
      const html = "<b>bold</b>";
      const wrapper = mountDialog({ props: { title: html } });

      expect(wrapper.findComponent(VCardTitle).text()).toBe(html);
      expect(document.querySelector("b")).toBeNull();
    });

    it("should not display a title area without a title", () => {
      const wrapper = mountDialog();

      expect(wrapper.findComponent(VCardItem).exists()).toBeFalsy();
      expect(wrapper.findComponent(VCardTitle).exists()).toBeFalsy();
    });
  });

  describe("size", () => {
    it.each(sizes)('should set `size="%s"` as a %ipx maximum width', (size, maxWidth) => {
      const wrapper = mountDialog({ props: { size } });

      expect(findVDialog(wrapper).props("maxWidth")).toBe(maxWidth);
    });

    it("should default to the medium size", () => {
      const wrapper = mountDialog();

      expect(findVDialog(wrapper).props("maxWidth")).toBe(560);
    });
  });

  describe("spacing", () => {
    it("should pad the title and not the content's top when there's a title", () => {
      const wrapper = mountDialog({ props: { title } });

      expect(wrapper.findComponent(VCardItem).classes()).toContain("pt-6");
      expect(wrapper.findComponent(VCardText).classes()).not.toContain("pt-6");
    });

    it("should pad the content's top when there's no title", () => {
      const wrapper = mountDialog();

      expect(wrapper.findComponent(VCardText).classes()).toContain("pt-6");
    });

    it("should pad the actions", () => {
      const wrapper = mountDialog({ props: { actions: [{ label: "Fechar" }] } });

      expect(wrapper.findComponent(VCardActions).classes()).toEqual(
        expect.arrayContaining(["px-6", "pt-0", "pb-6"]),
      );
    });
  });

  describe("actions", () => {
    it("should display the actions in order, with their labels and button props", () => {
      const actions: DialogButtonAction[] = [
        { label: "Cancelar", variant: "ghost", disabled: true },
        {
          label: "Salvar",
          color: "positive",
          type: "submit",
          form: "form-id",
          loading: true,
          dataTestid: "save",
        },
      ];
      const wrapper = mountDialog({ props: { actions } });

      const buttons = findButtons(wrapper);
      expect(buttons.map((button) => button.text())).toEqual(["Cancelar", "Salvar"]);
      expect(buttons[0]?.props()).toMatchObject({ variant: "ghost", disabled: true });
      expect(buttons[1]?.props()).toMatchObject({
        color: "positive",
        type: "submit",
        form: "form-id",
        loading: true,
        dataTestid: "save",
      });
    });

    it("should call the clicked action's onClick without closing", async () => {
      const onClick = vi.fn();
      const wrapper = mountDialog({ props: { actions: [{ label: "Salvar", onClick }] } });

      await findButtons(wrapper)[0]?.trigger("click");

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(expect.any(MouseEvent));
      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
      expect(findVDialog(wrapper).props("modelValue")).toBe(true);
    });

    it("should close when an action sets the model to false", async () => {
      const wrapper = mountDialog({
        props: {
          actions: [{ label: "Fechar", onClick: () => wrapper.setProps({ modelValue: false }) }],
        },
      });

      await findButtons(wrapper)[0]?.trigger("click");

      expect(findVDialog(wrapper).props("modelValue")).toBe(false);
    });

    it("should ignore clicks on actions without onClick", async () => {
      const wrapper = mountDialog({ props: { actions: [{ label: "Fechar" }] } });

      await findButtons(wrapper)[0]?.trigger("click");

      expect(findVDialog(wrapper).props("modelValue")).toBe(true);
    });

    it.each([undefined, []])(
      "should not display an actions area when actions are %s",
      (actions) => {
        const wrapper = mountDialog({ props: { actions } });

        expect(wrapper.findComponent(VCardActions).exists()).toBeFalsy();
      },
    );
  });

  describe("dismissal", () => {
    it("should close when dismissed", async () => {
      const wrapper = mountDialog();

      findVDialog(wrapper).vm.$emit("update:modelValue", false);
      await nextTick();

      expect(wrapper.emitted("update:modelValue")).toEqual([[false]]);
      expect(findVDialog(wrapper).props("modelValue")).toBe(false);
    });

    it("should close when Esc is pressed", async () => {
      const wrapper = mountDialog();

      pressEscape();
      await nextTick();

      expect(wrapper.emitted("update:modelValue")).toEqual([[false]]);
    });

    it("should close on the browser's back button", () => {
      const wrapper = mountDialog();

      // Closing on back navigation relies on this option, which only works in apps using vue-router
      expect(findVDialog(wrapper).props("closeOnBack")).toBe(true);
    });

    it("should be dismissible by default", () => {
      const wrapper = mountDialog();

      expect(findVDialog(wrapper).props("persistent")).toBe(false);
    });

    it("should not close on Esc when persistent", async () => {
      const wrapper = mountDialog({ props: { persistent: true } });

      pressEscape();
      await nextTick();

      expect(findVDialog(wrapper).props("persistent")).toBe(true);
      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
      expect(findVDialog(wrapper).props("modelValue")).toBe(true);
    });
  });

  describe("accessibility", () => {
    it('should use the "dialog" role', () => {
      mountDialog();

      expect(findOverlay()?.getAttribute("role")).toBe("dialog");
    });

    it("should be labelled by its title and not described", () => {
      const wrapper = mountDialog({ props: { title } });

      const titleId = wrapper.findComponent(VCardTitle).attributes("id");
      const contentId = wrapper.findComponent(VCardText).attributes("id");
      expect(titleId).toBeTruthy();
      expect(contentId).toBeTruthy();
      expect(titleId).not.toBe(contentId);
      expect(findOverlay()?.getAttribute("aria-labelledby")).toBe(titleId);
      expect(findOverlay()?.hasAttribute("aria-describedby")).toBe(false);
    });

    it("should be labelled by its content when it has no title", () => {
      const wrapper = mountDialog();

      const contentId = wrapper.findComponent(VCardText).attributes("id");
      expect(contentId).toBeTruthy();
      expect(findOverlay()?.getAttribute("aria-labelledby")).toBe(contentId);
    });

    it("should use the role given by the dialog host and be described by its content", () => {
      const wrapper = mountDialog({ props: { title }, host: { role: () => "alertdialog" } });

      const contentId = wrapper.findComponent(VCardText).attributes("id");
      expect(findOverlay()?.getAttribute("role")).toBe("alertdialog");
      expect(findOverlay()?.getAttribute("aria-describedby")).toBe(contentId);
    });

    it('should fall back to the "dialog" role when the dialog host has none', () => {
      mountDialog({ host: { role: () => undefined } });

      expect(findOverlay()?.getAttribute("role")).toBe("dialog");
    });
  });

  describe("focus", () => {
    it("should focus the first focusable element of the content once the dialog enters", () => {
      const wrapper = mountDialog({
        props: { actions: [{ label: "Salvar" }] },
        slot: () => [
          h("p", content),
          h("button", { disabled: true }, "Desabilitado"),
          h("input", { type: "hidden" }),
          h("span", { tabindex: -1 }, "Fora da ordem"),
          h("input", { "data-test": "field" }),
        ],
      });

      enter(wrapper);

      expect(document.activeElement).toBe(document.querySelector("[data-test=field]"));
    });

    it.each([
      ["link", () => h("a", { href: "#" }, "Link")],
      ["select", () => h("select")],
      ["textarea", () => h("textarea")],
      ["tabindex", () => h("span", { tabindex: 0 }, "Focável")],
    ])("should focus a %s in the content", (_, element) => {
      const wrapper = mountDialog({
        props: { actions: [{ label: "Salvar" }] },
        slot: () => [h("select", { disabled: true }), h("textarea", { disabled: true }), element()],
      });

      enter(wrapper);

      expect(document.activeElement).toBe(
        wrapper.findComponent(VCardText).element.lastElementChild,
      );
    });

    it("should focus the first action when the content has no focusable element", () => {
      const wrapper = mountDialog({
        props: { actions: [{ label: "Cancelar" }, { label: "Salvar" }] },
      });

      enter(wrapper);

      expect(document.activeElement).toBe(findButtons(wrapper)[0]?.element);
    });

    it("should not focus elements outside the dialog", () => {
      const outside = document.createElement("button");
      document.body.append(outside);
      const wrapper = mountDialog();

      expect(() => enter(wrapper)).not.toThrow();
      expect(document.activeElement).not.toBe(outside);
    });

    it("should return the focus to the element focused before it opened", async () => {
      const origin = focusNewElement(document.createElement("button"));
      const wrapper = mountDialog({
        props: { modelValue: false, actions: [{ label: "Salvar" }] },
      });

      await wrapper.setProps({ modelValue: true });
      enter(wrapper);
      expect(document.activeElement).not.toBe(origin);

      await wrapper.setProps({ modelValue: false });

      expect(document.activeElement).toBe(origin);
    });

    it("should return the focus when it was open from the start", async () => {
      const origin = focusNewElement(document.createElement("button"));
      const wrapper = mountDialog({ props: { actions: [{ label: "Salvar" }] } });

      enter(wrapper);
      expect(document.activeElement).not.toBe(origin);

      findVDialog(wrapper).vm.$emit("update:modelValue", false);
      await flushPromises();

      expect(document.activeElement).toBe(origin);
    });

    it("should return the focus to SVG elements, such as icons", async () => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("tabindex", "0");
      const origin = focusNewElement(svg);
      const wrapper = mountDialog({
        props: { modelValue: false, actions: [{ label: "Salvar" }] },
      });

      await wrapper.setProps({ modelValue: true });
      enter(wrapper);
      expect(document.activeElement).not.toBe(origin);

      await wrapper.setProps({ modelValue: false });

      expect(document.activeElement).toBe(origin);
    });

    it("should close without restoring the focus when nothing was focused before it opened", async () => {
      const wrapper = mountDialog({ props: { modelValue: false } });
      const activeElement = vi.spyOn(document, "activeElement", "get").mockReturnValue(null);

      await wrapper.setProps({ modelValue: true });
      activeElement.mockRestore();

      // Throwing here would fail the test
      await wrapper.setProps({ modelValue: false });
      expect(findVDialog(wrapper).props("modelValue")).toBe(false);
    });

    it("should return the focus when it was lost to the page's body", async () => {
      const origin = focusNewElement(document.createElement("button"));
      const wrapper = await openDialog();

      (document.activeElement as HTMLElement).blur();
      expect(document.activeElement).toBe(document.body);
      await wrapper.setProps({ modelValue: false });

      expect(document.activeElement).toBe(origin);
    });

    it("should return the focus when there's no focused element", async () => {
      const origin = focusNewElement(document.createElement("button"));
      const focus = vi.spyOn(origin, "focus");
      const wrapper = await openDialog();

      const activeElement = vi.spyOn(document, "activeElement", "get").mockReturnValue(null);
      await wrapper.setProps({ modelValue: false });
      activeElement.mockRestore();

      expect(focus).toHaveBeenCalledTimes(1);
    });

    it("should return the focus from the card's container", async () => {
      const origin = focusNewElement(document.createElement("button"));
      const wrapper = await openDialog();

      // Gets the focus when the dialog has no focusable element or when its text is clicked
      focusCardContainer(wrapper);
      await wrapper.setProps({ modelValue: false });

      expect(document.activeElement).toBe(origin);
    });

    describe("with a dialog opened from another", () => {
      async function openNested() {
        const origin = focusNewElement(document.createElement("button"));
        const outer = await openDialog();
        const inner = await openDialog();
        return { origin, outer, inner };
      }

      it("should keep the focus on the inner dialog when the outer one closes", async () => {
        const { inner, outer } = await openNested();

        await outer.setProps({ modelValue: false });

        expect(document.activeElement).toBe(findButtons(inner)[0]?.element);
      });

      it("should keep the focus on the inner dialog's container when the outer one closes", async () => {
        const { inner, outer } = await openNested();
        const container = focusCardContainer(inner);

        await outer.setProps({ modelValue: false });

        expect(document.activeElement).toBe(container);
      });

      it("should return the focus to the outer dialog's origin when it closed first", async () => {
        const { origin, outer, inner } = await openNested();

        await outer.setProps({ modelValue: false });
        await inner.setProps({ modelValue: false });

        expect(document.activeElement).toBe(origin);
      });

      it("should return the focus to the outer dialog's origin when both close together", async () => {
        const { origin, outer, inner } = await openNested();

        void outer.setProps({ modelValue: false });
        void inner.setProps({ modelValue: false });
        await flushPromises();

        expect(document.activeElement).toBe(origin);
      });

      it("should return the focus through the outer dialog when the inner one closes first", async () => {
        const { origin, outer, inner } = await openNested();

        await inner.setProps({ modelValue: false });
        expect(document.activeElement).toBe(findButtons(outer)[0]?.element);
        await outer.setProps({ modelValue: false });

        expect(document.activeElement).toBe(origin);
      });

      it("should return the focus to the outer dialog when it opened again", async () => {
        const { outer, inner } = await openNested();

        await outer.setProps({ modelValue: false });
        await outer.setProps({ modelValue: true });
        await inner.setProps({ modelValue: false });

        expect(document.activeElement).toBe(findButtons(outer)[0]?.element);
      });

      it("should return the focus through every closed dialog", async () => {
        const { origin, outer, inner } = await openNested();
        const innermost = await openDialog();

        await outer.setProps({ modelValue: false });
        await inner.setProps({ modelValue: false });
        await innermost.setProps({ modelValue: false });

        expect(document.activeElement).toBe(origin);
      });
    });

    /**
     * Opens a dialog with one action and moves the focus into it, as when it enters. Its leave
     * transition never ends, as the transitions of dialogs opened from others while they close.
     */
    async function openDialog() {
      const wrapper = mountDialog({
        props: { modelValue: false, actions: [{ label: "Salvar" }] },
        stubTransitions: false,
      });

      await wrapper.setProps({ modelValue: true });
      enter(wrapper);
      expect(document.activeElement).toBe(findButtons(wrapper)[0]?.element);
      return wrapper;
    }
  });
});
function findVDialog(wrapper: VueWrapper) {
  return wrapper.findComponent(VDialog);
}

function findButtons(wrapper: VueWrapper) {
  return wrapper.findAllComponents(Button);
}

function findOverlay() {
  return document.querySelector(".v-overlay");
}

function enter(wrapper: VueWrapper) {
  findVDialog(wrapper).vm.$emit("afterEnter");
}

function focusNewElement<T extends HTMLElement | SVGElement>(element: T) {
  document.body.append(element);
  element.focus();
  expect(document.activeElement).toBe(element);
  return element;
}

function pressEscape() {
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
}

function focusCardContainer(wrapper: VueWrapper) {
  const container = wrapper.findComponent(VCard).element.parentElement as HTMLElement;
  container.focus();
  expect(document.activeElement).toBe(container);
  return container;
}
