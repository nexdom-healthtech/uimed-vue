import { required } from "@/components/inputs/rules.ts";
import type {
  TextFieldProps,
  TextFieldType,
  TextFieldVariant,
} from "@/components/inputs/text-field/types.ts";
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

export function useTextFieldRules(props: TextFieldProps) {
  return computed(() => {
    const rules = [];

    if (props.required) rules.push(required);

    return rules;
  });
}
