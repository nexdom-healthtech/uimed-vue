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

    it("should use pt-BR texts", () => {
      const plugin = vueTestUtilsPluginUimed();

      expect(plugin.locale.current.value).toBe("pt-BR");
      expect(plugin.locale.t("$vuetify.loading")).toBe("Carregando...");
    });
  });
});
