import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

describe("unit-test", () => {
  describe("vueTestUtilsPluginUimed", () => {
    it("should return vuetify global", () => {
      expect(global.ResizeObserver).toBeUndefined();

      const plugin = vueTestUtilsPluginUimed();
      expect(plugin).toEqual(
        expect.objectContaining({
          install: expect.any(Function),
          unmount: expect.any(Function),
          theme: expect.objectContaining({ install: expect.any(Function) }),
        }),
      );

      expect(global.ResizeObserver).not.toBeUndefined();
    });
  });
});
