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

type PasswordToggle = {
  isPasswordField: ComputedRef<boolean>;
  isPasswordVisible: Readonly<Ref<boolean>>;
  icon: ComputedRef<string>;
  toggle: () => void;
};

/**
 * Controls the button that shows or hides a password field's value. The
 * password starts hidden and hides again whenever the type stops being
 * `password`.
 */
export function useTextFieldPasswordToggle(type: MaybeRefOrGetter<TextFieldType>): PasswordToggle {
  const isPasswordField = computed(() => toValue(type) === "password");
  const isPasswordVisible = ref(false);
  const icon = computed(() => (isPasswordVisible.value ? "mdi-eye-off" : "mdi-eye"));

  watch(isPasswordField, () => {
    isPasswordVisible.value = false;
  });

  function toggle() {
    isPasswordVisible.value = !isPasswordVisible.value;
  }

  return { isPasswordField, isPasswordVisible: readonly(isPasswordVisible), icon, toggle };
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
