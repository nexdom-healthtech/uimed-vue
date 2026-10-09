import { ref } from "vue";
import type { RouteLocationRaw } from "vue-router";
import { useButtonForm, useButtonRoute, useButtonType } from "@/composables/button/button.ts";

describe("useButtonRoute", () => {
  it("should return the route while the button isn't blocked, and follow its changes", () => {
    const route = ref<RouteLocationRaw | undefined>("/patients");
    const blocked = ref(false);
    const result = useButtonRoute(route, blocked);

    expect(result.value).toBe("/patients");

    route.value = { name: "patients" };
    expect(result.value).toEqual({ name: "patients" });

    route.value = undefined;
    expect(result.value).toBeUndefined();
  });

  it("should return undefined while the button is blocked", () => {
    const blocked = ref(true);
    const result = useButtonRoute("/patients", blocked);

    expect(result.value).toBeUndefined();

    blocked.value = false;
    expect(result.value).toBe("/patients");
  });
});

describe("useButtonType", () => {
  it('should default to "button" without a route', () => {
    expect(useButtonType(undefined, undefined, false).value).toBe("button");
  });

  it("should return the type without a route, even while blocked", () => {
    expect(useButtonType("submit", undefined, false).value).toBe("submit");
    expect(useButtonType("submit", undefined, true).value).toBe("submit");
  });

  it("should return undefined with a route, and follow its changes", () => {
    const route = ref<RouteLocationRaw | undefined>({ name: "patients" });
    const result = useButtonType("submit", route, false);

    expect(result.value).toBeUndefined();

    route.value = undefined;
    expect(result.value).toBe("submit");
  });

  it('should return "button" with a route while blocked', () => {
    const blocked = ref(true);
    const result = useButtonType("submit", "/patients", blocked);

    expect(result.value).toBe("button");

    blocked.value = false;
    expect(result.value).toBeUndefined();
  });
});

describe("useButtonForm", () => {
  it("should return the form without a route", () => {
    expect(useButtonForm("form-id", undefined).value).toBe("form-id");
    expect(useButtonForm(undefined, undefined).value).toBeUndefined();
  });

  it("should return undefined with a route", () => {
    const route = ref<RouteLocationRaw | undefined>("https://example.com");
    const result = useButtonForm("form-id", route);

    expect(result.value).toBeUndefined();

    route.value = undefined;
    expect(result.value).toBe("form-id");
  });
});
