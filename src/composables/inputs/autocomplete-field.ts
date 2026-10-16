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

/**
 * Menu props that keep the combobox semantics only on the field's `<input>`.
 *
 * The field's container gets `role="combobox"` from the field, which passes its
 * role to both the container and the input, and the menu's ARIA attributes,
 * since it's the menu's activator. Without these props, the container is
 * exposed as an unnamed combobox wrapping the input. The menu removes from its
 * activator the attributes set to `undefined`, role included, and the field
 * never sets that role again, since its value doesn't change. The input keeps
 * its role, label, `aria-expanded` and `aria-controls`. This only happens in
 * the browser: server-rendered HTML still has the role on the container.
 */
export const autocompleteFieldMenuProps = {
  activatorProps: {
    role: undefined,
    "aria-haspopup": undefined,
    "aria-expanded": undefined,
    "aria-controls": undefined,
    "aria-owns": undefined,
  },
} as const;
