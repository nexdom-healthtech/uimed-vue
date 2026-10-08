import useConfirm from "@/composables/dialogs/use-confirm.ts";
import { isDeepEqual } from "@nexdom/shared/utils";
import type {
  UnsavedChangesOptions,
  UnsavedChangesValues,
} from "@/composables/navigation/types.ts";
import {
  computed,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  toValue,
  watch,
  type ComputedRef,
} from "vue";
import { onBeforeRouteLeave } from "vue-router";

/**
 * Calls whose page is on display with unsaved changes. The `beforeunload` listener is registered
 * while at least one of them exists, so a call that stops guarding doesn't remove the guard of the
 * others.
 */
const unloadGuards = new Set<object>();

function preventUnload(event: BeforeUnloadEvent) {
  event.preventDefault();
}

function updateUnloadListener() {
  if (unloadGuards.size > 0) globalThis.addEventListener("beforeunload", preventUnload);
  else globalThis.removeEventListener("beforeunload", preventUnload);
}

/**
 * Composable which compares the original and the current values of a form, and asks the user to
 * confirm before leaving the page while they differ.
 *
 * Must be called in the `setup` of a component. Leaving through vue-router is only guarded in
 * components rendered by a `<RouterView>`, and the confirmation dialog is displayed by `UMain`.
 *
 * @param values - The original (`previous`) and current (`current`) values, as refs, getters or
 * reactive objects. They're compared in depth: key order doesn't matter, a key holding `undefined`
 * equals a missing key, dates are compared by their time and arrays item by item, in order.
 * @param options - Texts and color of the confirmation dialog, and whether to ask for the
 * browser's native confirmation before unloading the page.
 * @returns `hasChanges`, a computed property which is `true` while the values differ
 *
 * @example
 * ```ts
 * const saved = ref({ name: "Maria" });
 * const form = ref(structuredClone(toRaw(saved.value)));
 *
 * const { hasChanges } = useUnsavedChanges({ previous: saved, current: form });
 *
 * async function save() {
 *   await api.save(form.value);
 *   // Marks the form as saved
 *   saved.value = structuredClone(toRaw(form.value));
 * }
 * ```
 */
export default function useUnsavedChanges<T>(
  values: UnsavedChangesValues<T>,
  options: UnsavedChangesOptions = {},
): { hasChanges: ComputedRef<boolean> } {
  const hasChanges = computed(
    () => !isDeepEqual(toValue(values.previous), toValue(values.current)),
  );
  const { confirm } = useConfirm();

  /** Answer of the dialog on display, shared by every navigation made while it's open. */
  let pending: Promise<boolean> | undefined;

  onBeforeRouteLeave(() => {
    if (!hasChanges.value) return true;

    pending ??= confirm(
      {
        title: options.title ?? "Alterações não salvas",
        message:
          options.message ??
          "Existem alterações que ainda não foram salvas. Deseja sair sem salvar?",
        confirmText: options.confirmText ?? "Sair sem salvar",
        cancelText: options.cancelText ?? "Continuar editando",
        color: options.color ?? "danger",
      },
      // Nothing runs on confirmation: `confirm` resolves `false` only when the user stays
      async () => {},
    )
      .then((answer) => answer !== false)
      .finally(() => (pending = undefined));

    return pending;
  });

  /** Whether the component is on display, which is false while `<KeepAlive>` keeps it deactivated. */
  let isActive = true;

  if (options.beforeUnload ?? true) {
    // Registered only while there are changes, since `beforeunload` listeners prevent the browser
    // from keeping the page in its back/forward cache. Mounted hooks don't run on the server.
    onMounted(() => watch(hasChanges, updateBeforeUnload, { immediate: true }));
    onUnmounted(deactivate);
    // Pages cached by `<KeepAlive>` are deactivated instead of unmounted when the user leaves them,
    // and their watchers keep running, so changes made meanwhile (e.g. by a slow request) wait for
    // the page to be activated again
    onDeactivated(deactivate);
    onActivated(() => {
      isActive = true;
      updateBeforeUnload();
    });
  }

  /** Identifies this call in `unloadGuards`. */
  const unloadGuard = {};

  function updateBeforeUnload() {
    if (hasChanges.value && isActive) unloadGuards.add(unloadGuard);
    else unloadGuards.delete(unloadGuard);
    updateUnloadListener();
  }

  function deactivate() {
    isActive = false;
    updateBeforeUnload();
  }

  return { hasChanges };
}
