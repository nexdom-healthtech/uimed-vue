import { VSkeletonLoader } from "vuetify/components";
import { mount, renderToString } from "@vue/test-utils";
import SkeletonLoader from "@/components/skeleton-loader/skeleton-loader.vue";
import type { SkeletonLoaderProps } from "@/components/skeleton-loader/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const slotContent = "Test Content";
const styleValue = "random-style";
const classValue = "random-class";

describe("SkeletonLoader", () => {
  it("should exist", () => {
    const wrapper = mountSkeletonLoader();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    const wrapper = mountSkeletonLoader();
    expect(findVSkeletonLoader(wrapper).exists()).toBeTruthy();
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountSkeletonLoader({ loading: true });
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.classes()).not.toContain(classValue);
  });

  describe("props", () => {
    describe("loading", () => {
      it("should forward to v-skeleton-loader", () => {
        const wrapper = mountSkeletonLoader({ loading: true });
        expect(findVSkeletonLoader(wrapper).props("loading")).toBe(true);
        expect(wrapper.find(".v-skeleton-loader").exists()).toBeTruthy();
        expect(wrapper.text()).not.toContain(slotContent);
      });

      it("should render the default slot when not loading", () => {
        const wrapper = mountSkeletonLoader();
        expect(findVSkeletonLoader(wrapper).props("loading")).toBeFalsy();
        expect(wrapper.find(".v-skeleton-loader").exists()).toBeFalsy();
        expect(wrapper.text()).toBe(slotContent);
      });
    });

    describe("type", () => {
      it("should forward to v-skeleton-loader", () => {
        const wrapper = mountSkeletonLoader({ type: "list-item@6" });
        expect(findVSkeletonLoader(wrapper).props("type")).toBe("list-item@6");
      });
    });

    describe.each([
      ["fullWidth", "w-100"],
      ["fullHeight", "h-100"],
    ] as const)("%s", (prop, className) => {
      it(`should stretch the skeleton with the ${className} class`, () => {
        const wrapper = mountSkeletonLoader({ loading: true, [prop]: true });
        expect(findVSkeletonLoader(wrapper).classes()).toContain(className);
      });

      it(`should not add the ${className} class by default`, () => {
        const wrapper = mountSkeletonLoader({ loading: true });
        expect(findVSkeletonLoader(wrapper).classes()).not.toContain(className);
      });
    });

    describe("color", () => {
      it("should forward to v-skeleton-loader", () => {
        const wrapper = mountSkeletonLoader({ color: "primary" });
        expect(findVSkeletonLoader(wrapper).props("color")).toBe("primary");
      });
    });
  });

  describe("accessibility", () => {
    it("should announce the loading in pt-BR to screen readers", () => {
      const wrapper = mountSkeletonLoader({ loading: true });
      expect(wrapper.attributes("role")).toBe("alert");
      expect(wrapper.attributes("aria-label")).toBe("Carregando...");
      expect(wrapper.attributes("aria-live")).toBe("polite");
    });

    it("should not render the non-hyphenated ARIA attributes", () => {
      const wrapper = mountSkeletonLoader({ loading: true });
      const attributeNames = wrapper.element.getAttributeNames();
      expect(attributeNames).not.toContain("arialabel");
      expect(attributeNames).not.toContain("arialive");
    });

    it("should not add the ARIA attributes to the default slot when not loading", () => {
      const wrapper = mountSkeletonLoader({}, { default: `<p>${slotContent}</p>` });
      expect(wrapper.find("[role]").exists()).toBeFalsy();
      expect(wrapper.find("[aria-label]").exists()).toBeFalsy();
      expect(wrapper.find("[aria-live]").exists()).toBeFalsy();
    });

    it("should announce the loading with valid ARIA attributes when rendered on the server", async () => {
      const html = await renderSkeletonLoader({ loading: true });
      expect(html).toContain('role="alert"');
      expect(html).toContain('aria-label="Carregando..."');
      expect(html).toContain('aria-live="polite"');
      expect(html).not.toContain("arialabel");
      expect(html).not.toContain("arialive");
    });

    it("should render only the default slot on the server when not loading", async () => {
      const html = await renderSkeletonLoader();
      expect(html).toContain(slotContent);
      expect(html).not.toContain("v-skeleton-loader");
      expect(html).not.toContain("aria-");
      expect(html).not.toContain("role=");
    });
  });
});

function mountSkeletonLoader(
  props: Partial<SkeletonLoaderProps> = {},
  slots: Record<string, string> = {},
) {
  return mount(SkeletonLoader, getMountingOptions(props, slots));
}

function renderSkeletonLoader(props: Partial<SkeletonLoaderProps> = {}) {
  return renderToString(SkeletonLoader, getMountingOptions(props, {}));
}

function getMountingOptions(props: Partial<SkeletonLoaderProps>, slots: Record<string, string>) {
  return {
    props: { type: "image", ...props },
    attrs: {
      style: styleValue,
      class: classValue,
    },
    slots: {
      default: slotContent,
      ...slots,
    },
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  };
}

function findVSkeletonLoader(wrapper: ReturnType<typeof mountSkeletonLoader>) {
  return wrapper.findComponent(VSkeletonLoader);
}
