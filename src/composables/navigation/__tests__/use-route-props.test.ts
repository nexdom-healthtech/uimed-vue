import useRouteProps, { routeToListItemProps } from "@/composables/navigation/use-route-props.ts";
import { ref } from "vue";

describe("useRouteProps", () => {
  it("shouldn't return `to` and `href` as undefined when provided prop is undefined", () => {
    const help = ref();
    const props = useRouteProps(help);

    expect(props.value).toHaveProperty("to", help.value);
    expect(props.value).not.toHaveProperty("href");
  });

  it("should only return `to` when vue router route is provided", () => {
    const help = ref({ path: "/help" });
    const props = useRouteProps(help);

    expect(props.value).toHaveProperty("to", help.value);
    expect(props.value).not.toHaveProperty("href");
  });

  it("should only return `href` when external route is provided", () => {
    const help = ref("https://localhost:8080/help");
    const props = useRouteProps(help);

    expect(props.value).not.toHaveProperty("to");
    expect(props.value).toHaveProperty("href", help.value);
  });
});

describe("routeToListItemProps", () => {
  it.each([undefined, ""])("should make an item without a route (%j) a button", (route) => {
    expect(routeToListItemProps(route)).toEqual({ role: "button" });
  });

  it("should link an item with a vue router route", () => {
    const route = { path: "/help" };
    expect(routeToListItemProps(route)).toEqual({ to: route });
  });

  it("should link an item with an external route", () => {
    const route = "https://localhost:8080/help";
    expect(routeToListItemProps(route)).toEqual({ href: route });
  });
});
