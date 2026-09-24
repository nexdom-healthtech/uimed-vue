import * as components from "@/components/index.ts";

describe("components", () => {
  it("should be defined", () => {
    expect(components).not.toBeUndefined();
    expect(Object.keys(components).length).toBeGreaterThan(0);
  });

  it("should avoid breaking changes", () => {
    expect(components.UMain).not.toBeUndefined();
    expect(components.UButton).not.toBeUndefined();
    expect(components.UTextField).not.toBeUndefined();
    expect(components.UContainer).not.toBeUndefined();
    expect(components.URow).not.toBeUndefined();
    expect(components.UColumn).not.toBeUndefined();
    expect(components.UForm).not.toBeUndefined();
    expect(components.USectionContent).not.toBeUndefined();
    expect(components.USection).not.toBeUndefined();
    expect(components.UTable).not.toBeUndefined();
    expect(components.UDetails).not.toBeUndefined();
  });

  it("should prefix every exported component with 'U'", () => {
    for (const name of Object.keys(components)) {
      expect(name).toMatch(/^U[A-Z]/);
    }
  });
});
