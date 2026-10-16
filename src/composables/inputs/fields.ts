import type { TextFieldVariant } from "@/components/inputs/text-field/types.ts";
import { required } from "@/composables/inputs/rules.ts";
import type { Rule, RuleResult, UseRulesOptions } from "@/composables/inputs/types.ts";
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";
import type { VTextField } from "vuetify/components";

type VTextFieldProps = InstanceType<typeof VTextField>["$props"];

type VuetifyVariant = NonNullable<VTextFieldProps["variant"]>;

const textFieldVariantToVuetifyVariant: Record<TextFieldVariant, VuetifyVariant> = {
  primary: "underlined",
  secondary: "outlined",
};

export function useTextFieldVariant(
  variant: MaybeRefOrGetter<TextFieldVariant>,
): ComputedRef<VuetifyVariant> {
  return computed(() => {
    const variantValue = toValue(variant);
    return textFieldVariantToVuetifyVariant[variantValue];
  });
}

export function createRequiredRule<T>(
  required: boolean | undefined,
  isPresent: (value: T) => boolean,
): (value: T) => RuleResult {
  return (value: T): RuleResult => {
    if (!required) {
      return true;
    }
    return isPresent(value) || "Campo obrigatório";
  };
}

export function useRules(options: UseRulesOptions): ComputedRef<Array<Rule>> {
  return computed(() => {
    const rules = [];

    if (options.required) rules.push(required);

    return rules;
  });
}
