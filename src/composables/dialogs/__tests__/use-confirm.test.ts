import useConfirm from "@/composables/dialogs/use-confirm.ts";
import { requests } from "@/composables/dialogs/use-dialog.ts";
import { messages } from "@/composables/dialogs/use-toast.ts";

const title = "Excluir paciente";
const message = "Esta ação não pode ser desfeita.";

describe("useConfirm", () => {
  const firstParam = "First";
  const secondParam = "Second";
  const expectedValue = "Success!";

  beforeEach(() => {
    requests.value = [];
    messages.value = [];
  });

  describe("confirm", () => {
    it("should queue an alert dialog with its title and message", () => {
      const { confirm } = useConfirm();

      void confirm({ title, message }, vi.fn());

      expect(requests.value).toHaveLength(1);
      expect(requests.value[0]).toEqual(
        expect.objectContaining({ title, message, role: "alertdialog" }),
      );
    });

    it('should display "Cancelar" and "Confirmar" actions by default', () => {
      const { confirm } = useConfirm();

      void confirm({ message }, vi.fn());

      expect(requests.value[0]?.actions).toEqual([
        { text: "Cancelar", variant: "ghost" },
        { text: "Confirmar", value: "confirm", variant: "primary", color: undefined },
      ]);
    });

    it("should customize the texts and the confirm color", () => {
      const { confirm } = useConfirm();

      void confirm(
        { message, cancelText: "Manter", confirmText: "Excluir", color: "danger" },
        vi.fn(),
      );

      expect(requests.value[0]?.actions).toEqual([
        { text: "Manter", variant: "ghost" },
        { text: "Excluir", value: "confirm", variant: "primary", color: "danger" },
      ]);
    });

    it("should run the action with its params and resolve its value when confirmed", async () => {
      const { confirm } = useConfirm();
      const action = vi.fn().mockResolvedValue(expectedValue);

      const result = confirm({ message }, action, firstParam, secondParam);
      expect(action).not.toHaveBeenCalled();

      await requests.value[0]?.select("confirm");

      await expect(result).resolves.toBe(expectedValue);
      expect(action).toHaveBeenCalledTimes(1);
      expect(action).toHaveBeenCalledWith(firstParam, secondParam);
    });

    it("should resolve false without running the action when cancelled or dismissed", async () => {
      const { confirm } = useConfirm();
      const action = vi.fn().mockResolvedValue(expectedValue);

      const result = confirm({ message }, action);
      await requests.value[0]?.select(undefined);

      await expect(result).resolves.toBe(false);
      expect(action).not.toHaveBeenCalled();
    });

    it("should toast the error message and resolve false when the action throws an error", async () => {
      const { confirm } = useConfirm();
      const errorMessage = "Ops! Algo deu errado.";
      const action = vi.fn().mockRejectedValue(new Error(errorMessage));

      const result = confirm({ message }, action);
      await requests.value[0]?.select("confirm");

      await expect(result).resolves.toBe(false);
      expect(messages.value).toEqual([
        expect.objectContaining({ text: errorMessage, color: "error" }),
      ]);
    });

    it("should log unexpected throws as error and resolve false", async () => {
      const { confirm } = useConfirm();
      const thrown = "String message";
      const action = vi.fn().mockRejectedValue(thrown);

      const result = confirm({ message }, action);
      await requests.value[0]?.select("confirm");

      await expect(result).resolves.toBe(false);
      expect(console.error).toHaveBeenCalledWith(thrown);
      expect(messages.value).toHaveLength(0);
    });
  });

  describe("isRunning", () => {
    it("should be true only while the confirmed action runs", async () => {
      const { confirm, isRunning } = useConfirm();
      const action = vi.fn().mockResolvedValue(expectedValue);

      const result = confirm({ message }, action);
      expect(isRunning.value).toBe(false);

      const selection = requests.value[0]?.select("confirm");
      expect(isRunning.value).toBe(true);

      await selection;
      await result;
      expect(isRunning.value).toBe(false);
    });

    it("should be independent for each useConfirm call", () => {
      const first = useConfirm();
      const second = useConfirm();

      void first.confirm({ message }, vi.fn().mockResolvedValue(expectedValue));
      void requests.value[0]?.select("confirm");

      expect(first.isRunning.value).toBe(true);
      expect(second.isRunning.value).toBe(false);
    });
  });
});
