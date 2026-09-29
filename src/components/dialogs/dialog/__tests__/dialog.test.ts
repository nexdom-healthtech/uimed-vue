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
import { mount, type VueWrapper } from "@vue/test-utils";
import { h, nextTick, ref, type VNode } from "vue";
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
  props?: DialogProps & {
    modelValue?: boolean;
    "onUpdate:modelValue"?: (modelValue: boolean) => void;
  };
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
        "onUpdate:modelValue": (modelValue: boolean) => {
          props["onUpdate:modelValue"]?.(modelValue);
          void wrapper.setProps({ modelValue });
        },
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

  it("should render the title, content and actions as parts of the card", () => {
    const wrapper = mountDialog({ props: { title, actions: [{ label: "Fechar" }] } });

    // Only the content scrolls when it's a direct child of the card
    const card = wrapper.findComponent(VCard);
    expect(card.props("title")).toBe(title);
    [VCardItem, VCardText, VCardActions].forEach((part) =>
      expect(wrapper.findComponent(part).element.parentElement).toBe(card.element),
    );
    expect(wrapper.findComponent(VCardText).text()).toBe(content);
    expect(wrapper.findComponent(VCardActions).findComponent(Button).text()).toBe("Fechar");
  });

  it("should not add spacing classes to the card's parts", () => {
    const wrapper = mountDialog({ props: { title, actions: [{ label: "Fechar" }] } });

    const parts = [VCardItem, VCardText, VCardActions].map((part) => wrapper.findComponent(part));
    parts.forEach((part) => expect(part.classes().join(" ")).not.toMatch(/\b[pm][atrblxy]?-/));
  });

  describe("title", () => {
    it("should display the title as plain text", () => {
      const html = "<b>bold</b>";
      const wrapper = mountDialog({ props: { title: html } });

      expect(wrapper.findComponent(VCardTitle).text()).toBe(html);
      expect(document.querySelector("b")).toBeNull();
    });

    it.each([undefined, ""])("should not display a title area when the title is %o", (title) => {
      const wrapper = mountDialog({ props: { title } });

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
    it("should close at once, but update the model only once the dialog leaves", async () => {
      const wrapper = mountDialog();

      findVDialog(wrapper).vm.$emit("update:modelValue", false);
      await nextTick();

      expect(findVDialog(wrapper).props("modelValue")).toBe(false);
      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
      expect(wrapper.props("modelValue")).toBe(true);

      leave(wrapper);
      await nextTick();

      expect(wrapper.emitted("update:modelValue")).toEqual([[false]]);
      expect(wrapper.props("modelValue")).toBe(false);
      expect(findVDialog(wrapper).props("modelValue")).toBe(false);
    });

    it("should close when Esc is pressed", async () => {
      const wrapper = mountDialog();

      pressEscape();
      await nextTick();
      expect(findVDialog(wrapper).props("modelValue")).toBe(false);
      leave(wrapper);

      expect(wrapper.emitted("update:modelValue")).toEqual([[false]]);
    });

    it("should close on the browser's back button", () => {
      const wrapper = mountDialog();

      // Closing on back navigation relies on this option, which only works in apps using vue-router
      expect(findVDialog(wrapper).props("closeOnBack")).toBe(true);
    });

    it("should always be dismissible out of a dialog host, even while an action loads", async () => {
      const wrapper = mountDialog({ props: { actions: [{ label: "Salvar", loading: true }] } });

      expect(findVDialog(wrapper).props("persistent")).toBeFalsy();
      pressEscape();
      await nextTick();

      expect(findVDialog(wrapper).props("modelValue")).toBe(false);
    });

    it("should not emit anything when the model closes it", async () => {
      const wrapper = mountDialog();

      await wrapper.setProps({ modelValue: false });
      expect(findVDialog(wrapper).props("modelValue")).toBe(false);
      leave(wrapper);
      await nextTick();

      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    });

    it("should open again when the model opens it while it leaves", async () => {
      const wrapper = mountDialog();

      await wrapper.setProps({ modelValue: false });
      await wrapper.setProps({ modelValue: true });

      expect(findVDialog(wrapper).props("modelValue")).toBe(true);
      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    });

    it("should not emit anything when the model closes it while it leaves", async () => {
      const wrapper = mountDialog();

      findVDialog(wrapper).vm.$emit("update:modelValue", false);
      await wrapper.setProps({ modelValue: false });
      leave(wrapper);
      await nextTick();

      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
      expect(findVDialog(wrapper).props("modelValue")).toBe(false);
    });

    it("should not emit anything when it's unmounted while it leaves", async () => {
      const wrapper = mountDialog();

      findVDialog(wrapper).vm.$emit("update:modelValue", false);
      await nextTick();
      wrapper.unmount();
      wrappers.splice(wrappers.indexOf(wrapper), 1);

      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    });

    it("should open when the model opens it after it left", async () => {
      const wrapper = mountDialog();

      findVDialog(wrapper).vm.$emit("update:modelValue", false);
      leave(wrapper);
      await nextTick();
      await wrapper.setProps({ modelValue: true });

      expect(findVDialog(wrapper).props("modelValue")).toBe(true);
    });
  });

  describe("dialog host", () => {
    it("should block dismissals while the host requires it", async () => {
      const persistent = ref(true);
      const wrapper = mountDialog({ host: createHost({ persistent: () => persistent.value }) });

      expect(findVDialog(wrapper).props("persistent")).toBe(true);
      pressEscape();
      await nextTick();
      expect(findVDialog(wrapper).props("modelValue")).toBe(true);

      persistent.value = false;
      await nextTick();
      expect(findVDialog(wrapper).props("persistent")).toBe(false);
    });

    it("should notify the host once it leaves, whatever closed it", async () => {
      const host = createHost();
      const wrapper = mountDialog({ host });

      await wrapper.setProps({ modelValue: false });
      expect(host.afterLeave).not.toHaveBeenCalled();
      leave(wrapper);
      expect(host.afterLeave).toHaveBeenCalledTimes(1);

      await wrapper.setProps({ modelValue: true });
      findVDialog(wrapper).vm.$emit("update:modelValue", false);
      leave(wrapper);
      expect(host.afterLeave).toHaveBeenCalledTimes(2);
    });

    it("should update the model before notifying the host", () => {
      const calls: string[] = [];
      const wrapper = mountDialog({
        props: { "onUpdate:modelValue": () => calls.push("update:modelValue") },
        host: createHost({ afterLeave: () => calls.push("afterLeave") }),
      });

      findVDialog(wrapper).vm.$emit("update:modelValue", false);
      leave(wrapper);

      expect(calls).toEqual(["update:modelValue", "afterLeave"]);
    });
  });

  describe("accessibility", () => {
    it('should use the "dialog" role', () => {
      mountDialog();

      expect(findOverlay()?.getAttribute("role")).toBe("dialog");
    });

    it("should be named by its title and not described", () => {
      mountDialog({ props: { title } });

      expect(findOverlay()?.getAttribute("aria-label")).toBe(title);
      expect(findOverlay()?.hasAttribute("aria-labelledby")).toBe(false);
      expect(findOverlay()?.hasAttribute("aria-describedby")).toBe(false);
    });

    it.each([undefined, ""])("should be labelled by its content when the title is %o", (title) => {
      mountDialog({ props: { title } });

      const contentId = findContent()?.id;
      expect(contentId).toBeTruthy();
      expect(findContent()?.textContent).toBe(content);
      expect(findOverlay()?.getAttribute("aria-labelledby")).toBe(contentId);
      expect(findOverlay()?.hasAttribute("aria-label")).toBe(false);
    });

    it("should use the role given by the dialog host and be described by its content", () => {
      mountDialog({ props: { title }, host: createHost({ role: () => "alertdialog" }) });

      expect(findOverlay()?.getAttribute("role")).toBe("alertdialog");
      expect(findOverlay()?.getAttribute("aria-describedby")).toBe(findContent()?.id);
    });

    it('should fall back to the "dialog" role when the dialog host has none', () => {
      mountDialog({ host: createHost() });

      expect(findOverlay()?.getAttribute("role")).toBe("dialog");
    });
  });

  // The focus rules are covered by `useDialogFocus`'s own tests
  it("should move the focus into the content once it enters and back as soon as the user closes it", async () => {
    const origin = focusNewElement(document.createElement("button"));
    const wrapper = mountDialog({
      props: { modelValue: false, actions: [{ label: "Salvar" }] },
      slot: () => [h("p", content), h("input", { "data-test": "field" })],
      stubTransitions: false,
    });

    await wrapper.setProps({ modelValue: true });
    enter(wrapper);
    expect(document.activeElement).toBe(document.querySelector("[data-test=field]"));

    findVDialog(wrapper).vm.$emit("update:modelValue", false);
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(document.activeElement).toBe(origin);
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

function findContent() {
  return document.querySelector(".v-card-text > div");
}

function enter(wrapper: VueWrapper) {
  findVDialog(wrapper).vm.$emit("afterEnter");
}

function leave(wrapper: VueWrapper) {
  findVDialog(wrapper).vm.$emit("afterLeave");
}

function createHost(context: Partial<DialogHostContext> = {}) {
  return { role: () => undefined, persistent: () => false, afterLeave: vi.fn(), ...context };
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
