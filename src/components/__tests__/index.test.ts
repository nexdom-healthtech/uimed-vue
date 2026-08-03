import * as components from "@/components/index.ts";

describe("components", () => {
  it("should be defined", () => {
    expect(components).not.toBeUndefined();
    expect(Object.keys(components).length).toBeGreaterThan(0);
  });
});
