import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, h, KeepAlive, nextTick, shallowRef, type Component } from "vue";
import { createMemoryHistory, createRouter, RouterView } from "vue-router";
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
  it("should render the default slot inside a full height wrapper", () => {
    const { wrapper } = mountPageTransition();
    const pageWrapper = getPageWrapper(wrapper);

    expect(pageWrapper.element.tagName).toBe("DIV");
    expect(pageWrapper.classes()).toEqual(["h-100"]);
    expect(pageWrapper.get('[data-testid="first-page"]').text()).toBe("Primeira página");
  });

  it("should render an empty wrapper without a page", () => {
    const wrapper = mount(PageTransition, { global: { plugins: [vueTestUtilsPluginUimed()] } });
    expect(wrapper.get("div").element.outerHTML).toBe('<div class="h-100"></div>');
  });

  it('should use the fade transition with the "out-in" mode', () => {
    const { wrapper } = mountPageTransition();
    expect(wrapper.findComponent(VFadeTransition).props("mode")).toBe("out-in");
  });

  it("should only render the next page after the current one leaves", async () => {
    const { wrapper, page } = mountPageTransition();

    page.value = SecondPage;
    await nextTick();

    expect(getPageWrapper(wrapper).classes()).toContain(leaving);
    expect(wrapper.find('[data-testid="first-page"]').exists()).toBeTruthy();
    expect(wrapper.find('[data-testid="second-page"]').exists()).toBeFalsy();

    await vi.runAllTimersAsync();

    expect(wrapper.find('[data-testid="first-page"]').exists()).toBeFalsy();
    expect(wrapper.get('[data-testid="second-page"]').isVisible()).toBeTruthy();
  });

  it.each([
    ["a section", SectionPage, "section-page"],
    ["several elements", SeveralRootsPage, "several-roots-page"],
  ])("should animate the change from and to a page with %s at its root", async (_, root, id) => {
    const { wrapper, page } = mountPageTransition(root);

    page.value = SecondPage;
    await nextTick();

    expect(getPageWrapper(wrapper).classes()).toContain(leaving);
    expect(wrapper.find(`[data-testid="${id}"]`).exists()).toBeTruthy();

    await vi.runAllTimersAsync();
    expect(wrapper.find(`[data-testid="${id}"]`).exists()).toBeFalsy();
    expect(wrapper.find('[data-testid="second-page"]').exists()).toBeTruthy();

    page.value = root;
    await nextTick();

    expect(getPageWrapper(wrapper).classes()).toContain(leaving);

    await vi.runAllTimersAsync();
    expect(wrapper.find('[data-testid="second-page"]').exists()).toBeFalsy();
    expect(wrapper.find(`[data-testid="${id}"]`).exists()).toBeTruthy();
  });

  it("should not animate the change of pages kept alive", async () => {
    const page = shallowRef<Component>(FirstPage);
    const Parent = defineComponent({
      render: () =>
        h("main", [
          h(PageTransition, null, { default: () => h(KeepAlive, null, [h(page.value)]) }),
        ]),
    });
    const wrapper = mount(Parent, {
      global: { plugins: [vueTestUtilsPluginUimed()], stubs: { transition: false } },
    });

    page.value = SecondPage;
    await nextTick();

    expect(getPageWrapper(wrapper).classes()).not.toContain(leaving);
    expect(wrapper.find('[data-testid="first-page"]').exists()).toBeFalsy();
    expect(wrapper.find('[data-testid="second-page"]').exists()).toBeTruthy();
  });

  it("should not inherit unexpected attributes", () => {
    const { wrapper } = mountPageTransition(FirstPage, {
      style: "random-style",
      class: "random-class",
      title: "random-title",
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

  describe("with the router", () => {
    it("should reuse the page when only the route's params change", async () => {
      const { wrapper, router, mounts } = await mountWithRouter(false);

      await router.push("/pacientes/2");
      await nextTick();

      expect(getPageWrapper(wrapper).classes()).not.toContain(leaving);
      expect(wrapper.get('[data-testid="patient-page"]').text()).toBe("2");
      expect(mounts()).toBe(1);
    });

    it("should animate the change of params when the page's key is the route's path", async () => {
      const { wrapper, router, mounts } = await mountWithRouter(true);

      await router.push("/pacientes/2");
      await nextTick();

      expect(getPageWrapper(wrapper).classes()).toContain(leaving);
      expect(wrapper.get('[data-testid="patient-page"]').text()).toBe("1");

      await vi.runAllTimersAsync();

      expect(wrapper.get('[data-testid="patient-page"]').text()).toBe("2");
      expect(mounts()).toBe(2);
    });
  });
});

function getPageWrapper(wrapper: ReturnType<typeof mount>) {
  return wrapper.get("main > div");
}

function mountPageTransition(
  firstPage: Component = FirstPage,
  attrs: Record<string, unknown> = {},
) {
  const page = shallowRef<Component>(firstPage);

  // Swaps the page inside the transition, as `<router-view v-slot="{ Component }">` does
  const Parent = defineComponent({
    render: () => h("main", [h(PageTransition, attrs, { default: () => h(page.value) })]),
  });

  const wrapper = mount(Parent, {
    global: {
      plugins: [vueTestUtilsPluginUimed()],
      // Vue Test Utils replaces transitions with a stub that swaps the pages at once
      stubs: { transition: false },
    },
  });

  return { wrapper, page };
}

async function mountWithRouter(keyedByPath: boolean) {
  let mounts = 0;
  const PatientPage = defineComponent({
    props: { id: { type: String, required: true } },
    setup(props) {
      mounts++;
      return () => h("div", { "data-testid": "patient-page" }, props.id);
    },
  });

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/pacientes/:id", component: PatientPage, props: true }],
  });
  await router.push("/pacientes/1");

  // Same as `<router-view v-slot="{ Component, route }">` in a template
  const App = defineComponent({
    render: () =>
      h("main", [
        h(RouterView, null, {
          default: ({ Component, route }: { Component: Component; route: { fullPath: string } }) =>
            h(PageTransition, null, {
              default: () => h(Component, keyedByPath ? { key: route.fullPath } : null),
            }),
        }),
      ]),
  });

  const wrapper = mount(App, {
    global: {
      plugins: [vueTestUtilsPluginUimed(), router],
      stubs: { transition: false },
    },
  });
  await flushPromises();

  return { wrapper, router, mounts: () => mounts };
}
