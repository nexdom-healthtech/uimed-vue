import Toast from "@/components/dialogs/toast.vue";
import { useToast } from "@/composables/index.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import { mount } from "@vue/test-utils";
import { VSnackbarQueue } from "vuetify/components";

const message = "Message text here!";

describe("Toast", () => {
  const wrapper = mountToast();

  it("should exists", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain snackbar component", () => {
    const snackbar = findSnackbar(wrapper);
    expect(snackbar.exists()).toBeTruthy();
  });

  it("should fill snackbar component props with default values", () => {
    const snackbar = findSnackbar(wrapper);
    expect(snackbar.props("displayStrategy")).toBe("overflow");
    expect(snackbar.props("totalVisible")).toBe("3");
    expect(snackbar.props("location")).toBe("top end");
    expect(snackbar.props("collapsed")).toBeTruthy();
    expect(snackbar.props("closable")).toBeTruthy();
    expect(snackbar.props("timer")).toBeTruthy();
  });

  describe("useToast composable", () => {
    const { toast } = useToast();

    it("should be able to add messages", () => {
      const snackbar = findSnackbar(wrapper);
      expect(snackbar.props("modelValue")).toHaveLength(0);

      toast({ message });

      expect(snackbar.props("modelValue")).toHaveLength(1);
      expect(snackbar.props("modelValue")?.[0]).toEqual(expect.objectContaining({ text: message }));
    });
  });

  describe("timer bar", () => {
    const { toast } = useToast();

    // Lets the toasts of previous tests time out, so only the new ones stay active
    beforeEach(() => vi.advanceTimersByTimeAsync(6000));

    it("should hide the timer bar of every visible toast from assistive technologies", async () => {
      toast({ message: "Message 1" });
      toast({ message: "Message 2" });
      await vi.advanceTimersByTimeAsync(100);

      const contents = findContents();
      expect(contents).toHaveLength(2);
      contents.forEach((content) => expectDecorativeTimer(content));
    });

    it("should keep the message announced", async () => {
      toast({ message });
      await vi.advanceTimersByTimeAsync(100);

      const [content] = findSingleContent();
      const status = content?.querySelector("[role='status']");
      expect(status?.textContent).toBe(message);
      expect(status?.getAttribute("aria-live")).toBe("polite");
      expect(status?.closest("[aria-hidden='true']")).toBeNull();
    });

    it("should hide the timer bar recreated when the pointer leaves the toast", async () => {
      toast({ message });
      await vi.advanceTimersByTimeAsync(100);

      const [content] = findSingleContent();
      content?.dispatchEvent(new Event("pointerenter"));
      await vi.advanceTimersByTimeAsync(100);
      expect(content?.querySelector(".v-snackbar__timer")).toBeNull();

      content?.dispatchEvent(new Event("pointerleave"));
      await vi.advanceTimersByTimeAsync(100);
      expectDecorativeTimer(content);
    });
  });
});

function findContents() {
  return [...document.querySelectorAll(".v-snackbar--active .v-overlay__content")];
}

function findSingleContent() {
  const contents = findContents();
  expect(contents).toHaveLength(1);
  return contents;
}

function expectDecorativeTimer(content: Element | undefined) {
  const bar = content?.querySelector(".v-snackbar__timer [role='progressbar']");
  expect(bar?.getAttribute("aria-hidden")).toBe("true");
}

function mountToast() {
  return mount(Toast, {
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findSnackbar(wrapper: ReturnType<typeof mountToast>) {
  return wrapper.findComponent(VSnackbarQueue);
}
