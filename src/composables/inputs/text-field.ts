import type {
  TextFieldProps,
  TextFieldType,
  TextFieldVariant,
} from "@/components/inputs/text-field/types.ts";
import { email, phone, url } from "@/composables/inputs/rules.ts";
import type { Rule } from "@/composables/inputs/types.ts";
import useRules from "@/composables/inputs/use-rules.ts";
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";
import type { VTextField } from "vuetify/components";

type VTextFieldProps = InstanceType<typeof VTextField>["$props"];

type VuetifyVariant = NonNullable<VTextFieldProps["variant"]>;

type VuetifyType = NonNullable<VTextFieldProps["type"]>;

const textFieldVariantToVuetifyVariant: Record<TextFieldVariant, VuetifyVariant> = {
  primary: "underlined",
  secondary: "outlined",
};

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

export function useTextFieldVariant(
  variant: MaybeRefOrGetter<TextFieldVariant | undefined>,
): ComputedRef<VuetifyVariant> {
  return computed(() => {
    const variantValue = toValue(variant);
    return variantValue
      ? textFieldVariantToVuetifyVariant[variantValue]
      : textFieldVariantToVuetifyVariant.primary;
  });
}

export function useTextFieldType(
  type: MaybeRefOrGetter<TextFieldType | undefined>,
): ComputedRef<VuetifyType> {
  return computed(() => {
    const typeValue = toValue(type);
    return typeValue ? textFieldTypeToVuetifyType[typeValue] : textFieldTypeToVuetifyType.text;
  });
}

export function useTextFieldRules(props: TextFieldProps): ComputedRef<Array<Rule>> {
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

function associatedRuleType(type?: TextFieldType): type is keyof typeof textFieldTypeToVuetifyRule {
  return type! in textFieldTypeToVuetifyRule;
}
