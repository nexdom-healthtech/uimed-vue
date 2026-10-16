import { VCardText } from "vuetify/components";
import { mount } from "@vue/test-utils";
import SectionContent from "@/components/sections/section-content/section-content.vue";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const styleValue = "random-style";
const classValue = "random-class";

describe("SectionContent", () => {
  it("should exist", () => {
    const wrapper = mountSectionContent();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain v-card-text", () => {
    const wrapper = mountSectionContent();
    expect(findVCardText(wrapper).exists()).toBeTruthy();
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountSectionContent();
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).not.toContain(classValue);
  });

  describe("slots", () => {
    describe("default", () => {
      it("should render content passed to the default slot", () => {
        const wrapper = mountSectionContent({ default: "Test Content" });
        expect(wrapper.text()).toContain("Test Content");
      });

      it("should forward the default slot content to v-card-text", () => {
        const wrapper = mountSectionContent({ default: "Test Content" });
        expect(findVCardText(wrapper).text()).toContain("Test Content");
      });
    });
  });
});

function mountSectionContent(slots: Record<string, string> = {}) {
  return mount(SectionContent, {
    attrs: {
      style: styleValue,
      class: classValue,
    },
    slots,
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findVCardText(wrapper: ReturnType<typeof mountSectionContent>) {
  return wrapper.findComponent(VCardText);
}
