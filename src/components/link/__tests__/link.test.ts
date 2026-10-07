import { mount, flushPromises } from "@vue/test-utils";
import { createMemoryHistory, createRouter, RouterLink, type RouteLocationRaw } from "vue-router";
import Link from "@/components/link/link.vue";
import type { LinkProps } from "@/components/link/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const testId = "link-test-id";
const text = "Esqueceu sua senha?";
const externalUrl = "https://example.com/help";

describe("Link", () => {
  it("should exist", async () => {
    const { wrapper } = await mountLink();
    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.findAll("a")).toHaveLength(1);
  });

  it("should render the default slot as its text", async () => {
    const { link } = await mountLink();
    expect(link.text()).toBe(text);
  });

  it("should only have the class that removes the underline", async () => {
    const { link } = await mountLink();
    expect(link.classes()).toEqual(["text-decoration-none"]);
  });

  it("should not inherit unexpected attributes", async () => {
    const { link } = await mountLink(
      {},
      { style: "random-style", class: "random-class", target: "_blank" },
    );
    expect(link.attributes("style")).toBeUndefined();
    expect(link.attributes("target")).toBeUndefined();
    expect(link.classes()).not.toContain("random-class");
  });

  describe("props", () => {
    describe("route", () => {
      describe("inside the app", () => {
        it("should render a router link with the resolved href", async () => {
          const { wrapper, link } = await mountLink({ route: { name: "forgot-password" } });
          const routerLink = wrapper.findComponent(RouterLink);

          expect(routerLink.exists()).toBeTruthy();
          expect(routerLink.props("to")).toEqual({ name: "forgot-password" });
          expect(link.element.tagName).toBe("A");
          expect(link.attributes("href")).toBe("/forgot-password");
        });

        it("should navigate through the router when clicked", async () => {
          const { link, router } = await mountLink({ route: "/forgot-password" });

          await link.trigger("click");
          await flushPromises();

          expect(router.currentRoute.value.path).toBe("/forgot-password");
        });

        it('should set "aria-current" only when it points to the current route', async () => {
          const { link, router } = await mountLink({ route: "/forgot-password" });
          expect(link.attributes("aria-current")).toBeUndefined();

          await router.push("/forgot-password");
          expect(link.attributes("aria-current")).toBe("page");
        });

        it("should follow changes of the route", async () => {
          const { wrapper, link } = await mountLink({ route: "/login" });
          expect(link.attributes("href")).toBe("/login");

          await wrapper.setProps({ route: "/forgot-password" });
          expect(link.attributes("href")).toBe("/forgot-password");
        });
      });

      describe("starting with http", () => {
        it("should render a plain anchor with the URL as href", async () => {
          const { wrapper, link } = await mountLink({ route: externalUrl });

          expect(wrapper.findComponent(RouterLink).exists()).toBeFalsy();
          expect(link.element.tagName).toBe("A");
          expect(link.attributes("href")).toBe(externalUrl);
          expect(link.attributes("to")).toBeUndefined();
          expect(link.attributes("target")).toBeUndefined();
        });

        it("should not navigate through the router when clicked", async () => {
          const { link, router } = await mountLink({ route: externalUrl });
          const push = vi.spyOn(router, "push");

          await link.trigger("click");
          await flushPromises();

          expect(push).not.toHaveBeenCalled();
          expect(router.currentRoute.value.path).toBe("/login");
        });
      });
    });

    describe("dataTestid", () => {
      it('should set the "data-testid" attribute on the link', async () => {
        const { link } = await mountLink({ dataTestid: testId });
        expect(link.attributes("data-testid")).toBe(testId);
      });

      it('should set the "data-testid" attribute on an http link', async () => {
        const { link } = await mountLink({ route: externalUrl, dataTestid: testId });
        expect(link.attributes("data-testid")).toBe(testId);
      });

      it('should not set the "data-testid" attribute by default', async () => {
        const { link } = await mountLink();
        expect(link.attributes("data-testid")).toBeUndefined();
      });
    });
  });
});

async function mountLink(props: Partial<LinkProps> = {}, attrs: Record<string, unknown> = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/login", component: {} },
      { path: "/forgot-password", name: "forgot-password", component: {} },
    ],
  });
  await router.push("/login");

  const wrapper = mount(Link, {
    props: { route: "/forgot-password" as RouteLocationRaw, ...props },
    attrs,
    slots: { default: text },
    global: {
      plugins: [vueTestUtilsPluginUimed(), router],
    },
  });

  return { wrapper, link: wrapper.get("a"), router };
}
