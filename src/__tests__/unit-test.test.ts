import { icons } from "@/consts/icons.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import { mdi } from "vuetify/iconsets/mdi-svg";

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

    it("should draw the library's icons as SVGs, also by alias", () => {
      const plugin = vueTestUtilsPluginUimed();

      expect(plugin.icons.defaultSet).toBe("mdi");
      expect(plugin.icons.sets.mdi).toEqual(mdi);
      expect(plugin.icons.aliases).toEqual(expect.objectContaining(icons));
    });

    it("should use pt-BR texts", () => {
      const plugin = vueTestUtilsPluginUimed();

      expect(plugin.locale.current.value).toBe("pt-BR");
      expect(plugin.locale.t("$vuetify.loading")).toBe("Carregando...");
    });
  });
});
