import { computed, ref } from "vue";
import useToast from "@/composables/dialogs/use-toast.ts";

const { toast } = useToast();

/**
 * Generate `run` method and a computed property `isRunning`.
 * Calling `run` will  reactively update `isRunning`.
 *
 * @example
 * ```ts
 * const { run, isRunning } = useRunOrToast();
 *
 * // Logs: false
 * console.log(isRunning.value);
 *
 * const promise = run(() => someFunction(param1, param2));
 *
 * // Logs: true
 * console.log(isRunning.value);
 *
 * await promise;
 * // Logs: false
 * console.log(isRunning.value);
 * ```
 */
export default function useRunOrToast() {
  const running = ref(false);
  const isRunning = computed(() => running.value);

  /**
   * Receives a function and its parameters, runs it, and if it throws an error, shows a toast with the error message.
   * @returns the function returned value or `false` on error
   *
   * @example
   * ```ts
   * const { run, isRunning } = useRunOrToast();
   *
   * // Call like this:
   * const someFunctionResult1 = await run(() => someFunction(param1, param2));
   *
   * // Or this:
   * const someFunctionResult2 = await run(someFunction, param1, param2);
   * ```
   */
  async function run<T extends (...args: Parameters<T>) => PromiseLike<Awaited<ReturnType<T>>>>(
    toRun: T,
    ...params: Parameters<T>
  ): Promise<Awaited<ReturnType<T>> | false> {
    try {
      running.value = true;
      return await toRun(...params);
    } catch (error) {
      if (error instanceof Error) toast({ message: error.message, color: "danger" });
      else console.error(error);
      return false;
    } finally {
      running.value = false;
    }
  }

  return { run, isRunning };
}
