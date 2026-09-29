import { requests } from "@/composables/dialogs/use-dialog.ts";
import type { UnsavedChangesOptions } from "@/composables/navigation/types.ts";
import useUnsavedChanges from "@/composables/navigation/use-unsaved-changes.ts";
import { mount } from "@vue/test-utils";
import { defineComponent, h, KeepAlive, nextTick, reactive, ref, type Component } from "vue";
import { createMemoryHistory, createRouter, isNavigationFailure, RouterView } from "vue-router";

interface Patient {
  name: string;
  phone?: string;
}

const defaultActions = [
  { text: "Continuar editando", variant: "ghost" },
  { text: "Sair sem salvar", value: "confirm", variant: "primary", color: "danger" },
];

describe("useUnsavedChanges", () => {
  beforeEach(() => {
    requests.value = [];
  });

  describe("hasChanges", () => {
    it("should be false while the values are equal in depth", () => {
      const { hasChanges } = mountForm({ name: "Maria" }, { name: "Maria", phone: undefined });

      expect(hasChanges.value).toBe(false);
    });

    it("should follow the changes of refs", () => {
      const { hasChanges, saved, form } = mountForm();

      form.value.name = "Joana";
      expect(hasChanges.value).toBe(true);

      saved.value = structuredClone({ ...form.value });
      expect(hasChanges.value).toBe(false);
    });

    it("should accept getters and reactive objects", () => {
      const saved = ref<Patient>({ name: "Maria" });
      const form = reactive<Patient>({ name: "Maria" });
      const { hasChanges } = mountComponent(() =>
        useUnsavedChanges({ previous: () => saved.value, current: form }),
      );

      form.phone = "1234";
      expect(hasChanges.value).toBe(true);

      saved.value = { name: "Maria", phone: "1234" };
      expect(hasChanges.value).toBe(false);
    });

    it("should always be false when both values are the same object", () => {
      const form = ref<Patient>({ name: "Maria" });
      const { hasChanges } = mountComponent(() =>
        useUnsavedChanges({ previous: form, current: form }),
      );

      form.value.name = "Joana";
      expect(hasChanges.value).toBe(false);
    });

    it("should work outside of a RouterView", async () => {
      const { hasChanges, form } = mountForm();

      form.value.name = "Joana";
      await nextTick();

      expect(hasChanges.value).toBe(true);
      expect(requests.value).toHaveLength(0);
    });
  });

  describe("navigation", () => {
    it("should leave without asking while there are no changes", async () => {
      const { router } = await mountRoutes();

      await router.push("/other");

      expect(router.currentRoute.value.path).toBe("/other");
      expect(requests.value).toHaveLength(0);
    });

    it("should ask with the default texts and color while there are changes", async () => {
      const { router, form } = await mountRoutes();
      form.value.name = "Joana";

      void router.push("/other");
      await flushPromises();

      expect(requests.value).toHaveLength(1);
      expect(requests.value[0]).toEqual(
        expect.objectContaining({
          title: "Alterações não salvas",
          message: "Existem alterações que ainda não foram salvas. Deseja sair sem salvar?",
          role: "alertdialog",
          actions: defaultActions,
        }),
      );
      expect(router.currentRoute.value.path).toBe("/");
    });

    it("should customize the texts and the color", async () => {
      const { router, form } = await mountRoutes({
        title: "Descartar cadastro",
        message: "O cadastro não foi salvo.",
        confirmText: "Descartar",
        cancelText: "Voltar ao cadastro",
        color: "caution",
      });
      form.value.name = "Joana";

      void router.push("/other");
      await flushPromises();

      expect(requests.value[0]).toEqual(
        expect.objectContaining({
          title: "Descartar cadastro",
          message: "O cadastro não foi salvo.",
          actions: [
            { text: "Voltar ao cadastro", variant: "ghost" },
            { text: "Descartar", value: "confirm", variant: "primary", color: "caution" },
          ],
        }),
      );
    });

    it("should leave when the user confirms", async () => {
      const { router, form } = await mountRoutes();
      form.value.name = "Joana";

      const navigation = router.push("/other");
      await flushPromises();
      await requests.value[0]?.select("confirm");

      await expect(navigation).resolves.toBeUndefined();
      expect(router.currentRoute.value.path).toBe("/other");
    });

    it("should stay when the user cancels or dismisses the dialog", async () => {
      const { router, form } = await mountRoutes();
      form.value.name = "Joana";

      const navigation = router.push("/other");
      await flushPromises();
      await requests.value[0]?.select(undefined);

      expect(isNavigationFailure(await navigation)).toBe(true);
      expect(router.currentRoute.value.path).toBe("/");
    });

    it("should ask again on the next navigation after an answer", async () => {
      const { router, form } = await mountRoutes();
      form.value.name = "Joana";

      void router.push("/other");
      await flushPromises();
      await requests.value[0]?.select(undefined);
      requests.value = [];

      void router.push("/other");
      await flushPromises();

      expect(requests.value).toHaveLength(1);
    });

    it("should leave without asking right after saving", async () => {
      const { router, saved, form } = await mountRoutes();
      form.value.name = "Joana";

      saved.value = structuredClone({ ...form.value });
      await router.push("/other");

      expect(router.currentRoute.value.path).toBe("/other");
      expect(requests.value).toHaveLength(0);
    });

    it("should share the answer with navigations made while the dialog is open", async () => {
      const { router, form } = await mountRoutes();
      form.value.name = "Joana";

      const first = router.push("/other");
      await flushPromises();
      const second = router.push("/another");
      await flushPromises();

      expect(requests.value).toHaveLength(1);

      await requests.value[0]?.select("confirm");

      expect(isNavigationFailure(await first)).toBe(true);
      await expect(second).resolves.toBeUndefined();
      expect(router.currentRoute.value.path).toBe("/another");
    });

    it("should share the answer with a history navigation made while the dialog is open", async () => {
      const { router, form } = await mountRoutes();
      await router.push("/other");
      await router.push("/");
      form.value.name = "Joana";

      void router.push("/another");
      await flushPromises();
      router.back();
      await flushPromises();

      expect(requests.value).toHaveLength(1);

      await requests.value[0]?.select("confirm");
      await flushPromises();

      expect(router.currentRoute.value.path).toBe("/other");
    });

    it("should ask once for each call on the page", async () => {
      const saved = ref<Patient>({ name: "Maria" });
      const form = ref<Patient>({ name: "Joana" });
      const Field = defineComponent(() => {
        useUnsavedChanges({ previous: saved, current: form });
        return () => h("p");
      });
      const router = await mountRouter(defineComponent(() => () => [h(Field), h(Field)]));

      const navigation = router.push("/other");
      await flushPromises();
      expect(requests.value).toHaveLength(1);

      await requests.value[0]?.select("confirm");
      await flushPromises();
      expect(requests.value).toHaveLength(2);

      await requests.value[1]?.select("confirm");
      await navigation;
      expect(router.currentRoute.value.path).toBe("/other");
    });
  });

  describe("beforeunload", () => {
    it("should prevent unloading only while there are changes", async () => {
      const { saved, form } = mountForm();
      expect(unload()).toBe(false);

      form.value.name = "Joana";
      await nextTick();
      expect(unload()).toBe(true);

      saved.value = structuredClone({ ...form.value });
      await nextTick();
      expect(unload()).toBe(false);
    });

    it("should prevent unloading when mounted with changes", () => {
      mountForm({ name: "Maria" }, { name: "Joana" });

      expect(unload()).toBe(true);
    });

    it("should stop preventing unloading when unmounted", () => {
      const { wrapper } = mountForm({ name: "Maria" }, { name: "Joana" });

      wrapper.unmount();

      expect(unload()).toBe(false);
    });

    it("should keep the other calls preventing unloading", () => {
      const first = mountForm({ name: "Maria" }, { name: "Joana" });
      mountForm({ name: "Maria" }, { name: "Joana" });

      first.wrapper.unmount();

      expect(unload()).toBe(true);
    });

    it("should set returnValue for browsers which ignore preventDefault", async () => {
      mountForm({ name: "Maria" }, { name: "Joana" });
      const event = new Event("beforeunload", { cancelable: true });
      // jsdom's Event only keeps `returnValue` as false, unlike a browser's BeforeUnloadEvent
      Object.defineProperty(event, "returnValue", { value: undefined, writable: true });

      window.dispatchEvent(event);

      expect(event.returnValue).toBe(true);
    });

    it("should stop preventing unloading while deactivated by KeepAlive", async () => {
      const saved = ref<Patient>({ name: "Maria" });
      const form = ref<Patient>({ name: "Joana" });
      const page = ref<"form" | "other">("form");
      const Form = defineComponent(() => {
        useUnsavedChanges({ previous: saved, current: form });
        return () => h("p");
      });
      const Other = defineComponent(() => () => h("p"));
      const wrapper = mount(() => h(KeepAlive, null, [h(page.value === "form" ? Form : Other)]));
      wrappers.push({ unmount: () => wrapper.unmount() });
      expect(unload()).toBe(true);

      page.value = "other";
      await nextTick();
      expect(unload()).toBe(false);

      page.value = "form";
      await nextTick();
      expect(unload()).toBe(true);

      saved.value = { name: "Joana" };
      page.value = "other";
      await nextTick();
      page.value = "form";
      await nextTick();
      expect(unload()).toBe(false);
    });

    it("shouldn't prevent unloading for changes made while deactivated by KeepAlive", async () => {
      const saved = ref<Patient>({ name: "Maria" });
      const form = ref<Patient>({ name: "Maria" });
      const page = ref<"form" | "other">("form");
      const Form = defineComponent(() => {
        useUnsavedChanges({ previous: saved, current: form });
        return () => h("p");
      });
      const Other = defineComponent(() => () => h("p"));
      const wrapper = mount(() => h(KeepAlive, null, [h(page.value === "form" ? Form : Other)]));
      wrappers.push({ unmount: () => wrapper.unmount() });

      page.value = "other";
      await nextTick();
      form.value = { name: "Joana" };
      await nextTick();
      expect(unload()).toBe(false);

      page.value = "form";
      await nextTick();
      expect(unload()).toBe(true);
    });

    it("shouldn't prevent unloading when disabled", () => {
      mountForm({ name: "Maria" }, { name: "Joana" }, { beforeUnload: false });

      expect(unload()).toBe(false);
    });
  });
});

const wrappers: { unmount(): void }[] = [];

afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
});

function mountComponent<T>(composable: () => T) {
  let result!: T;
  const wrapper = mount(
    defineComponent(() => {
      result = composable();
      return () => h("p");
    }),
  );
  wrappers.push({ unmount: () => wrapper.unmount() });

  return { ...result, wrapper };
}

function mountForm(
  previous: Patient = { name: "Maria" },
  current: Patient = { name: "Maria" },
  options?: UnsavedChangesOptions,
) {
  const saved = ref(previous);
  const form = ref(current);
  const result = mountComponent(() =>
    useUnsavedChanges({ previous: saved, current: form }, options),
  );

  return { ...result, saved, form };
}

async function mountRoutes(options?: UnsavedChangesOptions) {
  const saved = ref<Patient>({ name: "Maria" });
  const form = ref<Patient>({ name: "Maria" });
  const router = await mountRouter(
    defineComponent(() => {
      useUnsavedChanges({ previous: saved, current: form }, options);
      return () => h("p");
    }),
  );

  return { router, saved, form };
}

/** Mounts a router whose "/" page is the given component. */
async function mountRouter(home: Component) {
  const page = { render: () => h("p") };
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: home },
      { path: "/other", component: page },
      { path: "/another", component: page },
    ],
  });
  const wrapper = mount(() => h(RouterView), { global: { plugins: [router] } });
  wrappers.push({ unmount: () => wrapper.unmount() });
  await router.isReady();

  return router;
}

/** Dispatches a `beforeunload` event and returns whether a listener prevented it. */
function unload() {
  const event = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(event);

  return event.defaultPrevented;
}

async function flushPromises() {
  await vi.runAllTimersAsync();
}
