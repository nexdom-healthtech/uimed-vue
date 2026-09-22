import { createUimed } from "@/index.ts";
import { createVuetify, type ThemeDefinition } from "vuetify";

const light: ThemeDefinition = {
  dark: false,
  colors: {
    background: "#FCFCFD",
    surface: "#C0C9C0",
    primary: "#2A6A47",
    secondary: "#546524",
    success: "#17B26A",
    warning: "#F47920",
    error: "#D92D20",
    info: "#A4D8DE",
  },
  variables: {
    "border-color": "#FCFCFD",
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
        theme: {
          defaultTheme: "system",
          themes: {
            light,
            dark: {
              dark: true,
              colors: {
                ...light.colors,
                background: "053321",
              },
              variables: {
                ...light.variables,
                "border-color": "#344054",
              },
            },
          },
        },
      });
    });
  });
});
