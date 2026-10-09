import type { TextFieldProps, TextFieldType } from "@/components/inputs/text-field/types.ts";
import { email, phone, url } from "@/composables/inputs/rules.ts";
import type { Rule } from "@/composables/inputs/types.ts";
import { useRules } from "@/composables/inputs/fields.ts";
import {
  computed,
  readonly,
  ref,
  toValue,
  watch,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import type { VTextField } from "vuetify/components";

type VTextFieldProps = ComponentProps<typeof VTextField>;

type VuetifyType = NonNullable<VTextFieldProps["type"]>;

const textFieldTypeToVuetifyType: Record<TextFieldType, VuetifyType> = {
  text: "text",
  phone: "tel",
  email: "email",
  url: "url",
  password: "password",
  search: "text",
};

const textFieldTypeToVuetifyRule: Record<
  Extract<TextFieldType, "phone" | "email" | "url">,
  Rule
> = {
  phone: phone,
  email: email,
  url: url,
};

/**
 * Maps the field type to the input type, showing as plain text a password
 * the user chose to make visible.
 */
export function useTextFieldType(
  type: MaybeRefOrGetter<TextFieldType>,
  isPasswordVisible: MaybeRefOrGetter<boolean>,
): ComputedRef<VuetifyType> {
  return computed(() => {
    const typeValue = toValue(type);
    if (typeValue === "password" && toValue(isPasswordVisible)) return "text";

    return textFieldTypeToVuetifyType[typeValue];
  });
}

type AppendIconProps = {
  icon: string;
  "aria-label"?: string;
  "aria-pressed"?: boolean;
  onClick?: () => void;
  onKeydown?: (event: KeyboardEvent) => void;
};

type AppendIcon = {
  isPasswordVisible: Readonly<Ref<boolean>>;
  iconProps: ComputedRef<AppendIconProps | undefined>;
};

/**
 * Controls the icon at the end of the field: a decorative magnifier on
 * `search`, and the toggle that shows or hides the value on `password`. The
 * toggle works with click, `Enter` and `Space`, does nothing while disabled,
 * and the password hides again whenever the type stops being `password`.
 */
export function useTextFieldAppendIcon(
  type: MaybeRefOrGetter<TextFieldType>,
  disabled: MaybeRefOrGetter<boolean>,
): AppendIcon {
  const isPasswordField = computed(() => toValue(type) === "password");
  const isPasswordVisible = ref(false);

  watch(isPasswordField, () => {
    isPasswordVisible.value = false;
  });

  function toggle() {
    if (toValue(disabled)) return;

    isPasswordVisible.value = !isPasswordVisible.value;
  }

  // Same keys and handling as the input icons, which only respond to click otherwise
  function onKeydown(event: KeyboardEvent) {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    event.stopPropagation();
    toggle();
  }

  const iconProps = computed<AppendIconProps | undefined>(() => {
    if (toValue(type) === "search") return { icon: "mdi-magnify" };
    if (!isPasswordField.value) return undefined;

    return {
      icon: isPasswordVisible.value ? "mdi-eye-off" : "mdi-eye",
      "aria-label": "Mostrar senha",
      "aria-pressed": isPasswordVisible.value,
      onClick: toggle,
      onKeydown,
    };
  });

  return { isPasswordVisible: readonly(isPasswordVisible), iconProps };
}

export function useTextFieldRules(
  props: Required<Pick<TextFieldProps, "required" | "type">>,
): ComputedRef<Array<Rule>> {
  const defaultRules = useRules(props);

  return computed(() => {
    const rules = [...defaultRules.value];

    const typeRule = associatedRuleType(props.type)
      ? textFieldTypeToVuetifyRule[props.type]
      : undefined;
    if (typeRule) rules.push(typeRule);

    return rules;
  });
}

function associatedRuleType(type: TextFieldType): type is keyof typeof textFieldTypeToVuetifyRule {
  return type in textFieldTypeToVuetifyRule;
}
