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
  });
});

function mountCol() {
  return mount(Column, {
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
