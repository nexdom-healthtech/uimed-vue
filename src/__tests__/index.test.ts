// import { components, composables } from "@/index.ts";
import { components } from "@/index.ts";

describe("index", () => {
  it("should export components", () => {
    expect(components).not.toBeUndefined();
  });

  // it.todo("should export composables", () => {
  //   expect(composables).not.toBe(components);
  //   expect(composables).not.toBeUndefined();
  // });
});
