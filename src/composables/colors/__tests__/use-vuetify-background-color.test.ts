import { ref } from "vue";
import useVuetifyBackgroundColor from "@/composables/colors/use-vuetify-background-color.ts";
import type { ColorVariant } from "@/composables/colors/types.ts";

describe("useVuetifyBackgroundColor", () => {
  it.each([
    ["primary", "bg-primary"],
    ["secondary", "bg-secondary"],
    ["positive", "bg-success"],
    ["informative", "bg-info"],
    ["caution", "bg-warning"],
    ["danger", "bg-error"],
  ] as const)('should return "%s" as "%s"', (color, expectedClass) => {
    expect(useVuetifyBackgroundColor(color).value).toBe(expectedClass);
  });

  it("should return no class when the color is omitted", () => {
    expect(useVuetifyBackgroundColor(undefined).value).toBeUndefined();
  });

  it("should react to changes", () => {
    const color = ref<ColorVariant | undefined>("primary");
    const backgroundClass = useVuetifyBackgroundColor(color);
    expect(backgroundClass.value).toBe("bg-primary");

    color.value = "danger";
    expect(backgroundClass.value).toBe("bg-error");

    color.value = undefined;
    expect(backgroundClass.value).toBeUndefined();
  });

  it("should accept a getter", () => {
    expect(useVuetifyBackgroundColor(() => "caution").value).toBe("bg-warning");
  });
});
