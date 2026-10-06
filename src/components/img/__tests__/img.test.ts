import { VImg } from "vuetify/components";
import { mount } from "@vue/test-utils";
import Img from "@/components/img/img.vue";
import type { ImgProps } from "@/components/img/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const testId = "img-test-id";
const src = "/logo.svg";

describe("Img", () => {
  it("should exist", () => {
    const wrapper = mountImg();
    expect(wrapper.exists()).toBeTruthy();
    expect(findVImg(wrapper).exists()).toBeTruthy();
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountImg({}, { style: "random-style", class: "random-class" });
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.classes()).not.toContain("random-class");
  });

  it("should hide the image from assistive technologies", () => {
    const wrapper = mountImg();
    expect(findVImg(wrapper).props("alt")).toBe("");
    expect(wrapper.attributes("role")).toBeUndefined();
    expect(wrapper.attributes("aria-label")).toBeUndefined();
    expect(wrapper.find("img").attributes("alt")).toBe("");
  });

  describe("props", () => {
    describe("src", () => {
      it("should forward to v-img", () => {
        const wrapper = mountImg();
        expect(findVImg(wrapper).props("src")).toBe(src);
        expect(wrapper.find("img").attributes("src")).toBe(src);
      });
    });

    describe("width", () => {
      it("should forward a number to v-img, in pixels", () => {
        const wrapper = mountImg({ width: 380 });
        expect(findVImg(wrapper).props("width")).toBe(380);
        expect(findVImg(wrapper).attributes("style")).toContain("width: 380px");
      });

      it("should forward a string to v-img, in its own unit", () => {
        const wrapper = mountImg({ width: "100%" });
        expect(findVImg(wrapper).props("width")).toBe("100%");
        expect(findVImg(wrapper).attributes("style")).toContain("width: 100%");
      });

      it("should be undefined by default", () => {
        const wrapper = mountImg();
        expect(findVImg(wrapper).props("width")).toBeUndefined();
      });
    });

    describe("height", () => {
      it("should forward a number to v-img, in pixels", () => {
        const wrapper = mountImg({ height: 88 });
        expect(findVImg(wrapper).props("height")).toBe(88);
        expect(findVImg(wrapper).attributes("style")).toContain("height: 88px");
      });

      it("should forward a string to v-img, in its own unit", () => {
        const wrapper = mountImg({ height: "10rem" });
        expect(findVImg(wrapper).props("height")).toBe("10rem");
        expect(findVImg(wrapper).attributes("style")).toContain("height: 10rem");
      });

      it("should be undefined by default", () => {
        const wrapper = mountImg();
        expect(findVImg(wrapper).props("height")).toBeUndefined();
      });
    });

    describe("aspectRatio", () => {
      it("should forward to v-img", () => {
        const wrapper = mountImg({ aspectRatio: 2 });
        expect(findVImg(wrapper).props("aspectRatio")).toBe(2);
        expect(wrapper.find(".v-responsive__sizer").attributes("style")).toContain(
          "padding-bottom: 50%",
        );
      });

      it("should be undefined by default", () => {
        const wrapper = mountImg();
        expect(findVImg(wrapper).props("aspectRatio")).toBeUndefined();
      });
    });

    describe("cover", () => {
      it("should forward to v-img", () => {
        const wrapper = mountImg({ cover: true });
        expect(findVImg(wrapper).props("cover")).toBe(true);
        expect(wrapper.find("img").classes()).toContain("v-img__img--cover");
      });

      it("should be false by default, showing the whole image", () => {
        const wrapper = mountImg();
        expect(findVImg(wrapper).props("cover")).toBe(false);
        expect(wrapper.find("img").classes()).toContain("v-img__img--contain");
      });
    });

    describe("eager", () => {
      it("should forward to v-img", () => {
        const wrapper = mountImg({ eager: true });
        expect(findVImg(wrapper).props("eager")).toBe(true);
      });

      it("should be false by default", () => {
        const wrapper = mountImg();
        expect(findVImg(wrapper).props("eager")).toBe(false);
      });
    });

    describe("dataTestid", () => {
      it('should set the "data-testid" attribute on the root element', () => {
        const wrapper = mountImg({ dataTestid: testId });
        expect(wrapper.attributes("data-testid")).toBe(testId);
      });

      it('should not set the "data-testid" attribute by default', () => {
        const wrapper = mountImg();
        expect(wrapper.attributes("data-testid")).toBeUndefined();
      });
    });
  });
});

function mountImg(props: Partial<ImgProps> = {}, attrs: Record<string, unknown> = {}) {
  return mount(Img, {
    props: { src, ...props },
    attrs,
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findVImg(wrapper: ReturnType<typeof mountImg>) {
  return wrapper.findComponent(VImg);
}
