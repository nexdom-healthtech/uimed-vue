import type { DialogButtonAction } from "@/components/dialogs/dialog/types.ts";
import { useDialogLoading } from "@/composables/dialogs/use-dialog-loading.ts";
import { ref } from "vue";

describe("useDialogLoading", () => {
  it.each<[string, DialogButtonAction[] | undefined]>([
    ["undefined", undefined],
    ["empty", []],
    ["not loading", [{ label: "Cancelar" }, { label: "Salvar", loading: false }]],
    ["only disabled", [{ label: "Cancelar", disabled: true }]],
  ])("should not be loading when the actions are %s", (_, actions) => {
    const { isLoading } = useDialogLoading(() => actions);

    expect(isLoading.value).toBe(false);
  });

  it("should be loading while any action is loading", () => {
    const { isLoading } = useDialogLoading(() => [
      { label: "Cancelar", disabled: true },
      { label: "Salvar", loading: true },
    ]);

    expect(isLoading.value).toBe(true);
  });

  it("should follow the actions as they change", () => {
    const loading = ref(false);
    const { isLoading } = useDialogLoading(() => [{ label: "Salvar", loading: loading.value }]);

    expect(isLoading.value).toBe(false);
    loading.value = true;
    expect(isLoading.value).toBe(true);
    loading.value = false;
    expect(isLoading.value).toBe(false);
  });

  it("should follow actions given as a ref", () => {
    const actions = ref<DialogButtonAction[]>();
    const { isLoading } = useDialogLoading(actions);

    expect(isLoading.value).toBe(false);
    actions.value = [{ label: "Salvar", loading: true }];
    expect(isLoading.value).toBe(true);
  });
});
