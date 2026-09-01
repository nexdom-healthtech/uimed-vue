import { computed, type ComputedRef } from "vue";

import type { Rule } from "@/composables/inputs/types.ts";
import { required } from "@/composables/inputs/rules.ts";

interface Options {
  required?: boolean;
}

export default function useRules(options: Options): ComputedRef<Array<Rule>> {
  return computed(() => {
    const rules = [];

    if (options.required) rules.push(required);

    return rules;
  });
}
