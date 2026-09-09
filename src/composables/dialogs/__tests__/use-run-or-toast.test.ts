import useToast from "@/composables/dialogs/use-toast.ts";
import useRunOrToast from "@/composables/dialogs/use-run-or-toast..ts";

vi.mock(import("@/composables/dialogs/use-toast.ts"), () => ({
  default: vi.fn().mockReturnValue({ toast: vi.fn() }),
}));

describe("useRunOrToast", () => {
  const expectedFirstParam = "First";
  const expectedSecondParam = "Second";
  const expectedValue = "Success!";
  const fakeFunction = vi.fn().mockResolvedValue(expectedValue);

  describe("run", () => {
    const { toast } = useToast();
    const { run } = useRunOrToast();

    it("should run and return the expected value on success", async () => {
      const result = run(fakeFunction, expectedFirstParam, expectedSecondParam);

      await expect(result).resolves.toBe(expectedValue);
      expect(fakeFunction).toHaveBeenCalledTimes(1);
      expect(fakeFunction).toHaveBeenCalledWith(expectedFirstParam, expectedSecondParam);
      expect(toast).not.toHaveBeenCalled();
    });

    it("should run successfully with arrow functions", async () => {
      const result = run(() => fakeFunction(expectedFirstParam, expectedSecondParam));

      await expect(result).resolves.toBe(expectedValue);
      expect(fakeFunction).toHaveBeenCalledTimes(1);
      expect(fakeFunction).toHaveBeenCalledWith(expectedFirstParam, expectedSecondParam);
      expect(toast).not.toHaveBeenCalled();
    });

    it("should call toast on error", async () => {
      const { run } = useRunOrToast();

      const message = "Invalid argument!";
      const color = "danger";
      const expectedError = new Error(message);
      const fakeFunction = vi.fn().mockRejectedValue(expectedError);

      const result = run(fakeFunction);
      await expect(result).resolves.toBe(false);
      expect(toast).toHaveBeenCalledTimes(1);
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({ message, color }));
    });

    it("should log unexpected throws as error", async () => {
      const { run } = useRunOrToast();

      const expectedError = "String message";
      const fakeFunction = vi.fn().mockRejectedValue(expectedError);

      const result = run(fakeFunction);
      await expect(result).resolves.toBe(false);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("isRunning", () => {
    it("should update isRunning", async () => {
      const { run, isRunning } = useRunOrToast();

      expect(isRunning.value).toBe(false);

      const promise = run(fakeFunction, expectedFirstParam, expectedSecondParam);
      expect(isRunning.value).toBe(true);

      await promise;
      expect(isRunning.value).toBe(false);
    });
  });
});
