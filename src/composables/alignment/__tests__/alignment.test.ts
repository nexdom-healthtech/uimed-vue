import { ref } from "vue";
import { useAlignX, useAlignY } from "@/composables/alignment/alignment.ts";
import type { AlignX, AlignY } from "@/composables/alignment/types.ts";

describe("useAlignX", () => {
  it.each([
    ["start", "justify-start"],
    ["center", "justify-center"],
    ["end", "justify-end"],
  ] as const)('should map "%s" to "%s"', (alignX, expectedClass) => {
    expect(useAlignX(alignX).value).toBe(expectedClass);
  });

  it("should fall back to start when undefined", () => {
    expect(useAlignX(undefined).value).toBe("justify-start");
  });

  it("should react to changes", () => {
    const alignX = ref<AlignX | undefined>("center");
    const alignXClass = useAlignX(alignX);
    expect(alignXClass.value).toBe("justify-center");

    alignX.value = "end";
    expect(alignXClass.value).toBe("justify-end");

    alignX.value = undefined;
    expect(alignXClass.value).toBe("justify-start");
  });

  it("should accept a getter", () => {
    expect(useAlignX(() => "center").value).toBe("justify-center");
  });
});

describe("useAlignY", () => {
  it.each([
    ["start", "align-start", "align-content-start"],
    ["center", "align-center", "align-content-center"],
    ["end", "align-end", "align-content-end"],
    ["stretch", "align-stretch", "align-content-stretch"],
  ] as const)(
    'should map "%s" to the "%s" items class and the "%s" content class',
    (alignY, items, content) => {
      expect(useAlignY(alignY).value).toEqual({ items, content });
    },
  );

  it("should fall back to start when undefined", () => {
    expect(useAlignY(undefined).value).toEqual({
      items: "align-start",
      content: "align-content-start",
    });
  });

  it("should react to changes", () => {
    const alignY = ref<AlignY | undefined>("center");
    const alignYClasses = useAlignY(alignY);
    expect(alignYClasses.value).toEqual({ items: "align-center", content: "align-content-center" });

    alignY.value = "stretch";
    expect(alignYClasses.value).toEqual({
      items: "align-stretch",
      content: "align-content-stretch",
    });

    alignY.value = undefined;
    expect(alignYClasses.value).toEqual({ items: "align-start", content: "align-content-start" });
  });

  it("should accept a getter", () => {
    expect(useAlignY(() => "end").value).toEqual({
      items: "align-end",
      content: "align-content-end",
    });
  });
});
