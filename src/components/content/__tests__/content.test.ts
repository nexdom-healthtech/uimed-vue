import { VCardText } from "vuetify/components";
import { mount } from "@vue/test-utils";
import Content from "@/components/content/content.vue";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const styleValue = "random-style";
const classValue = "random-class";

describe("Content", () => {
  it("should exist", () => {
    const wrapper = mountContent();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain v-card-text", () => {
    const wrapper = mountContent();
    expect(findVCardText(wrapper).exists()).toBeTruthy();
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountContent();
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).not.toContain(classValue);
  });

  describe("slots", () => {
    describe("default", () => {
      it("should render content passed to the default slot", () => {
        const wrapper = mountContent({ default: "Test Content" });
        expect(wrapper.text()).toContain("Test Content");
      });

      it("should forward the default slot content to v-card-text", () => {
        const wrapper = mountContent({ default: "Test Content" });
        expect(findVCardText(wrapper).text()).toContain("Test Content");
      });
    });
  });
});

function mountContent(slots: Record<string, string> = {}) {
  return mount(Content, {
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

function findVCardText(wrapper: ReturnType<typeof mountContent>) {
  return wrapper.findComponent(VCardText);
}
