import { VFooter } from "vuetify/components";
import Footer from "@/components/footer/footer.vue";
import { mount } from "@vue/test-utils";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const testId = "footer-test-component";
const styleValue = "random-style";
const classValue = "random-class";
const description = "Versão 1.4.2";

describe("Footer", () => {
  let wrapper = mountFooter();
  beforeEach(() => (wrapper = mountFooter()));

  it("should exists", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    expect(findVFooter(wrapper).exists()).toBeTruthy();
  });

  it('should inherit "data-testid" attribute', () => {
    expect(findVFooter(wrapper).attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    const footer = findVFooter(wrapper);
    expect(footer.attributes("style")).toBeUndefined();
    expect(footer.classes()).not.toContain(classValue);
  });

  it("should be the app footer", () => {
    expect(findVFooter(wrapper).props("app")).toBe(true);
  });

  it("should center its text", () => {
    const classes = findVFooter(wrapper).classes();
    expect(classes).toContain("justify-center");
    expect(classes).toContain("text-center");
  });

  describe("props", () => {
    describe("description", () => {
      it("should show the description", () => {
        expect(findVFooter(wrapper).text()).toBe(description);
      });

      it("should update the description", async () => {
        const newDescription = "Versão 2.0.0";
        await wrapper.setProps({ description: newDescription });

        expect(findVFooter(wrapper).text()).toBe(newDescription);
      });
    });
  });
});

function mountFooter() {
  return mount(Footer, {
    props: { description },
    attrs: {
      "data-testid": testId,
      style: styleValue,
      class: classValue,
    },
    global: {
      stubs: {
        // Outside an app layout, the app footer can't register itself in it
        VFooter: {
          props: { app: Boolean },
          template: "<footer><slot /></footer>",
        },
      },
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findVFooter(wrapper: ReturnType<typeof mountFooter>) {
  return wrapper.findComponent(VFooter);
}
