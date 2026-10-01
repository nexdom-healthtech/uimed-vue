import { VRow } from "vuetify/components";
import Row from "@/components/grid/row/row.vue";
import { mount } from "@vue/test-utils";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const testId = "row-test-component";
const styleValue = "random-style";
const classValue = "random-class";
const alignClasses = ["align-start", "align-center", "align-end", "align-stretch"];

describe("Row", () => {
  const wrapper = mountRow();

  it("should exists", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    expect(wrapper.findComponent(VRow).exists()).toBeTruthy();
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
    describe("align", () => {
      it("should align the columns to the start by default", () => {
        expectOnlyAlignClass(mountRow(), "align-start");
      });

      it.each([
        ["start", "align-start"],
        ["center", "align-center"],
        ["end", "align-end"],
        ["stretch", "align-stretch"],
      ])('should apply the "%s" alignment', (align, expectedClass) => {
        expectOnlyAlignClass(mountRow({ align }), expectedClass);
      });

      it("should update the alignment when the prop changes", async () => {
        const row = mountRow({ align: "center" });
        expectOnlyAlignClass(row, "align-center");

        await row.setProps({ align: "end" });
        expectOnlyAlignClass(row, "align-end");
      });

      it("should keep the alignment on a list", () => {
        const row = mountRow({ list: true, align: "stretch" });
        expectOnlyAlignClass(row, "align-stretch");
        expect(row.classes()).toEqual(expect.arrayContaining(["pa-0", "ma-0"]));
      });
    });

    describe("list", () => {
      it("should render a div without list classes by default", () => {
        const row = mountRow();
        expect(row.findComponent(VRow).props("tag")).toBe("div");
        expect(row.element.tagName).toBe("DIV");
        expect(row.classes()).toEqual(["v-row", "v-row--density-default", "align-start"]);
      });

      it("should render a list without its default spacing when true", () => {
        const row = mountRow({ list: true });
        expect(row.findComponent(VRow).props("tag")).toBe("ul");
        expect(row.element.tagName).toBe("UL");
        expect(row.classes()).toEqual(expect.arrayContaining(["v-row", "pa-0", "ma-0"]));
      });

      it("should go back to a div when false", async () => {
        const row = mountRow({ list: true });
        await row.setProps({ list: false });
        expect(row.element.tagName).toBe("DIV");
        expect(row.classes()).not.toContain("pa-0");
        expect(row.classes()).not.toContain("ma-0");
      });
    });
  });
});

function mountRow(props: Record<string, unknown> = {}) {
  return mount(Row, {
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

function expectOnlyAlignClass(row: ReturnType<typeof mountRow>, expectedClass: string) {
  expect(row.classes().filter((value) => alignClasses.includes(value))).toEqual([expectedClass]);
}
