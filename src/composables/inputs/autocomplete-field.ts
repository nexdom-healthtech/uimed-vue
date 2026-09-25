import { createRequiredRule } from "@/composables/inputs/fields.ts";
import type {
  AutocompleteFieldRuleOptions,
  AutocompleteRule,
  AutocompleteRulesOptions,
} from "@/composables/inputs/types.ts";
import type { ComputedRef, MaybeRefOrGetter } from "vue";
import { computed, toValue } from "vue";
import { isEmpty } from "@nexdom/shared/utils";

export function createAutocompleteRequiredRule<T = string>(
  options: AutocompleteFieldRuleOptions,
): AutocompleteRule<T> {
  return createRequiredRule<T | T[] | undefined | null>(
    options.required,
    (value: T | T[] | undefined | null): boolean => {
      if (options.multiple) {
        const arr = Array.isArray(value) ? value : [];
        return arr.length > 0;
      }

      // Single value case
      const stringValue = String(value ?? "");
      return !isEmpty(stringValue);
    },
  );
}

export function useAutocompleteRules<T = string>(
  options: MaybeRefOrGetter<AutocompleteRulesOptions>,
): ComputedRef<Array<AutocompleteRule<T>>> {
  return computed(() => {
    const opts = toValue(options);
    const rules: Array<AutocompleteRule<T>> = [];

    if (opts.required) {
      rules.push(createAutocompleteRequiredRule<T>(opts));
    }

    return rules;
  });
}
