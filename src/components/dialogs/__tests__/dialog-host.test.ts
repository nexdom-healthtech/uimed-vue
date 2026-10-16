import Button from "@/components/button/button.vue";
import DialogHost from "@/components/dialogs/dialog-host.vue";
import Dialog from "@/components/dialogs/dialog/dialog.vue";
import { useConfirm, useDialog } from "@/composables/index.ts";
import { owners, requests } from "@/composables/dialogs/use-dialog.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import { VCardActions, VCardText, VCardTitle, VDialog } from "vuetify/components";

const title = "Excluir paciente";
const message = "Esta ação não pode ser desfeita.";

describe("DialogHost", () => {
  const { dialog } = useDialog();
  const wrappers: VueWrapper[] = [];

  beforeEach(() => (requests.value = []));

  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
    document.body.innerHTML = "";
  });

  function mountDialog() {
    const wrapper = mount(DialogHost, {
      attachTo: document.body,
      global: { plugins: [vueTestUtilsPluginUimed()] },
    });
    wrappers.push(wrapper);
    return wrapper;
  }

  it("should be closed while there's no dialog to display", () => {
    const wrapper = mountDialog();
    const vDialog = wrapper.findComponent(VDialog);

    expect(vDialog.exists()).toBeTruthy();
    expect(vDialog.props("modelValue")).toBe(false);
    expect(vDialog.props("maxWidth")).toBe(560);
  });

  it("should close on the browser's back button", () => {
    const wrapper = mountDialog();

    // Closing on back navigation relies on this option, which only works in apps using vue-router
    expect(wrapper.findComponent(VDialog).props("closeOnBack")).toBe(true);
  });

  it("should display a dialog requested before it was mounted", async () => {
    void dialog({ message });

    const wrapper = mountDialog();
    await nextTick();

    expect(wrapper.findComponent(VDialog).props("modelValue")).toBe(true);
    expect(wrapper.findComponent(VCardText).text()).toBe(message);
  });

  it("should display the title and message as plain text", async () => {
    const wrapper = mountDialog();
    const html = "<b>bold</b>";

    void dialog({ title: html, message: html });
    await nextTick();

    expect(wrapper.findComponent(VCardTitle).text()).toBe(html);
    expect(wrapper.findComponent(VCardText).text()).toBe(html);
  });

  describe("accessibility", () => {
    it("should name the dialog by its title and describe it with its message", async () => {
      mountDialog();

      void dialog({ title, message });
      await nextTick();

      const messageId = findMessage()?.id;
      expect(messageId).toBeTruthy();
      expect(findMessage()?.textContent).toBe(message);
      expect(findOverlay()?.getAttribute("aria-label")).toBe(title);
      expect(findOverlay()?.hasAttribute("aria-labelledby")).toBe(false);
      expect(findOverlay()?.getAttribute("aria-describedby")).toBe(messageId);
    });

    it("should label the dialog with its message when it has no title", async () => {
      const wrapper = mountDialog();

      void dialog({ message });
      await nextTick();

      const messageId = findMessage()?.id;
      expect(wrapper.findComponent(VCardTitle).exists()).toBeFalsy();
      expect(findOverlay()?.getAttribute("aria-labelledby")).toBe(messageId);
      expect(findOverlay()?.getAttribute("aria-describedby")).toBe(messageId);
    });

    it('should use the "dialog" role for dialogs and "alertdialog" for confirmations', async () => {
      const wrapper = mountDialog();
      const { confirm } = useConfirm();

      void dialog({ message });
      await nextTick();
      expect(findOverlay()?.getAttribute("role")).toBe("dialog");

      await clickButton(wrapper, 0);
      void confirm({ message }, vi.fn());
      await afterLeave(wrapper);
      expect(findOverlay()?.getAttribute("role")).toBe("alertdialog");
    });

    // The focus rules are covered by `useDialogFocus`'s own tests
    it("should move the focus to the first action and back to where it was", async () => {
      const wrapper = mountDialog();
      const origin = document.createElement("button");
      document.body.append(origin);
      origin.focus();

      void dialog({
        message,
        actions: [
          { text: "Sair", value: "leave" },
          { text: "Continuar", value: "stay" },
        ],
      });
      await nextTick();
      wrapper.findComponent(VDialog).vm.$emit("afterEnter");
      expect(document.activeElement).toBe(findButtons(wrapper)[0]?.element);

      await clickButton(wrapper, 1);

      expect(document.activeElement).toBe(origin);
    });
  });

  describe("actions", () => {
    it("should display the actions with their texts, variants and colors", async () => {
      const wrapper = mountDialog();

      void dialog({
        message,
        actions: [
          { text: "Sair", value: "leave", color: "danger" },
          { text: "Continuar", value: "stay" },
        ],
      });
      await nextTick();

      const buttons = findButtons(wrapper);
      expect(buttons.map((button) => button.text())).toEqual(["Sair", "Continuar"]);
      expect(buttons.map((button) => button.props("variant"))).toEqual(["ghost", "primary"]);
      expect(buttons.map((button) => button.props("color"))).toEqual(["danger", undefined]);
      expect(buttons.map((button) => button.props("loading"))).toEqual([false, false]);
      expect(buttons.map((button) => button.props("disabled"))).toEqual([false, false]);
    });

    it("should resolve the clicked action's value and close", async () => {
      const wrapper = mountDialog();

      const result = dialog({
        message,
        actions: [
          { text: "Sair", value: "leave" },
          { text: "Continuar", value: "stay" },
        ],
      });
      await nextTick();
      await clickButton(wrapper, 1);

      await expect(result).resolves.toBe("stay");
      expect(wrapper.findComponent(VDialog).props("modelValue")).toBe(false);
    });

    it("should not display actions when there are none", async () => {
      const wrapper = mountDialog();

      void dialog({ message, actions: [] });
      await nextTick();

      expect(wrapper.findComponent(VCardActions).exists()).toBeFalsy();
      expect(() => wrapper.findComponent(VDialog).vm.$emit("afterEnter")).not.toThrow();
    });
  });

  describe("dismissal", () => {
    it("should resolve undefined once the dismissed dialog leaves", async () => {
      const wrapper = mountDialog();
      const onResolve = vi.fn();

      void dialog({ message, actions: [{ text: "Sair", value: "leave" }] }).then(onResolve);
      await nextTick();
      wrapper.findComponent(VDialog).vm.$emit("update:modelValue", false);
      await flushPromises();

      expect(wrapper.findComponent(VDialog).props("modelValue")).toBe(false);
      expect(onResolve).not.toHaveBeenCalled();

      await afterLeave(wrapper);
      await flushPromises();

      expect(onResolve).toHaveBeenCalledWith(undefined);
      expect(wrapper.findComponent(VDialog).props("modelValue")).toBe(false);
      expect(requests.value).toHaveLength(0);
    });

    it("should close when Esc is pressed", async () => {
      const wrapper = mountDialog();

      const result = dialog({ message });
      await nextTick();
      pressEscape();
      await afterLeave(wrapper);

      await expect(result).resolves.toBeUndefined();
      expect(wrapper.findComponent(VDialog).props("modelValue")).toBe(false);
    });

    it("should ignore dismissals while there's no dialog on display", async () => {
      const wrapper = mountDialog();

      // The dialog only emits it while open, so emit it on the component the host listens to
      wrapper.findComponent(Dialog).vm.$emit("update:modelValue", false);
      await flushPromises();

      expect(wrapper.findComponent(VDialog).props("modelValue")).toBe(false);
    });
  });

  describe("queue", () => {
    it("should display the next dialog only after the current one leaves", async () => {
      const wrapper = mountDialog();

      void dialog({ message: "First" });
      void dialog({ message: "Second" });
      await nextTick();
      expect(wrapper.findComponent(VCardText).text()).toBe("First");

      await clickButton(wrapper, 0);
      expect(wrapper.findComponent(VDialog).props("modelValue")).toBe(false);
      expect(wrapper.findComponent(VCardText).text()).toBe("First");

      await afterLeave(wrapper);
      expect(wrapper.findComponent(VDialog).props("modelValue")).toBe(true);
      expect(wrapper.findComponent(VCardText).text()).toBe("Second");

      await clickButton(wrapper, 0);
      await afterLeave(wrapper);
      expect(wrapper.findComponent(VDialog).props("modelValue")).toBe(false);
      // A new dialog, closed from the start, takes the place of the one that left
      expect(wrapper.findComponent(VCardText).exists()).toBeFalsy();
      expect(requests.value).toHaveLength(0);
    });

    it("should display the next dialog once a dismissed one leaves", async () => {
      const wrapper = mountDialog();

      const first = dialog({ message: "First" });
      void dialog({ message: "Second" });
      await nextTick();
      pressEscape();
      await nextTick();
      expect(wrapper.findComponent(VDialog).props("modelValue")).toBe(false);
      expect(wrapper.findComponent(VCardText).text()).toBe("First");

      await afterLeave(wrapper);
      await flushPromises();

      await expect(first).resolves.toBeUndefined();
      expect(wrapper.findComponent(VDialog).props("modelValue")).toBe(true);
      expect(wrapper.findComponent(VCardText).text()).toBe("Second");

      pressEscape();
      await afterLeave(wrapper);
      await flushPromises();

      expect(wrapper.findComponent(VDialog).props("modelValue")).toBe(false);
      expect(requests.value).toHaveLength(0);
    });

    it("should display dialogs only in the first mounted instance", async () => {
      const first = mountDialog();
      const second = mountDialog();

      void dialog({ message });
      await nextTick();

      expect(first.findComponent(VDialog).props("modelValue")).toBe(true);
      expect(second.findComponent(VDialog).props("modelValue")).toBe(false);

      first.unmount();
      wrappers.splice(wrappers.indexOf(first), 1);
      await nextTick();

      expect(owners.value).toHaveLength(1);
      expect(second.findComponent(VDialog).props("modelValue")).toBe(true);
      expect(second.findComponent(VCardText).text()).toBe(message);
    });
  });

  describe("confirm", () => {
    it("should block the dialog while the confirmed action runs", async () => {
      const wrapper = mountDialog();
      const { confirm } = useConfirm();
      let finish: (value: string) => void = () => {};
      const action = vi.fn(() => new Promise<string>((resolve) => (finish = resolve)));

      const result = confirm({ message }, action);
      await nextTick();
      await clickButton(wrapper, 1);

      const vDialog = wrapper.findComponent(VDialog);
      const [cancel, confirmButton] = findButtons(wrapper);
      expect(vDialog.props("modelValue")).toBe(true);
      expect(vDialog.props("persistent")).toBe(true);
      expect(findButtons(wrapper)).toHaveLength(2);
      expect(cancel?.props("disabled")).toBe(true);
      expect(cancel?.props("loading")).toBe(false);
      expect(confirmButton?.props("loading")).toBe(true);
      expect(confirmButton?.props("disabled")).toBe(false);
      // Disabled through `loading`, so the clicks below are ignored
      expect(confirmButton?.attributes("disabled")).toBeDefined();

      pressEscape();
      await clickButton(wrapper, 1);
      await clickButton(wrapper, 0);
      expect(vDialog.props("modelValue")).toBe(true);
      expect(action).toHaveBeenCalledTimes(1);

      finish("Done");
      await flushPromises();

      await expect(result).resolves.toBe("Done");
      expect(vDialog.props("modelValue")).toBe(false);
      expect(vDialog.props("persistent")).toBe(false);
    });

    it("should resolve false when cancelled", async () => {
      const wrapper = mountDialog();
      const { confirm } = useConfirm();
      const action = vi.fn();

      const result = confirm({ message }, action);
      await nextTick();
      await clickButton(wrapper, 0);

      await expect(result).resolves.toBe(false);
      expect(action).not.toHaveBeenCalled();
    });
  });
});

function findButtons(wrapper: VueWrapper) {
  return wrapper.findAllComponents(Button);
}

async function clickButton(wrapper: VueWrapper, index: number) {
  await findButtons(wrapper)[index]?.trigger("click");
  await flushPromises();
}

async function afterLeave(wrapper: VueWrapper) {
  wrapper.findComponent(VDialog).vm.$emit("afterLeave");
  await nextTick();
}

function findOverlay() {
  return document.querySelector(".v-overlay");
}

function findMessage() {
  return document.querySelector(".v-card-text > div");
}

function pressEscape() {
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
}
