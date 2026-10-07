import type { TextFieldType } from "@/components/inputs/text-field/types.ts";
import { useTextFieldPasswordToggle, useTextFieldType } from "@/composables/inputs/text-field.ts";
import { nextTick, ref } from "vue";

describe("text-field", () => {
  describe("useTextFieldType", () => {
    it.each<[TextFieldType, string]>([
      ["text", "text"],
      ["phone", "tel"],
      ["email", "email"],
      ["url", "url"],
      ["password", "password"],
      ["search", "text"],
    ])('should map type "%s" to the input type "%s"', (type, expected) => {
      expect(useTextFieldType(type, false).value).toBe(expected);
    });

    it("should show a visible password as plain text", () => {
      const isPasswordVisible = ref(false);
      const vuetifyType = useTextFieldType("password", isPasswordVisible);
      expect(vuetifyType.value).toBe("password");

      isPasswordVisible.value = true;

      expect(vuetifyType.value).toBe("text");
    });

    it("should ignore the password visibility on other types", () => {
      expect(useTextFieldType("email", true).value).toBe("email");
    });
  });

  describe("useTextFieldPasswordToggle", () => {
    it.each<[TextFieldType, boolean]>([
      ["text", false],
      ["phone", false],
      ["email", false],
      ["url", false],
      ["password", true],
      ["search", false],
    ])('should identify type "%s" as a password field: %s', (type, expected) => {
      expect(useTextFieldPasswordToggle(type).isPasswordField.value).toBe(expected);
    });

    it("should start hidden, with the icon of the show action", () => {
      const { isPasswordVisible, icon } = useTextFieldPasswordToggle("password");

      expect(isPasswordVisible.value).toBe(false);
      expect(icon.value).toBe("mdi-eye");
    });

    it("should toggle the visibility and its icon", () => {
      const { isPasswordVisible, icon, toggle } = useTextFieldPasswordToggle("password");

      toggle();
      expect(isPasswordVisible.value).toBe(true);
      expect(icon.value).toBe("mdi-eye-off");

      toggle();
      expect(isPasswordVisible.value).toBe(false);
      expect(icon.value).toBe("mdi-eye");
    });

    it("should hide the password again when the type changes away from and back to password", async () => {
      const type = ref<TextFieldType>("password");
      const { isPasswordVisible, toggle } = useTextFieldPasswordToggle(type);
      toggle();

      type.value = "text";
      await nextTick();
      expect(isPasswordVisible.value).toBe(false);

      type.value = "password";
      await nextTick();
      expect(isPasswordVisible.value).toBe(false);
    });

    it("should keep the visibility while the type stays password", async () => {
      const type = ref<TextFieldType>("password");
      const { isPasswordVisible, toggle } = useTextFieldPasswordToggle(type);
      toggle();

      type.value = "password";
      await nextTick();

      expect(isPasswordVisible.value).toBe(true);
    });
  });
});
