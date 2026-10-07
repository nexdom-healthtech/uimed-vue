import { VRow } from "vuetify/components";
import Row from "@/components/grid/row/row.vue";
import { mount } from "@vue/test-utils";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const testId = "row-test-component";
const styleValue = "random-style";
const classValue = "random-class";
const alignXClasses = ["justify-start", "justify-center", "justify-end"];
const alignYClasses = ["align-start", "align-center", "align-end", "align-stretch"];
const alignContentClasses = [
  "align-content-start",
  "align-content-center",
  "align-content-end",
  "align-content-stretch",
];

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
    describe("alignX", () => {
      it("should align the columns to the start by default", () => {
        expectOnlyClassOf(mountRow(), alignXClasses, "justify-start");
      });

      it.each([
        ["start", "justify-start"],
        ["center", "justify-center"],
        ["end", "justify-end"],
      ])('should apply the "%s" alignment', (alignX, expectedClass) => {
        expectOnlyClassOf(mountRow({ alignX }), alignXClasses, expectedClass);
      });

      it("should update the alignment when the prop changes", async () => {
        const row = mountRow({ alignX: "center" });
        expectOnlyClassOf(row, alignXClasses, "justify-center");

        await row.setProps({ alignX: "end" });
        expectOnlyClassOf(row, alignXClasses, "justify-end");
      });

      it("should keep the alignment on a list", () => {
        const row = mountRow({ list: true, alignX: "center" });
        expectOnlyClassOf(row, alignXClasses, "justify-center");
        expect(row.classes()).toEqual(expect.arrayContaining(["pa-0", "ma-0"]));
      });
    });

    describe("alignY", () => {
      it("should align the columns to the start by default", () => {
        expectOnlyClassOf(mountRow(), alignYClasses, "align-start");
      });

      it.each([
        ["start", "align-start"],
        ["center", "align-center"],
        ["end", "align-end"],
        ["stretch", "align-stretch"],
      ])('should apply the "%s" alignment', (alignY, expectedClass) => {
        expectOnlyClassOf(mountRow({ alignY }), alignYClasses, expectedClass);
      });

      it("should update the alignment when the prop changes", async () => {
        const row = mountRow({ alignY: "center" });
        expectOnlyClassOf(row, alignYClasses, "align-center");

        await row.setProps({ alignY: "end" });
        expectOnlyClassOf(row, alignYClasses, "align-end");
      });

      it("should keep the alignment on a list", () => {
        const row = mountRow({ list: true, alignY: "stretch" });
        expectOnlyClassOf(row, alignYClasses, "align-stretch");
        expect(row.classes()).toEqual(expect.arrayContaining(["pa-0", "ma-0"]));
      });
    });

    describe("fullHeight", () => {
      it("should not stretch the row by default", () => {
        const row = mountRow();
        expect(row.classes()).not.toContain("fill-height");
        expectNoClassOf(row, alignContentClasses);
      });

      it("should stretch the row and align its lines to the start by default when true", () => {
        const row = mountRow({ fullHeight: true });
        expect(row.classes()).toContain("fill-height");
        expectOnlyClassOf(row, alignContentClasses, "align-content-start");
        expectOnlyClassOf(row, alignYClasses, "align-start");
      });

      it.each([
        ["start", "align-content-start"],
        ["center", "align-content-center"],
        ["end", "align-content-end"],
        ["stretch", "align-content-stretch"],
      ])('should align its lines as "%s" alignY', (alignY, expectedClass) => {
        expectOnlyClassOf(
          mountRow({ fullHeight: true, alignY }),
          alignContentClasses,
          expectedClass,
        );
      });

      it("should update the classes when the props change", async () => {
        const row = mountRow({ fullHeight: true, alignY: "center" });

        await row.setProps({ alignY: "end" });
        expectOnlyClassOf(row, alignContentClasses, "align-content-end");

        await row.setProps({ fullHeight: false });
        expect(row.classes()).not.toContain("fill-height");
        expectNoClassOf(row, alignContentClasses);
      });

      it("should keep the alignment and the list classes", () => {
        const row = mountRow({ fullHeight: true, list: true, alignX: "center", alignY: "center" });
        expect(row.classes()).toEqual(
          expect.arrayContaining(["fill-height", "justify-center", "align-center", "pa-0", "ma-0"]),
        );
      });
    });

    describe("list", () => {
      it("should render a div without list classes by default", () => {
        const row = mountRow();
        expect(row.findComponent(VRow).props("tag")).toBe("div");
        expect(row.element.tagName).toBe("DIV");
        expect(row.classes()).toEqual([
          "v-row",
          "v-row--density-default",
          "justify-start",
          "align-start",
        ]);
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

function expectOnlyClassOf(
  row: ReturnType<typeof mountRow>,
  classes: string[],
  expectedClass: string,
) {
  expect(row.classes().filter((value) => classes.includes(value))).toEqual([expectedClass]);
}

function expectNoClassOf(row: ReturnType<typeof mountRow>, classes: string[]) {
  expect(row.classes().filter((value) => classes.includes(value))).toEqual([]);
}
