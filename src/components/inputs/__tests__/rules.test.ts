import { required } from "@/components/inputs/rules.ts";

describe("rules", () => {
  describe("required", () => {
    it("shouldn't accept empty strings", () => {
      expect(required("something")).toBe(true);
      expect(required("")).toBe("Campo obrigatório");
    });
  });
});
