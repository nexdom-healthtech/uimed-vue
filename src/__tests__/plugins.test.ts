import { vitePluginUimed, vitestServerPluginUimed } from "@/plugins.ts";
import vitePluginVuetify from "vite-plugin-vuetify";

vi.mock("vite-plugin-vuetify", () => ({ default: vi.fn() }));

describe("plugins", () => {
  describe("vitePluginUimed", () => {
    it("should call vite-plugin-vuetify", () => {
      expect(vitePluginVuetify).not.toHaveBeenCalled();

      vitePluginUimed();

      expect(vitePluginVuetify).toHaveBeenCalledOnce();
      expect(vitePluginVuetify).toHaveBeenCalledWith({ autoImport: false });
    });
  });

  describe("vitestServerPluginUimed", () => {
    it("should return vuetify as inline deps", () => {
      const server = vitestServerPluginUimed();
      expect(server).toEqual({ deps: { inline: ["vuetify"] } });
    });
  });
});
