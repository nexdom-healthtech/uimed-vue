import useBackToTop, { type BackToTop } from "@/composables/navigation/use-back-to-top.ts";
import { mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, useTemplateRef } from "vue";

type ContentWrapper = VueWrapper & { vm: BackToTop };

const Content = defineComponent({ template: `<main tabindex="-1"></main>` });

describe("useBackToTop", () => {
  const wrappers: VueWrapper[] = [];
  let contentTop = 0;
  let prefersReducedMotion = false;

  beforeEach(() => {
    contentTop = 0;
    prefersReducedMotion = false;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      () => ({ top: contentTop }) as DOMRect,
    );
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)" && prefersReducedMotion,
      })),
    );
    vi.stubGlobal("scrollTo", vi.fn());
    vi.stubGlobal("scrollY", 0);
  });

  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
    vi.restoreAllMocks();
  });

  function mountContent(withContent = true): ContentWrapper {
    const wrapper = mount(
      defineComponent({
        components: { Content },
        props: { withContent: Boolean },
        setup(props) {
          const content = useTemplateRef<InstanceType<typeof Content>>("content");
          return useBackToTop(() => (props.withContent ? content.value : null));
        },
        template: `<content ref="content" />`,
      }),
      { props: { withContent }, attachTo: document.body },
    );
    wrappers.push(wrapper);
    return wrapper as unknown as ContentWrapper;
  }

  /** Scrolls the page so the top of the content is `top` pixels from the top of the viewport. */
  function scrollTo(wrapper: ContentWrapper, top: number) {
    contentTop = top;
    wrapper.vm.onScroll();
  }

  describe("visible", () => {
    it("should be hidden on mount when the content starts in view", () => {
      expect(mountContent().vm.visible).toBe(false);
    });

    it("should be visible on mount when the page loads scrolled past a screen", () => {
      contentTop = -(globalThis.innerHeight + 1);

      expect(mountContent().vm.visible).toBe(true);
    });

    it("should stay hidden while the content's top is up to one screen above the viewport", () => {
      const wrapper = mountContent();

      scrollTo(wrapper, -globalThis.innerHeight);

      expect(wrapper.vm.visible).toBe(false);
    });

    it("should show once the content's top is more than one screen above the viewport", () => {
      const wrapper = mountContent();

      scrollTo(wrapper, -(globalThis.innerHeight + 1));

      expect(wrapper.vm.visible).toBe(true);
    });

    it("should hide again when the page scrolls back up", () => {
      const wrapper = mountContent();
      scrollTo(wrapper, -(globalThis.innerHeight * 2));

      scrollTo(wrapper, -100);

      expect(wrapper.vm.visible).toBe(false);
    });

    it("should stay hidden without the content", () => {
      contentTop = -(globalThis.innerHeight * 2);
      const wrapper = mountContent(false);

      wrapper.vm.onScroll();

      expect(wrapper.vm.visible).toBe(false);
    });
  });

  describe("backToTop", () => {
    it("should scroll smoothly to the top of the content", () => {
      const wrapper = mountContent();
      vi.stubGlobal("scrollY", 1000);
      scrollTo(wrapper, -900);

      wrapper.vm.backToTop();

      expect(globalThis.scrollTo).toHaveBeenCalledExactlyOnceWith({ top: 100, behavior: "smooth" });
    });

    it("should scroll instantly when the user prefers reduced motion", () => {
      prefersReducedMotion = true;
      const wrapper = mountContent();
      vi.stubGlobal("scrollY", 1000);
      scrollTo(wrapper, -1000);

      wrapper.vm.backToTop();

      expect(globalThis.scrollTo).toHaveBeenCalledExactlyOnceWith({ top: 0, behavior: "instant" });
    });

    it("should move the focus to the content without scrolling to it", () => {
      const wrapper = mountContent();
      const focus = vi.spyOn(wrapper.element as HTMLElement, "focus");

      wrapper.vm.backToTop();

      expect(focus).toHaveBeenCalledExactlyOnceWith({ preventScroll: true });
      expect(document.activeElement).toBe(wrapper.element);
    });

    it("should do nothing without the content", () => {
      const wrapper = mountContent(false);

      wrapper.vm.backToTop();

      expect(globalThis.scrollTo).not.toHaveBeenCalled();
      expect(document.activeElement).toBe(document.body);
    });
  });
});
