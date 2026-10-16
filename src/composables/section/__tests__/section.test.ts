import { ref } from "vue";
import type { SectionProps } from "@/components/sections/section/types.ts";
import { useSectionTextAlign, useSectionVariant } from "@/composables/section/section.ts";

describe("useSectionVariant", () => {
  it.each([
    ["primary", "elevated"],
    ["secondary", "outlined"],
  ] as const)("should map %s to %s", (variant, vuetifyVariant) => {
    expect(useSectionVariant(variant).value).toBe(vuetifyVariant);
  });

  it("should fall back to elevated when undefined", () => {
    expect(useSectionVariant(undefined).value).toBe("elevated");
  });
});

describe("useSectionTextAlign", () => {
  it.each([
    ["start", "text-start", "justify-end"],
    ["center", "text-center", "justify-center"],
    ["end", "text-end", "justify-end"],
  ] as const)(
    "should map %s to the %s content class and the %s actions class",
    (textAlign, content, actions) => {
      expect(useSectionTextAlign(textAlign).value).toEqual({ content, actions });
    },
  );

  it("should fall back to start when undefined", () => {
    expect(useSectionTextAlign(undefined).value).toEqual({
      content: "text-start",
      actions: "justify-end",
    });
  });

  it("should react to changes", () => {
    const textAlign = ref<SectionProps["textAlign"]>("center");
    const classes = useSectionTextAlign(textAlign);
    expect(classes.value).toEqual({ content: "text-center", actions: "justify-center" });

    textAlign.value = "end";
    expect(classes.value).toEqual({ content: "text-end", actions: "justify-end" });

    textAlign.value = undefined;
    expect(classes.value).toEqual({ content: "text-start", actions: "justify-end" });
  });

  it("should accept a getter", () => {
    expect(useSectionTextAlign(() => "center").value).toEqual({
      content: "text-center",
      actions: "justify-center",
    });
  });
});
