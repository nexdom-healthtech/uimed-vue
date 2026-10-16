export type RuleResult = true | string;

export type Rule = ((v: string) => RuleResult) | ((v: string) => PromiseLike<RuleResult>);

export type AutocompleteRule<T = string> = (v: T | T[] | undefined | null) => RuleResult;

export interface UseRulesOptions {
  required?: boolean;
}

export interface AutocompleteFieldRuleOptions {
  required?: boolean;
  multiple?: boolean;
}

export interface AutocompleteRulesOptions extends AutocompleteFieldRuleOptions {}
