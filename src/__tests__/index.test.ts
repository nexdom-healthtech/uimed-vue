import { createUimed } from "@/index.ts";
import { createVuetify } from "vuetify";

vi.mock("vuetify", () => ({ createVuetify: vi.fn() }));

describe("index", () => {
  describe("createUimed", () => {
    it("should call createVuetify", () => {
      expect(createVuetify).not.toHaveBeenCalled();

      createUimed();

      expect(createVuetify).toHaveBeenCalledOnce();
      expect(createVuetify).toHaveBeenCalledWith({ theme: { defaultTheme: "light" } });
    });
  });
});
