import { VCol } from "vuetify/components";
import Column from "@/components/grid/column/column.vue";
import { mount } from "@vue/test-utils";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const testId = "col-test-component";
const styleValue = "random-style";
const classValue = "random-class";

describe("Column", () => {
  const wrapper = mountCol();

  it("should exists", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should use full width by default", () => {
    const vCol = findVCol(wrapper);
    expect(vCol.exists()).toBeTruthy();
    expect(vCol.props("cols")).toBe("12");
  });

  it('should inherit "data-testid" attribute', () => {
    expect(wrapper.attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).not.toBeUndefined();
    expect(wrapper.attributes("class")).not.toContain(classValue);
  });

  describe("props", () => {
    describe("cols", () => {
      it("should change size for medium and greater devices only", async () => {
        const vCol = findVCol(wrapper);

        expect(vCol.props("cols")).toBe("12");
        expect(vCol.props("sm")).toBe("12");

        await wrapper.setProps({ cols: "8" });
        expect(vCol.props("cols")).toBe("12");
        expect(vCol.props("sm")).toBe("8");
      });
    });

    describe("listItem", () => {
      it("should render a div without list classes by default", () => {
        const column = mountCol();
        expect(findVCol(column).props("tag")).toBe("div");
        expect(column.element.tagName).toBe("DIV");
        expect(column.classes()).not.toContain("d-block");
      });

      it("should render a list item without its bullet when true", () => {
        const column = mountCol({ listItem: true });
        expect(findVCol(column).props("tag")).toBe("li");
        expect(column.element.tagName).toBe("LI");
        expect(column.classes()).toContain("d-block");
        expect(column.classes()).toEqual(
          expect.arrayContaining(["v-col", "v-col--cols-12", "v-col--cols-sm-12"]),
        );
      });

      it("should go back to a div when false", async () => {
        const column = mountCol({ listItem: true });
        await column.setProps({ listItem: false });
        expect(column.element.tagName).toBe("DIV");
        expect(column.classes()).not.toContain("d-block");
      });
    });
  });
});

function mountCol(props: Record<string, unknown> = {}) {
  return mount(Column, {
    props,
    attrs: {
      "data-testid": testId,
      style: styleValue,
      class: classValue,
    },
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findVCol(wrapper: ReturnType<typeof mountCol>) {
  return wrapper.findComponent(VCol);
}
