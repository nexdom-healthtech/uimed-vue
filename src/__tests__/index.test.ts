import { expect, test } from "vite-plus/test";
import { sayHello } from "@/index.ts";

test("sayHello", () => {
  expect(sayHello()).toBe("Hello, NEXTERS!");
});
