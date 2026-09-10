import useRouteProps from "@/composables/navigation/use-route-props.ts";
import { ref, toValue } from "vue";

describe("useRouteProps", () => {
  it("shouldn't return `to` and `href` as undefined when provided prop is undefined", () => {
    const help = ref();
    const { href, to } = useRouteProps(help).value;

    expect(to).toBeUndefined();
    expect(href).toBeUndefined();
  });

  it("should only return `to` when vue router route is provided", () => {
    const help = ref({ path: "/help" });
    const { href, to } = useRouteProps(help).value;

    expect(to).toEqual(toValue(help));
    expect(href).toBeUndefined();
  });

  it("should only return `href` when external route is provided", () => {
    const help = ref("https://localhost:8080/help");
    const { href, to } = useRouteProps(help).value;

    expect(to).toBeUndefined();
    expect(href).toEqual(toValue(help));
  });
});
