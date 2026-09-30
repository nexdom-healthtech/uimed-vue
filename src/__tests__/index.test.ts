import { createUimed } from "@/index.ts";
import { createVuetify, type ThemeDefinition } from "vuetify";

const light: ThemeDefinition = {
  dark: false,
  colors: {
    background: "#EAEDF0",
    surface: "#FCFCFD",
    primary: "#00995D",
    secondary: "#FCFCFD",
    success: "#A9EFC5",
    warning: "#FFE596",
    error: "#D92D20",
    info: "#9ACBE5",
  },
  variables: {
    "border-color": "#D0D5DD",
  },
};

vi.mock("vuetify", () => ({ createVuetify: vi.fn() }));

describe("index", () => {
  describe("createUimed", () => {
    it("should call createVuetify", () => {
      expect(createVuetify).not.toHaveBeenCalled();

      createUimed();

      expect(createVuetify).toHaveBeenCalledOnce();
      expect(createVuetify).toHaveBeenCalledWith({
        theme: { defaultTheme: "light", themes: { light } },
      });
    });
  });
});
