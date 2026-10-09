import type { TextFieldType } from "@/components/inputs/text-field/types.ts";
import { useTextFieldAppendIcon, useTextFieldType } from "@/composables/inputs/text-field.ts";
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

  describe("useTextFieldAppendIcon", () => {
    it.each<TextFieldType>(["text", "phone", "email", "url"])(
      'should not render an icon for type "%s"',
      (type) => {
        expect(useTextFieldAppendIcon(type, false).iconProps.value).toBeUndefined();
      },
    );

    it("should render only a decorative magnifier for search", () => {
      expect(useTextFieldAppendIcon("search", false).iconProps.value).toEqual({
        icon: "mdi-magnify",
      });
    });

    it("should start hidden, with a labeled, unpressed toggle and the show icon", () => {
      const { isPasswordVisible, iconProps } = useTextFieldAppendIcon("password", false);

      expect(isPasswordVisible.value).toBe(false);
      expect(iconProps.value).toEqual({
        icon: "mdi-eye",
        "aria-label": "Mostrar senha",
        "aria-pressed": false,
        onClick: expect.any(Function),
        onKeydown: expect.any(Function),
      });
    });

    it("should toggle the visibility, its icon and pressed state on click", () => {
      const { isPasswordVisible, iconProps } = useTextFieldAppendIcon("password", false);

      iconProps.value?.onClick?.();
      expect(isPasswordVisible.value).toBe(true);
      expect(iconProps.value?.icon).toBe("mdi-eye-off");
      expect(iconProps.value?.["aria-pressed"]).toBe(true);

      iconProps.value?.onClick?.();
      expect(isPasswordVisible.value).toBe(false);
      expect(iconProps.value?.icon).toBe("mdi-eye");
      expect(iconProps.value?.["aria-pressed"]).toBe(false);
    });

    it.each(["Enter", " "])('should toggle on "%s", without letting the key go further', (key) => {
      const { isPasswordVisible, iconProps } = useTextFieldAppendIcon("password", false);
      const event = new KeyboardEvent("keydown", { key, cancelable: true });
      const stopPropagation = vi.spyOn(event, "stopPropagation");

      iconProps.value?.onKeydown?.(event);

      expect(isPasswordVisible.value).toBe(true);
      expect(event.defaultPrevented).toBe(true);
      expect(stopPropagation).toHaveBeenCalled();
    });

    it.each(["Tab", "a", "Escape"])('should ignore "%s"', (key) => {
      const { isPasswordVisible, iconProps } = useTextFieldAppendIcon("password", false);
      const event = new KeyboardEvent("keydown", { key, cancelable: true });
      const stopPropagation = vi.spyOn(event, "stopPropagation");

      iconProps.value?.onKeydown?.(event);

      expect(isPasswordVisible.value).toBe(false);
      expect(event.defaultPrevented).toBe(false);
      expect(stopPropagation).not.toHaveBeenCalled();
    });

    it("should not toggle while disabled", () => {
      const disabled = ref(true);
      const { isPasswordVisible, iconProps } = useTextFieldAppendIcon("password", disabled);

      iconProps.value?.onClick?.();
      expect(isPasswordVisible.value).toBe(false);

      iconProps.value?.onKeydown?.(new KeyboardEvent("keydown", { key: "Enter" }));
      expect(isPasswordVisible.value).toBe(false);

      disabled.value = false;
      iconProps.value?.onClick?.();
      expect(isPasswordVisible.value).toBe(true);
    });

    it("should hide the password again when the type changes away from and back to password", async () => {
      const type = ref<TextFieldType>("password");
      const { isPasswordVisible, iconProps } = useTextFieldAppendIcon(type, false);
      iconProps.value?.onClick?.();

      type.value = "text";
      await nextTick();
      expect(isPasswordVisible.value).toBe(false);

      type.value = "password";
      await nextTick();
      expect(isPasswordVisible.value).toBe(false);
    });

    it("should keep the visibility while the type stays password", async () => {
      const type = ref<TextFieldType>("password");
      const { isPasswordVisible, iconProps } = useTextFieldAppendIcon(type, false);
      iconProps.value?.onClick?.();

      type.value = "password";
      await nextTick();

      expect(isPasswordVisible.value).toBe(true);
    });
  });
});
