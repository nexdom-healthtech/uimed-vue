import useDialog, { requests } from "@/composables/dialogs/use-dialog.ts";

const title = "Sessão expirando";
const message = "Deseja continuar conectado?";

describe("useDialog", () => {
  const { dialog } = useDialog();

  beforeEach(() => (requests.value = []));

  describe("dialog", () => {
    it("should type the result as the actions' values, or undefined without custom actions", () => {
      expectTypeOf(dialog({ message })).toEqualTypeOf<Promise<undefined>>();
      expectTypeOf(
        dialog({
          message,
          actions: [
            { text: "Sair", value: "leave" },
            { text: "Continuar", value: "stay" },
          ],
        }),
      ).toEqualTypeOf<Promise<"leave" | "stay" | undefined>>();
    });

    it("should queue a dialog with its title, message and role", () => {
      void dialog({ title, message });

      expect(requests.value).toHaveLength(1);
      expect(requests.value[0]).toEqual(
        expect.objectContaining({ title, message, role: "dialog" }),
      );
    });

    it("should queue dialogs in the order they were requested", () => {
      void dialog({ message: "First" });
      void dialog({ message: "Second" });

      expect(requests.value.map((request) => request.message)).toEqual(["First", "Second"]);
    });

    it('should display a single primary "Fechar" action by default', () => {
      void dialog({ message });

      expect(requests.value[0]?.actions).toEqual([{ text: "Fechar", variant: "primary" }]);
    });

    it("should resolve undefined when dismissed or closed by the default action", async () => {
      const result = dialog({ message });

      await requests.value[0]?.select(undefined);

      await expect(result).resolves.toBeUndefined();
    });

    it("should default the variant to ghost, and to primary for the last action", () => {
      void dialog({
        message,
        actions: [
          { text: "Sair", value: "leave" },
          { text: "Lembrar depois", value: "later" },
          { text: "Continuar", value: "stay" },
        ],
      });

      expect(requests.value[0]?.actions.map((action) => action.variant)).toEqual([
        "ghost",
        "ghost",
        "primary",
      ]);
    });

    it("should keep the given variant and color of each action", () => {
      const actions = [
        { text: "Excluir", value: "delete", variant: "secondary", color: "danger" },
        { text: "Manter", value: "keep", variant: "ghost", color: "positive" },
      ] as const;

      void dialog({ message, actions: [...actions] });

      expect(requests.value[0]?.actions).toEqual(actions);
    });

    it("should resolve with the value of the selected action", async () => {
      const result = dialog({
        message,
        actions: [
          { text: "Sair", value: "leave" },
          { text: "Continuar", value: "stay" },
        ],
      });

      await requests.value[0]?.select("leave");

      await expect(result).resolves.toBe("leave");
    });
  });
});
