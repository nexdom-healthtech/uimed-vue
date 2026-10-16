import { ref } from "vue";
import { useFullHeight, useFullWidth } from "@/composables/dimensions/dimensions.ts";

describe.each([
  ["useFullWidth", useFullWidth, "w-100"],
  ["useFullHeight", useFullHeight, "h-100"],
] as const)("%s", (_, useDimension, expectedClass) => {
  it(`should return "${expectedClass}" when true`, () => {
    expect(useDimension(true).value).toBe(expectedClass);
  });

  it.each([false, undefined])("should return no class when %s", (value) => {
    expect(useDimension(value).value).toBeUndefined();
  });

  it("should react to changes", () => {
    const value = ref<boolean | undefined>(true);
    const dimensionClass = useDimension(value);
    expect(dimensionClass.value).toBe(expectedClass);

    value.value = false;
    expect(dimensionClass.value).toBeUndefined();
  });

  it("should accept a getter", () => {
    expect(useDimension(() => true).value).toBe(expectedClass);
  });
});
