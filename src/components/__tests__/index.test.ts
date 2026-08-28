import * as components from "@/components/index.ts";

describe("components", () => {
  it("should be defined", () => {
    expect(components).not.toBeUndefined();
    expect(Object.keys(components).length).toBeGreaterThan(0);
  });

  it("should avoid breaking changes", () => {
    expect(components.Root).not.toBeUndefined();
    expect(components.Btn).not.toBeUndefined();
    expect(components.TextField).not.toBeUndefined();
  });
});
