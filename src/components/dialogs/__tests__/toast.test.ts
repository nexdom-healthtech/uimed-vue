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
});

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
