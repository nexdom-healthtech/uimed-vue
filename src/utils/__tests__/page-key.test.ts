import { defineComponent, h } from "vue";
import { getPageKey } from "@/utils/page-key.ts";

const FirstPage = defineComponent({ render: () => h("div", "Primeira página") });
const SecondPage = defineComponent({ render: () => h("div", "Segunda página") });
const FunctionalPage = () => h("div", "Página funcional");

describe("getPageKey", () => {
  it("should keep the key while the same page is rendered", () => {
    expect(getPageKey([h(FirstPage)])).toBe(getPageKey([h(FirstPage)]));
  });

  it("should change the key when another component is rendered", () => {
    const keys = [
      getPageKey([h(FirstPage)]),
      getPageKey([h(SecondPage)]),
      getPageKey([h(FunctionalPage)]),
      getPageKey([h("section")]),
      getPageKey([h("article")]),
    ];

    expect(new Set(keys).size).toBe(keys.length);
  });

  it("should change the key when the page's key changes", () => {
    const first = getPageKey([h(FirstPage, { key: "/pacientes/1" })]);

    expect(first).not.toBe(getPageKey([h(FirstPage, { key: "/pacientes/2" })]));
    expect(first).not.toBe(getPageKey([h(FirstPage)]));
    expect(first).toBe(getPageKey([h(FirstPage, { key: "/pacientes/1" })]));
  });

  it("should accept symbols as the page's key", () => {
    const key = Symbol("page");
    expect(getPageKey([h(FirstPage, { key })])).toBe(getPageKey([h(FirstPage, { key })]));
  });

  it("should consider every node, in order", () => {
    const both = getPageKey([h(FirstPage), h(SecondPage)]);

    expect(both).not.toBe(getPageKey([h(FirstPage)]));
    expect(both).not.toBe(getPageKey([h(SecondPage), h(FirstPage)]));
    expect(both).toBe(getPageKey([h(FirstPage), h(SecondPage)]));
  });

  it("should return the same key without nodes, whether or not they're given", () => {
    expect(getPageKey()).toBe(getPageKey([]));
    expect(getPageKey()).not.toBe(getPageKey([h(FirstPage)]));
  });
});
