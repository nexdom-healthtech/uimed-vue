import type { IsEqual } from "type-fest";
import type { BtnColor, BtnVariant, VBtnProps } from "../types.ts";
import { btnColorToVuetifyColor, btnVariantToVuetifyVariant } from "../types.ts";

describe("btnVariantToVuetifyVariant", () => {
  it("should map `primary` to Vuetify's `elevated` variant", () => {
    expect(btnVariantToVuetifyVariant.primary).toBe("elevated");
  });

  it("should map `secondary` to Vuetify's `flat` variant", () => {
    expect(btnVariantToVuetifyVariant.secondary).toBe("flat");
  });

  it("should map `ghost` to Vuetify's `outlined` variant", () => {
    expect(btnVariantToVuetifyVariant.ghost).toBe("outlined");
  });

  it("should exposes exactly the curated `primary`, `secondary`, and `ghost` variant names", () => {
    expect(Object.keys(btnVariantToVuetifyVariant).sort()).toEqual([
      "ghost",
      "primary",
      "secondary",
    ]);
  });

  it("should types every value as assignable to Vuetify's `VBtn` `variant` prop", () => {
    type VuetifyVariant = NonNullable<VBtnProps["variant"]>;
    const isAssignableToVuetifyVariant: typeof btnVariantToVuetifyVariant extends Record<
      BtnVariant,
      VuetifyVariant
    >
      ? true
      : false = true;

    expect(isAssignableToVuetifyVariant).toBe(true);
  });
});

describe("BtnVariant", () => {
  it("should be exactly `primary` | `secondary` | `ghost`", () => {
    const isExactUnion: IsEqual<BtnVariant, "primary" | "secondary" | "ghost"> = true;

    expect(isExactUnion).toBe(true);
  });
});

describe("btnColorToVuetifyColor", () => {
  it("should map `primary` to Vuetify's `primary` color", () => {
    expect(btnColorToVuetifyColor.primary).toBe("primary");
  });

  it("should map `secondary` to Vuetify's `secondary` color", () => {
    expect(btnColorToVuetifyColor.secondary).toBe("secondary");
  });

  it("should map `positive` to Vuetify's `success` color", () => {
    expect(btnColorToVuetifyColor.positive).toBe("success");
  });

  it("should map `informative` to Vuetify's `info` color", () => {
    expect(btnColorToVuetifyColor.informative).toBe("info");
  });

  it("should map `caution` to Vuetify's `warning` color", () => {
    expect(btnColorToVuetifyColor.caution).toBe("warning");
  });

  it("should map `danger` to Vuetify's `error` color", () => {
    expect(btnColorToVuetifyColor.danger).toBe("error");
  });

  it("should exposes exactly the curated `primary`, `secondary`, `positive`, `informative`, `caution`, and `danger` color names", () => {
    expect(Object.keys(btnColorToVuetifyColor).sort()).toEqual([
      "primary",
      "secondary",
      "caution",
      "danger",
      "informative",
      "positive",
    ]);
  });
});

describe("BtnColor", () => {
  it("should be exactly `primary` | `secondary` | `positive` | `informative` | `caution` | `danger`", () => {
    const isExactUnion: IsEqual<
      BtnColor,
      "primary" | "secondary" | "positive" | "informative" | "caution" | "danger"
    > = true;

    expect(isExactUnion).toBe(true);
  });
});
