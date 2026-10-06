import isDeepEqual from "@/utils/is-deep-equal.ts";

class Patient {
  constructor(public name: string) {}
}

describe("isDeepEqual", () => {
  it.each([
    ["equal strings", "Maria", "Maria"],
    ["equal numbers", 1, 1],
    ["NaN", NaN, NaN],
    ["nulls", null, null],
    ["undefined", undefined, undefined],
    ["objects with the same keys in another order", { a: 1, b: 2 }, { b: 2, a: 1 }],
    ["a key holding undefined and a missing key", { a: 1, b: undefined }, { a: 1 }],
    ["a missing key and a key holding undefined", { a: 1 }, { a: 1, b: undefined }],
    ["dates with the same time", new Date(2026, 0, 1), new Date(2026, 0, 1)],
    ["arrays with the same items in order", [1, "a", null], [1, "a", null]],
    ["empty arrays", [], []],
    ["empty objects", {}, {}],
    [
      "objects without prototype and with the same keys",
      Object.assign(Object.create(null), { a: 1 }),
      Object.assign(Object.create(null), { a: 1 }),
    ],
    [
      "nested values",
      { name: "Maria", phones: [{ number: "1234" }], birth: new Date(2000, 1, 2) },
      { birth: new Date(2000, 1, 2), phones: [{ number: "1234" }], name: "Maria" },
    ],
  ])("should consider %s equal", (_, a, b) => {
    expect(isDeepEqual(a, b)).toBe(true);
  });

  it.each([
    ["plain object", { name: "Maria" }],
    ["file", new File(["a"], "a.txt")],
    ["set", new Set([1])],
    ["map", new Map([[1, 1]])],
  ])("should consider the same %s equal", (_, value) => {
    expect(isDeepEqual(value, value)).toBe(true);
  });

  it.each([
    ["different strings", "Maria", "Mariana"],
    ["different numbers", 1, 2],
    ["0 and -0", 0, -0],
    ["a number and its string", 1, "1"],
    ["null and an empty string", null, ""],
    ["null and undefined", null, undefined],
    ["an empty string and undefined", "", undefined],
    ["null and an empty object", null, {}],
    ["an empty object and null", {}, null],
    ["a key holding null and a missing key", { a: null }, {}],
    ["a key holding an empty string and a missing key", { a: "" }, {}],
    ["objects with different values", { a: 1 }, { a: 2 }],
    ["objects with an extra key", { a: 1 }, { a: 1, b: 2 }],
    ["objects with a missing key", { a: 1, b: 2 }, { a: 1 }],
    ["dates with different times", new Date(2026, 0, 1), new Date(2026, 0, 2)],
    ["a date and an empty object", new Date(2026, 0, 1), {}],
    ["an empty object and a date", {}, new Date(2026, 0, 1)],
    ["a date and its time", new Date(2026, 0, 1), new Date(2026, 0, 1).getTime()],
    ["arrays with items in another order", [1, 2], [2, 1]],
    ["an array and its prefix", [1, 2], [1]],
    ["an array and a longer one", [1], [1, 2]],
    ["an empty array and an empty object", [], {}],
    ["an empty object and an empty array", {}, []],
    ["an array and an object with the same keys", ["a"], { 0: "a" }],
    ["an empty array and an object with its length", [], { length: 0 }],
    ["an object with a length and an empty array", { length: 0 }, []],
    [
      "objects without prototype and with different values",
      Object.assign(Object.create(null), { a: 1 }),
      Object.assign(Object.create(null), { a: 2 }),
    ],
    ["different files", new File(["a"], "a.txt"), new File(["b"], "b.txt")],
    ["files with the same content", new File(["a"], "a.txt"), new File(["a"], "a.txt")],
    ["blobs with the same content", new Blob(["a"]), new Blob(["a"])],
    ["different sets", new Set([1]), new Set([1, 2])],
    ["sets with the same items", new Set([1]), new Set([1])],
    ["different maps", new Map([[1, 1]]), new Map()],
    ["maps with the same entries", new Map([[1, 1]]), new Map([[1, 1]])],
    ["instances of a class with the same properties", new Patient("Maria"), new Patient("Maria")],
    ["a class instance and a plain object", new Patient("Maria"), { name: "Maria" }],
    ["a plain object and a class instance", { name: "Maria" }, new Patient("Maria")],
    ["nested files", { file: new File(["a"], "a.txt") }, { file: new File(["b"], "b.txt") }],
    ["nested values", { phones: [{ number: "1234" }] }, { phones: [{ number: "4321" }] }],
  ])("should consider %s different", (_, a, b) => {
    expect(isDeepEqual(a, b)).toBe(false);
  });
});
