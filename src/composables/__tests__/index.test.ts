import * as composables from "@/composables/index.ts";

describe("composables", () => {
  it("should be defined", () => {
    expect(composables).not.toBeUndefined();
    expect(Object.keys(composables).length).toBeGreaterThan(0);
  });

  it("should avoid breaking changes", () => {
    expect(composables.useToast).not.toBeUndefined();
  });
});
