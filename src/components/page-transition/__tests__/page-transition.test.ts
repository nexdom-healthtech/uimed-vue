import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, h, KeepAlive, nextTick, type Component } from "vue";
import {
  createMemoryHistory,
  createRouter,
  RouterView,
  type RouteLocationNormalizedLoaded,
} from "vue-router";
import { VFadeTransition } from "vuetify/components";
import PageTransition from "@/components/page-transition/page-transition.vue";
import Section from "@/components/sections/section/section.vue";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

// In jsdom, the class added while the page leaves is the only observable sign of the animation
const leaving = "fade-transition-leave-active";

const FirstPage = defineComponent({
  render: () => h("div", { "data-testid": "first-page" }, "Primeira página"),
});

const SecondPage = defineComponent({
  render: () => h("div", { "data-testid": "second-page" }, "Segunda página"),
});

// Renders a fragment at its root, like every page whose root is a section
const SectionPage = defineComponent({
  render: () => h(Section, { title: "Pacientes", dataTestid: "section-page" }),
});

const SeveralRootsPage = defineComponent({
  render: () => [
    h("div", { "data-testid": "several-roots-page" }, "Conteúdo"),
    h("div", "Janela modal"),
  ],
});

describe("PageTransition", () => {
  it("should render the default slot inside a full height wrapper", async () => {
    const { wrapper } = await mountWithRouter();
    const pageWrapper = getPageWrapper(wrapper);

    expect(pageWrapper.element.tagName).toBe("DIV");
    expect(pageWrapper.classes()).toEqual(["h-100"]);
    expect(pageWrapper.get('[data-testid="first-page"]').text()).toBe("Primeira página");
  });

  it("should render an empty wrapper without a page", () => {
    const wrapper = mount(PageTransition, {
      global: { plugins: [vueTestUtilsPluginUimed(), createTestRouter()] },
    });
    expect(wrapper.get("div").element.outerHTML).toBe('<div class="h-100"></div>');
  });

  it('should use the fade transition with the "out-in" mode', async () => {
    const { wrapper } = await mountWithRouter();
    expect(wrapper.findComponent(VFadeTransition).props("mode")).toBe("out-in");
  });

  it("should only render the next page after the current one leaves", async () => {
    const { wrapper, router } = await mountWithRouter();

    await router.push("/segunda");
    await nextTick();

    expect(getPageWrapper(wrapper).classes()).toContain(leaving);
    expect(wrapper.find('[data-testid="first-page"]').exists()).toBeTruthy();
    expect(wrapper.find('[data-testid="second-page"]').exists()).toBeFalsy();

    await vi.runAllTimersAsync();

    expect(wrapper.find('[data-testid="first-page"]').exists()).toBeFalsy();
    expect(wrapper.get('[data-testid="second-page"]').isVisible()).toBeTruthy();
  });

  it.each([
    ["a section", "/secao", "section-page"],
    ["several elements", "/varias-raizes", "several-roots-page"],
  ])("should animate the change from and to a page with %s at its root", async (_, path, id) => {
    const { wrapper, router } = await mountWithRouter({ path });

    await router.push("/segunda");
    await nextTick();

    expect(getPageWrapper(wrapper).classes()).toContain(leaving);
    expect(wrapper.find(`[data-testid="${id}"]`).exists()).toBeTruthy();

    await vi.runAllTimersAsync();
    expect(wrapper.find(`[data-testid="${id}"]`).exists()).toBeFalsy();
    expect(wrapper.find('[data-testid="second-page"]').exists()).toBeTruthy();

    await router.push(path);
    await nextTick();

    expect(getPageWrapper(wrapper).classes()).toContain(leaving);

    await vi.runAllTimersAsync();
    expect(wrapper.find('[data-testid="second-page"]').exists()).toBeFalsy();
    expect(wrapper.find(`[data-testid="${id}"]`).exists()).toBeTruthy();
  });

  it.each([
    ["params", "/pacientes/2", "2"],
    ["query", "/pacientes/1?aba=consultas", "1 consultas"],
    ["hash", "/pacientes/1#consultas", "1"],
  ])("should animate the change of the route's %s by default", async (_, path, text) => {
    const { wrapper, router, mounts } = await mountWithRouter({ path: "/pacientes/1" });

    await router.push(path);
    await nextTick();

    expect(getPageWrapper(wrapper).classes()).toContain(leaving);
    expect(wrapper.get('[data-testid="patient-page"]').text()).toBe("1");

    await vi.runAllTimersAsync();

    expect(wrapper.get('[data-testid="patient-page"]').text()).toBe(text);
    expect(mounts()).toBe(2);
  });

  describe("with a transition key", () => {
    it("should animate only the navigations that change it", async () => {
      const { wrapper, router, mounts } = await mountWithRouter({
        path: "/pacientes/1",
        transitionKey: (route) => route.path,
      });

      await router.push("/pacientes/1?aba=consultas");
      await nextTick();

      expect(getPageWrapper(wrapper).classes()).not.toContain(leaving);
      expect(wrapper.get('[data-testid="patient-page"]').text()).toBe("1 consultas");

      await router.push("/pacientes/1?aba=consultas#historico");
      await nextTick();

      expect(getPageWrapper(wrapper).classes()).not.toContain(leaving);
      expect(mounts()).toBe(1);

      await router.push("/pacientes/2");
      await nextTick();

      expect(getPageWrapper(wrapper).classes()).toContain(leaving);

      await vi.runAllTimersAsync();

      expect(wrapper.get('[data-testid="patient-page"]').text()).toBe("2");
      expect(mounts()).toBe(2);
    });
  });

  describe("with nested routes", () => {
    it("should animate the whole parent and create it again by default", async () => {
      const { wrapper, router, layoutMounts } = await mountNested();

      await router.push("/pacientes/2");
      await nextTick();

      // The parent leaves as it was, with the previous child inside it
      expect(getPageWrapper(wrapper).classes()).toContain(leaving);
      expect(getChildWrapper(wrapper).classes()).not.toContain(leaving);
      expect(wrapper.get('[data-testid="patient-page"]').text()).toBe("1");

      await vi.runAllTimersAsync();

      expect(wrapper.get('[data-testid="patient-page"]').text()).toBe("2");
      expect(layoutMounts()).toBe(2);
    });

    it("should only animate the child with the parent's path as the parent's key", async () => {
      const { wrapper, router, layoutMounts } = await mountNested(
        (route) => route.matched[0]?.path ?? "",
      );

      await router.push("/pacientes/2");
      await nextTick();

      expect(getPageWrapper(wrapper).classes()).not.toContain(leaving);
      expect(getChildWrapper(wrapper).classes()).toContain(leaving);

      await vi.runAllTimersAsync();

      expect(wrapper.get('[data-testid="patient-page"]').text()).toBe("2");
      expect(layoutMounts()).toBe(1);

      await router.push("/agenda");
      await nextTick();

      expect(getPageWrapper(wrapper).classes()).toContain(leaving);
    });
  });

  it("should animate the change of pages kept alive, without keeping them", async () => {
    const { wrapper, router, mounts } = await mountWithRouter({
      path: "/pacientes/1",
      keepAlive: true,
    });

    await router.push("/segunda");
    await nextTick();

    expect(getPageWrapper(wrapper).classes()).toContain(leaving);

    await vi.runAllTimersAsync();
    await router.push("/pacientes/1");
    await vi.runAllTimersAsync();

    // The wrapper is created again on every navigation, and the `<keep-alive>` inside it too
    expect(wrapper.get('[data-testid="patient-page"]').text()).toBe("1");
    expect(mounts()).toBe(2);
  });

  it("should keep the pages alive, without animation, with a fixed transition key", async () => {
    const { wrapper, router, mounts } = await mountWithRouter({
      path: "/pacientes/1",
      keepAlive: true,
      transitionKey: () => "fixa",
    });

    await router.push("/segunda");
    await nextTick();

    expect(getPageWrapper(wrapper).classes()).not.toContain(leaving);

    await router.push("/pacientes/1");
    await nextTick();

    expect(wrapper.get('[data-testid="patient-page"]').text()).toBe("1");
    expect(mounts()).toBe(1);
  });

  it("should not inherit unexpected attributes", async () => {
    const { wrapper } = await mountWithRouter({
      attrs: { style: "random-style", class: "random-class", title: "random-title" },
    });
    const pageWrapper = getPageWrapper(wrapper);
    const firstPage = wrapper.get('[data-testid="first-page"]');

    expect(pageWrapper.attributes("style")).toBeUndefined();
    expect(pageWrapper.attributes("title")).toBeUndefined();
    expect(pageWrapper.classes()).not.toContain("random-class");
    expect(firstPage.attributes("style")).toBeUndefined();
    expect(firstPage.attributes("title")).toBeUndefined();
    expect(firstPage.classes()).not.toContain("random-class");
  });
});

function getPageWrapper(wrapper: ReturnType<typeof mount>) {
  return wrapper.get("main > div");
}

function getChildWrapper(wrapper: ReturnType<typeof mount>) {
  return wrapper.get('[data-testid="layout"] > div');
}

type RouterViewSlot = { Component: Component; route: RouteLocationNormalizedLoaded };

/** Renders the route's component inside a `PageTransition`, as `<router-view v-slot>` does. */
function renderRouterView(transitionKey?: (route: RouteLocationNormalizedLoaded) => string) {
  return h(RouterView, null, {
    default: ({ Component, route }: RouterViewSlot) =>
      h(PageTransition, { transitionKey: transitionKey?.(route) }, { default: () => h(Component) }),
  });
}

/** Mounts a parent route (a layout with its own transition) with child routes. */
async function mountNested(transitionKey?: (route: RouteLocationNormalizedLoaded) => string) {
  let layoutMounts = 0;
  const Layout = defineComponent({
    setup() {
      layoutMounts++;
      return () => h("section", { "data-testid": "layout" }, [renderRouterView()]);
    },
  });

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/pacientes",
        component: Layout,
        children: [{ path: ":id", component: PatientPage, props: true }],
      },
      { path: "/agenda", component: SecondPage },
    ],
  });
  await router.push("/pacientes/1");

  const App = defineComponent({
    render: () => h("main", [renderRouterView(transitionKey)]),
  });
  const wrapper = mount(App, {
    global: { plugins: [vueTestUtilsPluginUimed(), router], stubs: { transition: false } },
  });
  await flushPromises();

  return { wrapper, router, layoutMounts: () => layoutMounts };
}

let patientMounts = 0;

const PatientPage = defineComponent({
  props: { id: { type: String, required: true }, tab: { type: String, default: undefined } },
  setup(props) {
    patientMounts++;
    return () =>
      h("div", { "data-testid": "patient-page" }, [props.id, props.tab].filter(Boolean).join(" "));
  },
});

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: FirstPage },
      { path: "/segunda", component: SecondPage },
      { path: "/secao", component: SectionPage },
      { path: "/varias-raizes", component: SeveralRootsPage },
      {
        path: "/pacientes/:id",
        component: PatientPage,
        props: (route) => ({ id: route.params.id, tab: route.query.aba }),
      },
    ],
  });
}

type MountOptions = {
  path?: string;
  transitionKey?: (route: RouteLocationNormalizedLoaded) => string;
  keepAlive?: boolean;
  attrs?: Record<string, unknown>;
};

async function mountWithRouter({
  path = "/",
  transitionKey,
  keepAlive = false,
  attrs = {},
}: MountOptions = {}) {
  patientMounts = 0;
  const router = createTestRouter();
  await router.push(path);

  // Same as `<router-view v-slot="{ Component, route }">` in a template
  const App = defineComponent({
    render: () =>
      h("main", [
        h(RouterView, null, {
          default: ({
            Component,
            route,
          }: {
            Component: Component;
            route: RouteLocationNormalizedLoaded;
          }) =>
            h(
              PageTransition,
              { ...attrs, transitionKey: transitionKey?.(route) },
              { default: () => (keepAlive ? h(KeepAlive, null, [h(Component)]) : h(Component)) },
            ),
        }),
      ]),
  });

  const wrapper = mount(App, {
    global: {
      plugins: [vueTestUtilsPluginUimed(), router],
      // Vue Test Utils replaces transitions with a stub that swaps the pages at once
      stubs: { transition: false },
    },
  });
  await flushPromises();

  return { wrapper, router, mounts: () => patientMounts };
}
